// Worker entry (wrangler.jsonc `main`). With assets.run_worker_first, every
// request lands here first: send non-canonical URLs to the canonical one,
// then let Astro serve the page/asset/API and stamp security headers on it.
import astro from '@astrojs/cloudflare/entrypoints/server';
import { canonicalRedirect, securityHeaders } from './lib/edge';

type AstroFetch = typeof astro.fetch;

export default {
  async fetch(request: Request, env: Parameters<AstroFetch>[1], ctx: Parameters<AstroFetch>[2]): Promise<Response> {
    const to = canonicalRedirect(request.url);
    // 301 for page loads; 308 keeps the method and body for form posts.
    const res = to
      ? new Response(null, {
          status: request.method === 'GET' || request.method === 'HEAD' ? 301 : 308,
          headers: { Location: to },
        })
      : await astro.fetch(request as Parameters<AstroFetch>[0], env, ctx);

    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(securityHeaders(new URL(request.url).pathname))) {
      out.headers.set(k, v);
    }
    return out;
  },
};
