// Route helper around allowRequest: keys on CF-Connecting-IP + route.
// The ip_hits table is created by the Worker itself on first use after every
// deploy (same SQL as migrations/0001_lead_limits.sql), so it can't go
// missing: Workers Builds' default token has no D1 permission, so a
// deploy-time `wrangler d1 migrations apply` would just fail.
import { env } from 'cloudflare:workers';
import SCHEMA from '../../migrations/0001_lead_limits.sql?raw';
import { allowRequest, type D1Like } from './lead-limits';

let ready: Promise<unknown> | null = null;

function leadDb(): D1Like | undefined {
  return (env as { LEAD_DB?: D1Like }).LEAD_DB;
}

/** Create the ip_hits table if needed (once per Worker isolate). */
export function ensureLimitTable(db: D1Like): Promise<unknown> {
  ready ??= db.prepare(SCHEMA).bind().run().catch((err) => {
    ready = null;
    console.error('[limit] COULD NOT CREATE ip_hits; visitor limits are OFF until this is fixed', err);
    throw err;
  });
  return ready;
}

/** True when this visitor is over the hourly limit for `route`. Fails open (loudly) if D1 is unavailable. */
export async function overLimit(request: Request, route: string, max = 5): Promise<boolean> {
  const db = leadDb();
  const ip = request.headers.get('CF-Connecting-IP');
  if (!db || !ip) return false;
  try {
    await ensureLimitTable(db);
    return !(await allowRequest(db, `${route}:${ip}`, max));
  } catch (err) {
    console.error('[limit] D1 check failed, allowing', err);
    return false;
  }
}

/** For /api/health: can we write to the limits table right now? */
export async function limitTableHealthy(): Promise<boolean> {
  const db = leadDb();
  if (!db) return false;
  try {
    await ensureLimitTable(db);
    await allowRequest(db, 'health:check', Number.MAX_SAFE_INTEGER);
    return true;
  } catch {
    return false;
  }
}
