// Request/response rules that run in src/worker.ts before Astro sees a
// request. Pure functions so they can be tested without a Worker runtime.

export const CANONICAL_HOST = 'guidingwinds-unplug.com';
const OUR_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);

/**
 * The canonical URL for a request, or null when it already is canonical.
 * Canonical = https, no www, no trailing slash, no `.html`/`/index.html`.
 * Path and query are kept, so ad links keep their UTM parameters.
 * Host and scheme are only rewritten on our own domain (local dev untouched).
 */
export function canonicalRedirect(input: string): string | null {
  const url = new URL(input);
  if (OUR_HOSTS.has(url.hostname)) {
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    url.port = '';
  }
  let path = url.pathname;
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
  else if (path.endsWith('.html')) path = path.slice(0, -'.html'.length);
  if (path.length > 1) path = path.replace(/\/+$/, '') || '/';
  url.pathname = path;
  return url.href === new URL(input).href ? null : url.href;
}

const PIXEL = Boolean(import.meta.env?.PUBLIC_FB_PIXEL_ID); // ?. so node tests can import this
const FB = PIXEL ? ' https://connect.facebook.net' : '';
const FB_IMG = PIXEL ? ' https://www.facebook.com' : '';
const FRAMES = "'self' https://challenges.cloudflare.com https://widgets.leadconnectorhq.com https://*.leadconnectorhq.com https://www.youtube-nocookie.com https://www.youtube.com";
const GHL = 'https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://services.leadconnectorhq.com';

/** One CSP for every response. Meta origins only when the Pixel is turned on. */
export const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com ${GHL}${FB}`,
  "style-src 'self' 'unsafe-inline' https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://fonts.bunny.net",
  "font-src 'self' data: https://widgets.leadconnectorhq.com https://fonts.bunny.net",
  // ponytail: images stay https: because the GHL chat loads avatars/attachments
  // from several hosts we can't enumerate; tighten if the chat widget goes away.
  `img-src 'self' data: blob: https:${FB_IMG}`,
  "media-src 'self'",
  `connect-src 'self' https://*.leadconnectorhq.com wss://*.leadconnectorhq.com https://*.msgsndr.com https://cloudflareinsights.com https://static.cloudflareinsights.com${FB}${FB_IMG}`,
  `frame-src ${FRAMES}`,
  `child-src ${FRAMES}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** Security headers for every response (pages, assets, API, redirects). */
export function securityHeaders(pathname: string): Record<string, string> {
  return {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    // Newsletter media is embedded by email clients and GHL's web view.
    'Cross-Origin-Resource-Policy': pathname.startsWith('/newsletter/') ? 'cross-origin' : 'same-site',
    'Content-Security-Policy': CSP,
  };
}
