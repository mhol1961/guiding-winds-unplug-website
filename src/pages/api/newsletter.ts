export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { upsertContact, saveAttribution } from '../../lib/ghl/contacts';
import { json, readBody, rejectBots } from '../../lib/form-guard';
import { pickAttribution, isMetaAd } from '../../lib/attribution';

const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const POST: APIRoute = async ({ request }) => {
  const payload = await readBody(request);
  if (!payload) return json({ ok: false, error: 'Bad request body.' }, 400);

  const parsed = NewsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: 'Please enter a valid email address.', fields: z.flattenError(parsed.error).fieldErrors }, 422);
  }

  const rejected = await rejectBots(request, payload, 'newsletter');
  if (rejected) return rejected;

  const attribution = pickAttribution(payload);
  const tags = ['newsletter', 'website-2026'];
  if (isMetaAd(attribution)) tags.push('source_facebook_instagram');

  try {
    const { contact } = await upsertContact({
      email: parsed.data.email,
      tags,
      source: 'Deck Notes newsletter',
    });
    await saveAttribution(contact?.id, attribution);
  } catch (err) {
    console.error('[newsletter] GHL upsert failed', err);
    return json(
      { ok: false, error: 'Subscription is temporarily down. Email guidingwindsunplug@gmail.com to subscribe directly.' },
      503,
    );
  }

  return json({ ok: true, message: 'Subscribed. Watch for the welcome email.' });
};

