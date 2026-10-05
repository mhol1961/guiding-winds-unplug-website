// Route helper around allowRequest: keys on CF-Connecting-IP + route.
import { env } from 'cloudflare:workers';
import { allowRequest, type D1Like } from './lead-limits';

/** True when this visitor is over the hourly limit for `route`. Fails open if D1 is unavailable. */
export async function overLimit(request: Request, route: string, max = 5): Promise<boolean> {
  const db = (env as { LEAD_DB?: D1Like }).LEAD_DB;
  const ip = request.headers.get('CF-Connecting-IP');
  if (!db || !ip) return false;
  try {
    return !(await allowRequest(db, `${route}:${ip}`, max));
  } catch (err) {
    console.error('[limit] D1 check failed, allowing', err);
    return false;
  }
}
