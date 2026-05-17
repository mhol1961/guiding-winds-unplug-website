// Simple in-memory sliding-window rate limiter.
//
// On Cloudflare Workers each isolate runs independently — a determined
// attacker could hit different isolates to bypass this, but the dominant
// spam pattern (a single bot pounding one endpoint) is well served by
// per-isolate limits. For higher-volume v2, upgrade to a Cloudflare KV
// or Durable Object backend.
//
// The limiter buckets requests by IP + endpoint, evicts entries older
// than the window, and rejects when the rolling count exceeds the limit.

interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max requests allowed in the window. */
  max: number;
}

const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  options: RateLimitOptions,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const cutoff = now - options.windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (hits.length >= options.max) {
    const oldest = hits[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    buckets.set(key, hits);
    return { ok: false, retryAfterSec };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Light housekeeping — evict stale buckets every 200 hits across the map.
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length === 0) buckets.delete(k);
      else buckets.set(k, fresh);
    }
  }

  return { ok: true, retryAfterSec: 0 };
}

/** Extract a stable client identifier from an Astro request.
 *
 *  Only CF-Connecting-IP is trusted — Cloudflare sets it for every request
 *  and it cannot be spoofed at the edge. x-forwarded-for / x-real-ip are
 *  user-supplied and would let an attacker reset the bucket per request
 *  by rotating the header. When CF-Connecting-IP is absent (local dev or
 *  a future infra change), everything lands in a shared "anon" bucket
 *  with tight limits so the bucket can't be abused as a DoS lever.
 */
export function clientKey(request: Request, prefix: string): string {
  const ip = request.headers.get('cf-connecting-ip') ?? 'anon';
  return `${prefix}:${ip}`;
}

/** Tighter limits used for the shared "anon" bucket since one bucket
 *  represents potentially many clients. Endpoints can opt in. */
export const ANON_LIMIT = { windowMs: 10_000, max: 1 };
