export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { upsertContact } from '../../lib/ghl/contacts';
import { rateLimit, clientKey } from '../../lib/utils/rate-limit';

const InquirySchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  partySize: z.string().trim().max(60),
  week: z.string().trim().max(120).optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  region: z.enum(['bvi', 'bahamas', 'mediterranean', '']).optional(),
  source: z.string().trim().max(60).optional(),
  // Honeypot - must be empty. Bots filling fields will land here.
  website: z.string().max(0).default(''),
});

const REGION_TAG: Record<string, string> = {
  bvi: 'inquiry-bvi',
  bahamas: 'inquiry-bahamas',
  mediterranean: 'inquiry-mediterranean',
};

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function htmlRedirect(to: string): Response {
  return new Response(null, { status: 303, headers: { Location: to } });
}

export const POST: APIRoute = async ({ request }) => {
  // Rate limit FIRST so we don't waste cycles on a flood.
  const limit = rateLimit(clientKey(request, 'inquire'), { windowMs: 60 * 60 * 1000, max: 5 });
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

  const parsed = InquirySchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(
      { ok: false, error: 'Some fields need attention.', fields: parsed.error.flatten().fieldErrors },
      422,
    );
  }

  const data = parsed.data;

  // Honeypot tripped - return 200 but signal ok:false so the client JS
  // does NOT navigate to /inquire/thank-you (bots polluting analytics
  // goal completions). The message looks benign so the bot can't tell
  // it was caught.
  if (data.website && data.website.length > 0) {
    console.log('[inquire] honeypot tripped, ignoring', { email: data.email });
    return jsonResponse({
      ok: false,
      silent: true,
      message: 'Thanks - we will be in touch within 24 hours.',
    });
  }

  const tags = ['inquiry', 'website-2026'];
  if (data.region && REGION_TAG[data.region]) tags.push(REGION_TAG[data.region]);

  const customFields = [
    { key: 'preferred_week', field_value: data.week ?? '' },
    { key: 'party_size', field_value: data.partySize },
    { key: 'inquiry_notes', field_value: data.notes ?? '' },
    { key: 'inquiry_source', field_value: data.source ?? 'guidingwinds-unplug.com' },
  ];

  try {
    await upsertContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      tags,
      customFields,
      source: data.source ?? 'website-2026',
    });
  } catch (err) {
    console.error('[inquire] GHL upsert failed', err);
    // Hard failure path - surface a mailto fallback in the JSON response.
    // The InquiryForm client script renders the fallback to the user.
    return jsonResponse(
      {
        ok: false,
        error:
          'Our form is temporarily down. Email dodie@guidingwinds-unplug.com directly and we will reply within 24 hours.',
        mailto: `mailto:dodie@guidingwinds-unplug.com?subject=Inquiry%20%E2%80%94%20${encodeURIComponent(
          data.firstName + ' ' + data.lastName,
        )}&body=${encodeURIComponent(
          `Hi Dodie,\n\nI tried to submit through the website but the form is down. My details:\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone ?? ''}\nParty size: ${data.partySize}\nPreferred week: ${data.week ?? 'flexible'}\nRegion: ${data.region ?? ''}\nNotes:\n${data.notes ?? ''}\n\nThanks,\n${data.firstName}`,
        )}`,
      },
      503,
    );
  }

  // If the client sent application/x-www-form-urlencoded (no JS), do a
  // 303 redirect to a thank-you page. Programmatic JSON callers get a JSON
  // success.
  const accept = request.headers.get('accept') ?? '';
  if (!accept.includes('application/json') && !contentType.includes('application/json')) {
    return htmlRedirect('/inquire/thank-you');
  }
  return jsonResponse({ ok: true, message: 'Inquiry received. We will reply within 24 hours.' });
};
