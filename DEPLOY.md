# DEPLOY — Deployment runbook

How to deploy Guiding Winds Unplug to production on Cloudflare Pages with custom domain.

**Companion to:** `TECH-SPEC.md` §9 (deployment overview), `QA-CHECKLIST.md` §12 (DNS/SSL checks), `BUILD-PROMPTS.md` Phase 11 (launch).

---

## Hosting target

**Cloudflare Pages** — chosen for: free tier, edge caching, integrated with Cloudflare DNS, automatic SSL, instant rollback by deployment ID.

Fallback: **Vercel** if Cloudflare Pages blocks anything specific. Both adapters are in `@astrojs/*` so swapping is a one-line config change.

---

## Pre-deploy checklist (one-time setup)

- [ ] GitHub repo created and pushed
- [ ] Cloudflare account exists with the target domain in its DNS
- [ ] Cloudflare Pages connected to the GitHub repo
- [ ] All environment variables set in Cloudflare Pages dashboard (see §3 below)
- [ ] Build command set to `npm run build`, output directory `dist/`
- [ ] Node version pinned via `package.json` `engines.node` field
- [ ] A preview deploy is succeeding on the `main` branch

---

## 1. First-time Cloudflare Pages setup

1. Log in to https://dash.cloudflare.com/
2. Workers & Pages → Create application → Pages → Connect to Git
3. Pick the `guidingwinds-unplug` repo (authorize Cloudflare to access the GitHub org if needed)
4. Set up the build:
   - **Production branch:** `main`
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or whatever Astro project root is)
   - **Node version:** `20` (set via `NODE_VERSION=20` in env vars OR via `.nvmrc`)
5. Save and deploy. First deploy will fail until env vars are set — that's expected.

## 2. Environment variables — set in Cloudflare Pages dashboard

Settings → Environment variables. Set the same values for **Production** and **Preview** (Preview can use a test GHL location if Dodie has one).

```
# GoHighLevel
GHL_API_BASE                = https://services.leadconnectorhq.com
GHL_API_VERSION             = 2021-07-28
GHL_LOCATION_ID             = <Dodie's location id>
GHL_PRIVATE_TOKEN           = <Dodie's private integration token>
GHL_CALENDAR_ID_BVI         = <BVI calendar id>
GHL_CALENDAR_ID_BAHAMAS     = <Bahamas calendar id>
GHL_CALENDAR_ID_MED         = <Mediterranean calendar id>

# Analytics
PLAUSIBLE_DOMAIN            = guidingwinds-unplug.com

# Public (these go into the build, exposed to client)
PUBLIC_SITE_URL             = https://guidingwinds-unplug.com
PUBLIC_BUSINESS_NAME        = Guiding Winds Unplug
PUBLIC_CONTACT_EMAIL        = dodie@guidingwinds-unplug.com

# Build
NODE_VERSION                = 20
```

**Important:** the GHL tokens are secrets — Cloudflare encrypts them at rest. They're never exposed to the client because the inquiry/newsletter/hold-cabin actions run on the server (Astro Action handlers).

## 3. Custom domain — DNS cutover

When the preview deploys are stable and Mark + Dodie have signed off on QA:

1. **In Cloudflare DNS:**
   - Add a CNAME record: `guidingwinds-unplug.com` → `<your-project>.pages.dev` (Cloudflare will auto-flatten this CNAME at the apex via CNAME flattening)
   - Add a CNAME: `www.guidingwinds-unplug.com` → `<your-project>.pages.dev`
   - Set both to **Proxied** (orange cloud)

2. **In Cloudflare Pages:**
   - Custom domains → Set up a custom domain → enter `guidingwinds-unplug.com`
   - Repeat for `www.guidingwinds-unplug.com`
   - Cloudflare auto-provisions SSL via its own CA
   - Wait until both show "Active" (usually < 5 minutes)

3. **SSL settings (Cloudflare → SSL/TLS):**
   - Encryption mode: **Full (strict)**
   - Always use HTTPS: **On**
   - HTTP Strict Transport Security (HSTS): **On**
     - Max age: 12 months
     - Include subdomains: yes
     - Preload: yes (after you confirm HTTPS is rock-solid)

4. **Email DNS (so Dodie's emails still send from `@guidingwinds-unplug.com`):**
   - Verify SPF record: `v=spf1 include:_spf.gohighlevel.com -all` (or whatever Dodie's GHL SMTP setup specifies)
   - Add DKIM record per GHL instructions (Dodie can generate this from her GHL email settings)
   - Add DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@guidingwinds-unplug.com`

5. **301 redirects from old GHL site URLs** — set up in Cloudflare → Rules → Page Rules or via `_redirects` in `public/`:

```
# public/_redirects (Cloudflare Pages reads this at build)
/destination-schedule   /voyages/        301
/-649302                /about           301
/privacy-policy         /privacy         301
/terms-and-conditions   /terms           301
```

## 4. Production deploy workflow

For every merge to `main`:

1. CI runs (`.github/workflows/ci.yml`):
   - `npm ci`
   - `npm run design:lint`
   - `npm run typecheck`
   - `npm run build`
   - Lighthouse CI against the preview URL (fails if Performance < 90 mobile)
   - axe-core a11y scan (fails on serious/critical)
2. If CI passes, Cloudflare Pages auto-deploys to production from `main`.
3. Production URL: `https://guidingwinds-unplug.com`.

For preview deploys (PRs):

- Cloudflare Pages creates a unique preview URL per PR: `https://<hash>.guidingwinds-unplug.pages.dev`
- The preview URL is posted as a GitHub PR comment automatically.
- Use the preview URL for Lighthouse and a11y CI runs.

## 5. Post-deploy smoke test (run after every production deploy)

- [ ] `https://guidingwinds-unplug.com` loads without console errors
- [ ] Hero video plays (or fallback gradient shows)
- [ ] Click "See Available Weeks" — routes to `/calendar` correctly
- [ ] Submit a test inquiry from `/inquire` — verify it appears in Dodie's GHL within 60 seconds with correct tags
- [ ] Submit a test newsletter signup — same check, tag should be `newsletter` only
- [ ] Visit a voyage page — verify schema markup in Google Rich Results Test
- [ ] Lighthouse run on the live URL — Performance ≥ 95 desktop

## 6. Monitoring

Set up before first production deploy:

- **Plausible**: tracking script in `src/components/shared/SeoHead.astro` once the domain is added to Plausible
- **UptimeRobot** (free tier): pings `/` every 5 minutes
- **Cloudflare Analytics**: free, enabled by default with Pages
- **Sentry** or **Cloudflare Pages Functions logs**: for catching server-side errors in the GHL actions
- **Search Console**: domain verified via DNS TXT record; sitemap submitted at `https://guidingwinds-unplug.com/sitemap.xml`
- **Bing Webmaster Tools**: same — domain verified + sitemap submitted

## 7. Rollback procedure

If a deploy breaks production:

1. **Fast rollback via Cloudflare Pages dashboard:**
   - Cloudflare Pages → Deployments → find the last known-good deployment → "Rollback to this deployment"
   - Takes ~30 seconds to switch back. No DNS change needed.

2. **If Cloudflare Pages itself is down** (rare):
   - In Cloudflare DNS, change the CNAME record back to the old GHL site URL (or whichever was the previous host). DNS propagation < 5 minutes with Cloudflare's TTLs.
   - Confirm SSL re-provisions if needed.

3. **If the GHL integration is broken** (forms not landing in Dodie's account):
   - This is *not* a rollback case — the static site is fine.
   - Check `.env` in Cloudflare Pages dashboard. Verify `GHL_PRIVATE_TOKEN` is still valid.
   - Check GHL workflow status — workflows can be paused on the GHL side.
   - Worst case, forms gracefully fall back to mailto via the 3-retry handler.

4. **Document the rollback in `DECISIONS.md`** — what broke, when, what was rolled back to. So we don't re-make the same mistake.

## 8. Domain transfer (if registrar isn't already Cloudflare)

If the domain is currently at another registrar (GoDaddy, Namecheap, etc.):

1. At the current registrar: unlock the domain, get the EPP/auth code.
2. In Cloudflare → Registrar → Transfer Domains → enter the domain + auth code.
3. The transfer takes 5–7 days to complete. During this time, DNS continues to resolve from the current registrar's nameservers (or Cloudflare's, depending on when you switch).
4. **Recommended:** point the domain's nameservers to Cloudflare *before* starting the transfer — this means DNS resolves through Cloudflare immediately, and the registrar transfer is purely administrative.

**Plan the cutover for a low-traffic window** — Tuesday or Wednesday morning is typical for travel businesses (lowest inquiry traffic). Never cut over Friday.

## 9. Backup

- **Code:** GitHub is the source of truth. Tag each release: `git tag -a v1.x.x -m "..."`.
- **Content:** content collections (`src/content/`) are in git. Generated content (Dodie's edits) lives in GHL — Dodie should periodically export her GHL contacts and workflows.
- **GHL workflows:** before any production GHL workflow change, take a snapshot (GHL export). Restoring is manual; this is a real risk.
- **Old GHL site:** before DNS cutover, scrape the old site (`wget --recursive` or similar) and archive the HTML so we can answer "what did the site look like in May 2026?" later.

## 10. Secrets rotation

Rotate the GHL Private Token annually (or immediately if exposure suspected):

1. In Dodie's GHL: Settings → Private Integrations → revoke old token → create new token with same scopes.
2. Update `GHL_PRIVATE_TOKEN` in Cloudflare Pages env vars.
3. Cloudflare Pages → re-deploy (or kick a no-op commit). New deploy uses the new token.
4. Verify a test inquiry still works.
5. Document the rotation in `DECISIONS.md` with date.
