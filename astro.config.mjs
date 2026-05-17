// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL ?? 'https://guidingwinds-unplug.com';

export default defineConfig({
  site: SITE,
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
});
