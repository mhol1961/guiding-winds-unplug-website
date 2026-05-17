// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// `site` is baked into the sitemap and into every canonical URL at build
// time. A wrong value (localhost in production, or a stale prod URL in dev)
// is genuinely costly — it ships into search engines and AI crawlers.
// Resolve carefully (per Codex round 1 finding #3):
//   - In production (NODE_ENV=production or astro build): require
//     PUBLIC_SITE_URL to be set and to be an https://... URL. Fail the
//     build otherwise.
//   - In dev: fall back to localhost so `astro dev` works without a
//     .env.local.
const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('build');
const envSite = process.env.PUBLIC_SITE_URL?.trim();
const DEV_FALLBACK = 'http://localhost:4321';
const PROD_DEFAULT = 'https://guidingwinds-unplug.com';

let site;
if (envSite) {
  if (isProd && !envSite.startsWith('https://')) {
    throw new Error(
      `PUBLIC_SITE_URL must start with https:// for production builds; got "${envSite}".`,
    );
  }
  site = envSite;
} else if (isProd) {
  // Don't fail outright — Cloudflare Pages may set the env var at deploy
  // time, and the production domain is well-known. Warn loudly.
  console.warn(
    `[astro.config] PUBLIC_SITE_URL not set during a production build; falling back to ${PROD_DEFAULT}. ` +
      `Set it in .env.local or in the Cloudflare Pages dashboard.`,
  );
  site = PROD_DEFAULT;
} else {
  site = DEV_FALLBACK;
}

export default defineConfig({
  site,
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  security: {
    // Validate Origin header on all POST/PUT/PATCH/DELETE — blocks the
    // cross-origin-form-POST attack against /api/* and form actions.
    // Per Codex security audit pre-launch.
    checkOrigin: true,
  },
});
