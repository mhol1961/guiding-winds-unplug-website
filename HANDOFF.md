# HANDOFF — Guiding Winds Unplug website

Developer continuity document. Written for someone who has never seen this
project. Read this before touching anything.

> **Owner-facing continuity kit was delivered to Dodie and Clint Kendall directly.**

---

## 1. What this site is

Marketing and lead-generation site for **Guiding Winds Unplug**, an
owner-operated catamaran charter business. It sells week-long, all-inclusive
sailing voyages in the British Virgin Islands, the Bahamas, and the
Mediterranean.

There is **no e-commerce and no public checkout**. Every booking goes through
a phone or video call first. The site's entire job is to get a qualified
visitor to submit the inquiry form or call. Payment happens off-site, by a
private link the owners send after the call.

Content lives in two places:

- **Voyage content** — a typed Astro content collection (`src/content/`),
  schema defined in `src/content.config.ts`. Voyage detail pages are
  generated from it by `src/pages/voyages/[slug].astro`.
- **Everything else** — hand-authored `.astro` pages in `src/pages/`.

There are three standalone landing pages (`lp-1`, `lp-2`, `lp-3`) that use a
separate layout with no site navigation. They exist for paid traffic and are
not linked from the main site.

### Single-source-of-truth constants

`src/lib/business.ts` holds the legal entity name, mailing address, public
contact details, surety bond details, and the mandatory cabin-occupancy
notice. **Anything that must read identically in several places belongs
here, not inline in a page.** The footer, About page, Terms, FAQ, JSON-LD
schema, and `llms.txt` all import from it, so a change lands everywhere at
once. Follow that pattern rather than adding a fourth copy of a string.

---

## 2. Framework and hosting

- **Framework:** Astro, with the React integration for the handful of
  interactive components. Tailwind for styling, via the Vite plugin.
- **Rendering:** mostly prerendered static HTML. The API routes and a few
  dynamic endpoints run server-side on demand.
- **Adapter:** `@astrojs/cloudflare`.
- **Host:** a **Cloudflare Worker** with static assets (the Worker is named
  `guiding-winds-unplug-website` in the Cloudflare dashboard).
- **Deploys:** automatic. Cloudflare Workers Builds is connected to the
  GitHub repo `mhol1961/guiding-winds-unplug-website`. **Any push to `main`
  triggers a build and deploys to production.** There is no staging branch
  and no manual approval step. A typical build takes two to three minutes.

> **Correction to older docs:** `DEPLOY.md` describes this as a Cloudflare
> **Pages** project and gives Pages-specific instructions (`*.pages.dev`
> hostnames, the Pages dashboard, Pages custom-domain flow). That is stale.
> The project is a Worker. The Pages dashboard sections referenced there do
> not exist for this project. Trust this file over `DEPLOY.md` on anything
> hosting-related.

### Do not deploy by hand

Running `wrangler deploy` from a checkout will create a **second, separate
Worker** under whatever name the generated config carries, and that Worker
will not be the one serving the domain. It is a silent no-op from the user's
point of view and leaves an orphaned Worker plus an orphaned KV namespace
behind. Push to `main` and let the build run.

### Versions

This document deliberately names no version numbers. Dependencies are pinned
in `package.json` and `package-lock.json`. Install what the lockfile
specifies. Where a runtime version is required, use the **latest** release
that satisfies the `engines` field in `package.json`.

---

## 3. Running it locally

```bash
git clone https://github.com/mhol1961/guiding-winds-unplug-website.git
cd guiding-winds-unplug-website
npm install
npm run dev
```

Dev server comes up on localhost; Astro prints the port. That is enough to
work on layout, copy, styling, and content.

Available scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run typecheck` | `astro check` — TypeScript and template diagnostics |
| `npm run design:lint` | Lints the design tokens in `DESIGN.md` |
| `npm run design:export` | Regenerates exported design tokens |

**Before pushing, run both:**

```bash
npm run build
npm run typecheck
```

`typecheck` currently reports zero errors and zero warnings. It does report
a number of hints, which are pre-existing and safe to ignore. If you
introduce an error, fix it before pushing — a failed build means no deploy,
and there is no gate to catch it for you.

### Working on Windows / WSL

If the repo lives on a Windows drive accessed through WSL (`/mnt/c/...`),
file-watching does not work and the dev server will silently serve stale
bundles. Set `WATCHPACK_POLLING=true` in the environment before
`npm run dev`.

### Forms in local development

The inquiry and newsletter endpoints call GoHighLevel. Without credentials
they fail. Two escape hatches exist, both read from the environment:

- `DRY_RUN_GHL` — bypasses the GoHighLevel API entirely and logs the payload
  that would have been sent.
- `DISABLE_RATE_LIMIT` — turns off rate limiting so you can submit
  repeatedly while testing.

Use these rather than putting live credentials on a development machine.

---

## 4. Environment variables and secrets

**Names only below. No values appear in this repository or in this file.**

Three separate places hold configuration. Putting a value in the wrong one is
the most common way to break this site, so read this section carefully.

### 4a. Build-time, public (inlined into the shipped HTML)

These are read at **build** time via `import.meta.env` and are baked into the
output. They are visible to anyone who views source — never put a secret
here. Changing one requires a **rebuild**; editing the value alone does
nothing to the live site until a new build runs.

Set in: **Cloudflare dashboard → the Worker → Settings → Build → Variables.**
Mirror them locally in `.env.local` (gitignored).

| Name | Purpose |
|---|---|
| `PUBLIC_SITE_URL` | Canonical origin. Baked into every `<link rel="canonical">` and into the sitemap. **If this is wrong, every canonical tag on the site points at the wrong host.** Must be the `https://` custom domain. |
| `PUBLIC_BUSINESS_NAME` | Business name for metadata |
| `PUBLIC_CONTACT_EMAIL` | Contact address surfaced in metadata |
| `PUBLIC_FB_PIXEL_ID` | Meta Pixel identifier. The pixel component renders nothing when this is unset, so the site is safe to ship without it. |
| `NODE_VERSION` | Pins the build runtime |

`astro.config.mjs` guards `PUBLIC_SITE_URL`: a production build fails
outright if it is set to a non-`https://` value, and warns loudly while
falling back to the known production domain if it is missing entirely.

### 4b. Runtime secrets (server-side only, never shipped to the browser)

These are read at **request** time from the Cloudflare Worker environment.
They are not in the built bundle. Changing one takes effect without a
rebuild.

Set in: **Cloudflare dashboard → the Worker → Settings → Variables and
Secrets**, as encrypted Secrets. Locally, put them in **`.dev.vars`** in the
repo root — gitignored, and the correct place for anything sensitive.

| Name | Purpose |
|---|---|
| `GHL_PRIVATE_TOKEN` | **Secret.** GoHighLevel Private Integration token. Full write access to the CRM — treat it as a production credential. |
| `GHL_LOCATION_ID` | GoHighLevel sub-account identifier |
| `GHL_API_BASE` | GoHighLevel API origin. Falls back to a sane default in code if unset. |
| `GHL_API_VERSION` | Date-stamped GoHighLevel API version header. Falls back to a default in code if unset. |
| `GHL_CALENDAR_ID_BVI` | Calendar for British Virgin Islands bookings |
| `GHL_CALENDAR_ID_BAHAMAS` | Calendar for Bahamas bookings |
| `GHL_CALENDAR_ID_MED` | Calendar for Mediterranean bookings |
| `DRY_RUN_GHL` | Optional. Bypasses GoHighLevel; logs payloads instead. |
| `DISABLE_RATE_LIMIT` | Optional. Development only. |

`src/lib/ghl/client.ts` reads these through a helper that checks the
Cloudflare runtime environment first and falls back to build-time env for
local and non-Cloudflare contexts. It throws a clear error if the token is
missing rather than failing silently.

### 4c. Template

`.env.example` is committed and lists every name with an empty value plus a
comment saying where in the GoHighLevel UI to find each one. **Keep it
current.** When you add a variable, add it there too — it is the only
machine-readable record of what this site needs to run.

Gitignored, never commit: `.env`, `.env.local`, `.env.production`,
`.env.*.local`, `.dev.vars`.

---

## 5. External services

| Service | What it does here | Notes |
|---|---|---|
| **Cloudflare** | Hosting (Worker + static assets), DNS, CDN, SSL, KV namespace for sessions, image binding | The single most important account. Losing it loses hosting and DNS together. |
| **GitHub** | Source of record; drives deploys | Repo `mhol1961/guiding-winds-unplug-website`. Push access to `main` is production access. |
| **GoHighLevel** (LeadConnector) | CRM, form intake, booking calendars, live chat widget | The business-critical integration. Everything the site captures lands here. |
| **Meta Pixel** | Conversion tracking for paid social | Inert unless `PUBLIC_FB_PIXEL_ID` is set |
| **YouTube** (nocookie) | Embedded welcome video | Allowed in the CSP frame sources |

**Plausible** is *not* installed. There is no Plausible script anywhere in
`src/`. A `PLAUSIBLE_DOMAIN` name survives in `.env.example` and the domain
is allow-listed in the Content-Security-Policy, but no analytics calls are
made. Either finish wiring it up or remove the leftovers — do not assume
analytics are being collected.

**Stripe** is *not* used. No Stripe dependency, no Stripe code, no payment
handling of any kind in this repository. Payments are collected off-site.

**Cloudflare Web Analytics** may inject a script at the edge; its host is
allow-listed in the CSP.

### How the site talks to GoHighLevel

Two first-party API routes, both server-side:

- `src/pages/api/inquire.ts` — the main inquiry form
- `src/pages/api/newsletter.ts` — newsletter signup

Both validate input with Zod, apply rate limiting, and then call
GoHighLevel through `src/lib/ghl/client.ts`. Forms POST to these local
routes; **no form posts directly to GoHighLevel from the browser**, so the
token is never exposed. Keep it that way.

`src/lib/ghl/calendars.ts` fetches free slots for the booking calendars.
`src/lib/ghl/contacts.ts` creates and updates CRM contacts.

Astro's `security.checkOrigin` is enabled in `astro.config.mjs`, which
validates the Origin header on every state-changing request. This blocks
cross-origin form POSTs against the API routes. Do not disable it.

---

## 6. Identifiers hard-coded in source

Configuration that lives in source rather than in environment variables. If
the business changes any of these, a code change and a deploy are required —
they cannot be fixed from a dashboard. **Values are deliberately not
reproduced here; open the file.**

| What | File |
|---|---|
| GoHighLevel chat widget identifier and loader URLs | `src/components/ChatWidget.astro` |
| Public phone number, used for the click-to-call action | `src/components/ChatWidget.astro` |
| Business identity, address, contact details, bond details, cabin-occupancy notice | `src/lib/business.ts` |
| GoHighLevel API origin and version fallbacks | `src/lib/ghl/client.ts` |
| Allow-listed third-party hosts (CSP) and cache rules | `public/_headers` |
| Production domain fallback, used when `PUBLIC_SITE_URL` is absent | `astro.config.mjs` |

The GoHighLevel **calendar** and **location** identifiers are correctly in
environment variables, not in source. The chat **widget** identifier is the
exception — it is embedded directly in the component. Moving it to an
environment variable would be a reasonable small improvement.

`src/components/ChatWidget.astro` also suppresses GoHighLevel's own floating
launcher bubble, via global CSS and a shadow-root style injection, so that
only the site's own button appears. That suppression is fragile by nature:
if GoHighLevel changes its widget markup, their bubble can reappear
alongside ours. Check this component first if two floating buttons show up.

---

## 7. Domain and DNS

- **Production domain:** `guidingwinds-unplug.com`, registered and managed in
  Cloudflare.
- **DNS:** Cloudflare-managed, proxied. The apex is attached to the Worker as
  a custom domain, which provisions and renews SSL automatically. There is no
  origin server to point at.
- **The Worker's `*.workers.dev` hostname also resolves** and serves the same
  content. It is not the canonical address and should not be linked or shared.
- **`www`** resolves and serves the site, but does **not** redirect to the
  apex — both hostnames serve independently. Canonical tags point at the
  apex, so search engines resolve the duplication correctly, but a redirect
  rule from `www` to the apex would be cleaner.
- **Trailing slashes:** Astro is configured with `trailingSlash: 'never'`,
  and the platform issues a redirect to the slashed form. Follow redirects
  when testing with `curl`, or a bare request returns an empty body and looks
  like a broken page.
- **SSL/TLS:** Full (strict). HSTS is set in `public/_headers` with a long
  max-age, `includeSubDomains`, and `preload`. **Once preload is honoured,
  HTTPS on this domain and its subdomains is effectively irreversible.** Do
  not point this domain at a host without a valid certificate.
- **Email** is handled independently of the website through GoHighLevel's
  sending infrastructure. SPF, DKIM, and DMARC records live in the same
  Cloudflare DNS zone. **Deleting or rewriting DNS records while working on
  the site can silently break the owners' email.** Change only the records
  you mean to change.

### Search Console

The domain is verified in Google Search Console by DNS TXT record. **Do not
remove that TXT record** — it revokes verification. The sitemap is at
`/sitemap-index.xml` and is referenced from `/robots.txt`.

---

## 8. Where things are

```
src/
  components/     UI components; shared/, home/, voyage/, lp/, journal/
  content/        Voyage content collection (typed)
  layouts/        BaseLayout (main site), LpLayout (landing pages)
  lib/
    business.ts   Single source of truth for business identity
    ghl/          GoHighLevel client, contacts, calendars
    schema/       JSON-LD structured data builders
    utils/
  pages/
    api/          Server-side endpoints (inquire, newsletter)
    voyages/      Voyage index + dynamic [slug] detail pages
    llms.txt.ts   Generated content map for AI crawlers
    robots.txt.ts Generated robots.txt
public/
  _headers        Security headers and cache rules
  img/            Images
```

Several directories carry their own `CLAUDE.md` with local conventions.
Read the one nearest the file you are editing.

Other docs in the root — `PRD.md`, `TECH-SPEC.md`, `DESIGN.md`,
`CONTENT-MAP.md`, `SEO-PLAN.md`, `QA-CHECKLIST.md`, `GHL-INTEGRATION.md`,
`DECISIONS.md`, `SETUP.md`, `DEPLOY.md` — are historical build
documentation. They are useful for intent and rationale, but they were
written during the build and **some have drifted from the current state**.
`DEPLOY.md` is known-stale on hosting, as noted above. Verify against the
running site before trusting any of them.

---

## 9. Gotchas worth knowing before your first change

1. **Pushing to `main` deploys to production.** No staging, no approval.
2. **Build-time variables need a rebuild.** Editing `PUBLIC_SITE_URL` in the
   dashboard changes nothing until a new build runs. An empty commit is the
   usual way to trigger one.
3. **Never run `wrangler deploy` locally.** See section 2.
4. **Do not hand-edit `dist/`.** It is generated and gitignored.
5. **Third-party hosts must be added to the CSP** in `public/_headers`, or
   they are blocked in production with no visible error. This bites hardest
   with new embeds and analytics scripts.
6. **The GoHighLevel token is a live production credential.** It can write to
   the owners' CRM. Never put it in `.env.local`, never log it, never commit
   it. `.dev.vars` only.
7. **Repeated strings belong in `src/lib/business.ts`.** Check there before
   hard-coding business details into a page.
