// Bot defences shared by every form route, cheapest first: body size cap,
// honeypot, a loose per-visitor attempt limit (so junk with fake tokens can't
// make us call Turnstile forever), Turnstile, then the strict per-visitor
// limit on submissions that passed it.
import { envVar } from './ghl/client';
import { verifyTurnstile, siteTurnstileHostnames } from './turnstile';
import { overLimit } from './visitor-limit';

/** Hidden field real people never see. Neutral name so password managers leave it alone. */
export const HONEYPOT = 'hp_check';
const EMAIL = 'guidingwindsunplug@gmail.com';

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

/** Our forms send well under 4KB; anything past this is not a real visitor. */
export const MAX_BODY_BYTES = 16 * 1024;
const ATTEMPTS_PER_HOUR = 30;
const SUBMISSIONS_PER_HOUR = 5;

/** Form or JSON body as a plain object, or the error Response to send back. */
export async function readBody(request: Request): Promise<Record<string, unknown> | Response> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    await request.body?.cancel().catch(() => {}); // discard it unread, cleanly
    return json({ ok: false, error: 'That submission is too large.' }, 413);
  }
  try {
    const buf = await request.arrayBuffer(); // length header can be absent or wrong
    if (buf.byteLength > MAX_BODY_BYTES) return json({ ok: false, error: 'That submission is too large.' }, 413);
    const type = request.headers.get('content-type') ?? '';
    return type.includes('application/json')
      ? (JSON.parse(new TextDecoder().decode(buf)) as Record<string, unknown>)
      : Object.fromEntries(await new Response(buf, { headers: { 'content-type': type } }).formData());
  } catch {
    return json({ ok: false, error: 'Bad request body.' }, 400);
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
  if (await overLimit(request, `${route}:try`, ATTEMPTS_PER_HOUR)) return tooMany();
  const token = payload['cf-turnstile-response'];
  const human = await verifyTurnstile({
    secret: envVar('TURNSTILE_SECRET_KEY'),
    token: typeof token === 'string' && token.length <= 2048 ? token : undefined,
    ip: request.headers.get('CF-Connecting-IP'),
    hostnames: siteTurnstileHostnames(),
  });
  if (!human) return json({ ok: false, error: 'Please complete the security check and try again.' }, 400);
  if (await overLimit(request, route, SUBMISSIONS_PER_HOUR)) return tooMany();
  return null;
}

function tooMany(): Response {
  return json({ ok: false, error: `Too many requests from this connection. Try again in an hour, or email ${EMAIL}.` }, 429, { 'Retry-After': '3600' });
}
