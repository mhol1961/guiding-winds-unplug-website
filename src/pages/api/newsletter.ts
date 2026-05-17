export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { upsertContact } from '../../lib/ghl/contacts';
import { rateLimit, clientKey } from '../../lib/utils/rate-limit';

const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  website: z.string().max(0).default(''), // honeypot
  source: z.string().trim().max(60).optional(),
});

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const limit = rateLimit(clientKey(request, 'newsletter'), { windowMs: 60 * 60 * 1000, max: 5 });
  if (!limit.ok) {
    return jsonResponse(
      { ok: false, error: 'Too many subscriptions from this connection. Try again in a few minutes.' },
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

  const parsed = NewsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(
      { ok: false, error: 'Email is required.', fields: parsed.error.flatten().fieldErrors },
      422,
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    console.log('[newsletter] honeypot tripped', { email: parsed.data.email });
    return jsonResponse({ ok: true, message: 'Subscribed.' });
  }

  try {
    await upsertContact({
      email: parsed.data.email,
      tags: ['newsletter', 'website-2026'],
      source: parsed.data.source ?? 'guidingwinds-unplug.com',
    });
  } catch (err) {
    console.error('[newsletter] GHL upsert failed', err);
    return jsonResponse(
      {
        ok: false,
        error:
          'Subscription is temporarily down. Email dodie@guidingwinds-unplug.com to subscribe directly.',
      },
      503,
    );
  }

  return jsonResponse({
    ok: true,
    message: 'Subscribed. Watch for the welcome email.',
  });
};
