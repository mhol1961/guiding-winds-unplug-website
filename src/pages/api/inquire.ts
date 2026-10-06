export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { upsertContact, saveAttribution } from '../../lib/ghl/contacts';
import { json, readBody, rejectBots } from '../../lib/form-guard';
import { pickAttribution, isMetaAd } from '../../lib/attribution';

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
});

const REGION_TAG: Record<string, string> = {
  bvi: 'inquiry-bvi',
  bahamas: 'inquiry-bahamas',
  mediterranean: 'inquiry-mediterranean',
};

const FIELD_LABELS: Record<string, string> = {
  firstName: 'first name',
  lastName: 'last name',
  email: 'email',
  phone: 'phone',
  partySize: 'party size',
  week: 'week',
  notes: 'notes',
};

export const POST: APIRoute = async ({ request }) => {
  const payload = await readBody(request);
  if (payload instanceof Response) return payload;

  const parsed = InquirySchema.safeParse(payload);
  if (!parsed.success) {
    const fields = z.flattenError(parsed.error).fieldErrors;
    const names = Object.keys(fields).map((k) => FIELD_LABELS[k] ?? k);
    return json({ ok: false, error: `Please check your ${names.join(', ')}.`, fields }, 422);
  }

  const rejected = await rejectBots(request, payload, 'inquire');
  if (rejected) return rejected;

  const data = parsed.data;
  const attribution = pickAttribution(payload);
  const tags = ['inquiry', 'website-2026'];
  if (data.region && REGION_TAG[data.region]) tags.push(REGION_TAG[data.region]);
  if (isMetaAd(attribution)) tags.push('source_facebook_instagram');

  try {
    const { contact } = await upsertContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      tags,
      customFields: [
        { key: 'preferred_week', field_value: data.week ?? '' },
        { key: 'party_size', field_value: data.partySize },
        { key: 'inquiry_notes', field_value: data.notes ?? '' },
        { key: 'inquiry_source', field_value: data.source ?? 'guidingwinds-unplug.com' },
      ],
      source: data.source ?? 'website-2026',
    });
    await saveAttribution(contact?.id, attribution);
  } catch (err) {
    console.error('[inquire] GHL upsert failed', err);
    // The client renders this mailto so the lead is never lost.
    return json(
      {
        ok: false,
        error: 'Our form is temporarily down. Email guidingwindsunplug@gmail.com directly and we will reply within 24 hours.',
        mailto: `mailto:guidingwindsunplug@gmail.com?subject=Inquiry%20from%20${encodeURIComponent(
          data.firstName + ' ' + data.lastName,
        )}&body=${encodeURIComponent(
          `Hi Dodie,\n\nI tried to submit through the website but the form is down. My details:\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone ?? ''}\nParty size: ${data.partySize}\nPreferred week: ${data.week ?? 'flexible'}\nRegion: ${data.region ?? ''}\nNotes:\n${data.notes ?? ''}\n\nThanks,\n${data.firstName}`,
        )}`,
      },
      503,
    );
  }

  // No-JS form posts go to the thank-you page; fetch callers get JSON.
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json') ||
    (request.headers.get('content-type') ?? '').includes('application/json');
  if (!wantsJson) return new Response(null, { status: 303, headers: { Location: '/inquire/thank-you' } });
  return json({ ok: true, message: 'Inquiry received. We will reply within 24 hours.' });
};
