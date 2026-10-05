// Bot defences shared by every form route: honeypot, Turnstile, then the
// per-visitor limit (after Turnstile, so bots never spend D1 writes).
import { envVar } from './ghl/client';
import { verifyTurnstile, siteTurnstileHostnames } from './turnstile';
import { overLimit } from './visitor-limit';

/** Hidden field real people never see. Neutral name so password managers leave it alone. */
export const HONEYPOT = 'hp_check';
const EMAIL = 'guidingwindsunplug@gmail.com';

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

/** Form or JSON body as a plain object; null if it can't be read. */
export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (request.headers.get('content-type') ?? '').includes('application/json')
      ? ((await request.json()) as Record<string, unknown>)
      : Object.fromEntries(await request.formData());
  } catch {
    return null;
  }
}

/** A response to send back if this submission should stop here, or null to continue. */
export async function rejectBots(request: Request, payload: Record<string, unknown>, route: string): Promise<Response | null> {
  const hp = payload[HONEYPOT];
  if (typeof hp === 'string' && hp.trim()) {
    console.log(`[${route}] honeypot tripped`);
    // 200 with an email fallback: a bot learns nothing, a real person who
    // somehow filled the hidden field still has a way to reach us.
    return json({ ok: false, error: `We couldn't send that automatically. Please email ${EMAIL} and we'll reply within 24 hours.`, mailto: `mailto:${EMAIL}` });
  }
  const token = payload['cf-turnstile-response'];
  const human = await verifyTurnstile({
    secret: envVar('TURNSTILE_SECRET_KEY'),
    token: typeof token === 'string' && token.length <= 2048 ? token : undefined,
    ip: request.headers.get('CF-Connecting-IP'),
    hostnames: siteTurnstileHostnames(),
  });
  if (!human) return json({ ok: false, error: 'Please complete the security check and try again.' }, 400);
  if (await overLimit(request, route)) {
    return json({ ok: false, error: `Too many requests from this connection. Try again in an hour, or email ${EMAIL}.` }, 429, { 'Retry-After': '3600' });
  }
  return null;
}
