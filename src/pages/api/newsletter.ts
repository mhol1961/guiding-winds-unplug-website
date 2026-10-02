export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { upsertContact } from '../../lib/ghl/contacts';
import { envVar } from '../../lib/ghl/client';
import { rateLimit, clientKey } from '../../lib/utils/rate-limit';
import { allowedHostnames, verifyTurnstile } from '../../lib/turnstile';

const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  website: z.string().max(0).default(''), // honeypot
  'cf-turnstile-response': z.string().max(2048).optional(),
});

// Tokens must come from our own site. Cloudflare's test keys report
// example.com, so local dev with those keys still works.
const TURNSTILE_HOSTS = allowedHostnames(import.meta.env.SITE);
if (import.meta.env.DEV) TURNSTILE_HOSTS.push('example.com');

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

  const human = await verifyTurnstile({
    secret: envVar('TURNSTILE_SECRET_KEY'),
    token: parsed.data['cf-turnstile-response'],
    ip: request.headers.get('CF-Connecting-IP'),
    hostnames: TURNSTILE_HOSTS,
  });
  if (!human) {
    return jsonResponse(
      { ok: false, error: 'Please complete the security check and try again.' },
      400,
    );
  }

  try {
    await upsertContact({
      email: parsed.data.email,
      tags: ['newsletter', 'website-2026'],
      source: 'Field Notes newsletter',
    });
  } catch (err) {
    console.error('[newsletter] GHL upsert failed', err);
    return jsonResponse(
      {
        ok: false,
        error:
          'Subscription is temporarily down. Email guidingwindsunplug@gmail.com to subscribe directly.',
      },
      503,
    );
  }

  return jsonResponse({
    ok: true,
    message: 'Subscribed. Watch for the welcome email.',
  });
};
