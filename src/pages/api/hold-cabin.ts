export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getCollection } from 'astro:content';
import { upsertContact } from '../../lib/ghl/contacts';
import { createHoldAppointment } from '../../lib/ghl/calendars';
import { getCalendarIds, type CalendarRegion } from '../../lib/ghl/client';
import { rateLimit, clientKey } from '../../lib/utils/rate-limit';

const HoldSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  partySize: z.string().trim().max(60),
  voyageSlug: z.enum([
    'british-virgin-islands',
    'bahamas',
    'italy',
    'greece',
    'croatia',
  ]),
  weekStart: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  weekEnd: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  website: z.string().max(0).default(''),
});

const REGION_FOR: Record<string, CalendarRegion> = {
  'british-virgin-islands': 'bvi',
  bahamas: 'bahamas',
  italy: 'mediterranean',
  greece: 'mediterranean',
  croatia: 'mediterranean',
};

const REGION_TAG: Record<string, string> = {
  'british-virgin-islands': 'inquiry-bvi',
  bahamas: 'inquiry-bahamas',
  italy: 'inquiry-mediterranean',
  greece: 'inquiry-mediterranean',
  croatia: 'inquiry-mediterranean',
};

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const limit = rateLimit(clientKey(request, 'hold'), { windowMs: 60 * 60 * 1000, max: 5 });
  if (!limit.ok) {
    return jsonResponse(
      { ok: false, error: 'Too many requests. Try again in a few minutes.' },
      429,
      { 'Retry-After': limit.retryAfterSec.toString() },
    );
  }

  let payload: Record<string, FormDataEntryValue> = {};
  const contentType = request.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('application/json')) {
      payload = (await request.json()) as Record<string, FormDataEntryValue>;
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form);
    }
  } catch {
    return jsonResponse({ ok: false, error: 'Bad request body.' }, 400);
  }

  const parsed = HoldSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(
      {
        ok: false,
        error: 'Some fields need attention.',
        fields: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }
  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    console.log('[hold] honeypot tripped', { email: data.email });
    return jsonResponse({ ok: false, silent: true, message: 'Hold requested.' });
  }

  // Authoritative inventory check (per Codex final review): the regex on
  // weekStart/weekEnd only validates SHAPE. We also need to confirm the
  // requested week actually exists in the voyage's availableWeeks AND has
  // cabins remaining. Otherwise a bot can POST any well-formed date pair
  // and create bogus holds in Dodie's GHL, which then trigger W6 (hold
  // expiring) workflows for inventory that doesn't exist. Manual recovery
  // pollutes her inbox.
  const voyages = await getCollection('voyages');
  const voyage = voyages.find((v) => v.data.slug === data.voyageSlug);
  if (!voyage) {
    return jsonResponse({ ok: false, error: 'Unknown voyage.' }, 422);
  }
  const week = voyage.data.availableWeeks.find(
    (w) => w.start === data.weekStart && w.end === data.weekEnd,
  );
  if (!week) {
    return jsonResponse(
      {
        ok: false,
        error: 'That week is not on the 2027 calendar. See /calendar for available dates.',
      },
      422,
    );
  }
  if (week.cabinsAvailable <= 0) {
    return jsonResponse(
      {
        ok: false,
        error:
          'That week is sold out. Use the inquiry form to be added to the waitlist.',
        fallbackUrl: `/inquire?voyage=${data.voyageSlug}`,
      },
      409,
    );
  }

  const region = REGION_FOR[data.voyageSlug];
  const calendarId = getCalendarIds()[region];
  if (!calendarId) {
    console.error(`[hold] no calendar configured for region ${region}`);
    return jsonResponse(
      {
        ok: false,
        error:
          'Cabin hold is temporarily unavailable. Submit the inquiry form and we will confirm by email.',
        fallbackUrl: `/inquire?voyage=${data.voyageSlug}`,
      },
      503,
    );
  }

  // Hold runs from now → +72h. The voyage week dates are passed via custom
  // fields so Dodie can see which week the guest wants. The GHL appointment
  // is a calendar event for tracking the hold itself.
  const startTime = new Date().toISOString();
  const endTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

  const customFields = [
    { key: 'preferred_week', field_value: `${data.weekStart} → ${data.weekEnd}` },
    { key: 'party_size', field_value: data.partySize },
    { key: 'inquiry_notes', field_value: data.notes ?? '' },
    { key: 'inquiry_source', field_value: 'guidingwinds-unplug.com - hold-cabin' },
    { key: 'voyage_slug', field_value: data.voyageSlug },
  ];

  try {
    const upsert = await upsertContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      tags: ['inquiry', 'hold-cabin', 'website-2026', REGION_TAG[data.voyageSlug]],
      customFields,
      source: 'guidingwinds-unplug.com',
    });

    const contactId = (upsert as { contact?: { id?: string } } | undefined)?.contact?.id;
    if (!contactId) {
      // DRY_RUN_GHL returns no contact id; that's fine.
      console.log('[hold] no contact id returned (likely DRY_RUN). Skipping appointment.');
      return jsonResponse({
        ok: true,
        message: 'Hold logged. Watch for confirmation by email.',
      });
    }

    await createHoldAppointment({
      calendarId,
      contactId,
      startTime,
      endTime,
      title: `Cabin hold - ${data.firstName} ${data.lastName} - ${data.voyageSlug} ${data.weekStart}`,
      notes: data.notes ?? '',
    });
  } catch (err) {
    console.error('[hold] failed', err);
    return jsonResponse(
      {
        ok: false,
        error:
          'Cabin hold is temporarily unavailable. Use the inquiry form and we will confirm by email.',
        fallbackUrl: `/inquire?voyage=${data.voyageSlug}`,
      },
      503,
    );
  }

  return jsonResponse({
    ok: true,
    message: `Held until ${new Date(Date.now() + 72 * 60 * 60 * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' })}. Check your email for confirmation.`,
  });
};
