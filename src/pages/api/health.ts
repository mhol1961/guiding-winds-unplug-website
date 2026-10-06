export const prerender = false;

// Uptime/monitoring check. 200 when the visitor-limit table is writable, else 503.
import type { APIRoute } from 'astro';
import { limitTableHealthy } from '../../lib/visitor-limit';

export const GET: APIRoute = async () => {
  const leadLimits = await limitTableHealthy();
  return new Response(JSON.stringify({ ok: leadLimits, leadLimits }), {
    status: leadLimits ? 200 : 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
