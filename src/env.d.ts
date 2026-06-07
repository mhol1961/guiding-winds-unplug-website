/// <reference types="astro/client" />

// The Cloudflare adapter exposes runtime secrets/vars (set in the dashboard
// or wrangler) via this virtual module at request time. Declared here so the
// GHL client can read them without a hard type dependency.
declare module 'cloudflare:workers' {
  export const env: Record<string, string | undefined>;
}
