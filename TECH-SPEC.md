# TECH-SPEC — Guiding Winds Unplug

**Companion to:** `CLAUDE.md` (project conventions), `PRD.md` (scope), `DESIGN.md` (design system).
**Last updated:** 2026-05-17

---

## 1. Stack at a glance

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| Framework | Astro | 6.x | Static-first, content-collection ergonomics, near-zero JS payload by default |
| Styling | Tailwind v4 | latest | CSS-first config; `DESIGN.md` → `scripts/design-export.mjs` → `src/styles/theme.css` as a Tailwind v4 `@theme` block. Upstream `@google/design.md` v0.1.1 only emits Tailwind v3 JSON, hence the local exporter (DECISIONS.md ADR-015). |
| Components | shadcn/ui (selected only) | latest | Headless primitives — Button, Dialog, Sheet, Tabs, Accordion, Form, Select. Add only what's used. |
| Form handling | Astro Actions + Zod | latest | Server-side validation; type-safe; no client framework needed |
| Image | `astro:assets` | built-in | Responsive `<picture>` with AVIF/WebP, automatic LQIP |
| Video | Native `<video>` + Cloudflare Stream (optional) | — | Local MP4/WebM hero loops; adaptive bitrate via CF Stream if budget allows |
| Hosting | Cloudflare Pages | — | Free tier, fast edge, integrated with Cloudflare DNS already used elsewhere |
| Analytics | Plausible | self-hosted or cloud | Privacy-first, lightweight, no consent banner needed |
| CRM / Email / SMS | GoHighLevel (Dodie's subaccount) | v2 API | Decoupled from site; consumed via API |
| Booking | GHL Calendars API (custom UI) | v2 API | Wraps GHL availability behind on-brand UI |
| Domain | Cloudflare DNS | — | Migrate from current registrar in launch phase |

## 2. Repository layout

```
guidingwinds-unplug/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── voyages/
│   │   │   ├── index.astro              # destinations hub
│   │   │   └── [slug].astro             # trip detail (driven by content collection)
│   │   ├── aboard.astro
│   │   ├── about.astro
│   │   ├── inquire.astro
│   │   ├── calendar.astro
│   │   ├── faq.astro
│   │   ├── journal/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── api/
│   │   │   ├── inquire.ts               # POST → GHL Contacts
│   │   │   ├── newsletter.ts            # POST → GHL Contacts (tag: newsletter)
│   │   │   └── hold-cabin.ts            # POST → GHL Calendars (72h hold)
│   │   ├── sitemap.xml.ts               # generated sitemap
│   │   └── robots.txt.ts                # generated robots (AI bots allowed)
│   ├── content/
│   │   ├── voyages/                     # one MD per trip
│   │   │   ├── british-virgin-islands.md
│   │   │   ├── bahamas.md
│   │   │   ├── italy.md
│   │   │   ├── greece.md
│   │   │   └── croatia.md
│   │   ├── journal/                     # blog posts
│   │   ├── reviews/                     # testimonials
│   │   └── config.ts                    # Zod schemas for collections
│   ├── components/
│   │   ├── ui/                          # shadcn primitives (selected)
│   │   ├── home/                        # Hero, Feeling, Picker, Explore, Megatype, About, Pillars, Go
│   │   ├── voyage/                      # Overview, Pricecard, Timeline, Gallery, Faq, Inquiry
│   │   ├── journal/                     # PostCard, PostBody, RelatedPosts
│   │   └── shared/                      # Nav, Footer, Newsletter, SchemaScript
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── lib/
│   │   ├── ghl/
│   │   │   ├── client.ts                # GHL API client wrapper
│   │   │   ├── contacts.ts              # create contact, tag, etc.
│   │   │   └── calendars.ts             # availability + 72h hold
│   │   ├── schema/
│   │   │   ├── tourist-trip.ts          # TouristTrip JSON-LD builder
│   │   │   ├── event.ts                 # Event per available week
│   │   │   ├── organization.ts          # Organization
│   │   │   ├── faq-page.ts              # FAQPage
│   │   │   └── breadcrumb.ts            # BreadcrumbList
│   │   └── utils/
│   │       ├── dates.ts                 # voyage week formatting
│   │       └── pricing.ts
│   ├── styles/
│   │   └── global.css                   # Tailwind v4 @theme block exported from DESIGN.md
│   └── env.d.ts
├── public/
│   ├── media/                           # hero MP4/WebM loops, image fallbacks
│   ├── og/                              # auto-generated OG images per page
│   ├── favicon.svg
│   └── robots.txt                       # or generated, see /pages/robots.txt.ts
├── DESIGN.md                            # Google-spec design system
├── CLAUDE.md                            # project conventions (this folder)
├── PRD.md                               # requirements
├── TECH-SPEC.md                         # ← this file
├── CONTENT-MAP.md                       # page-by-page content plan
├── QA-CHECKLIST.md                      # pre-launch checklist
├── astro.config.mjs
├── tailwind.theme.json                  # generated from DESIGN.md
├── package.json
├── tsconfig.json
├── .env.local                           # NEVER committed; see §6 for schema
└── .gitignore
```

## 3. Content collection schemas (Astro `content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

const voyages = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string(),
    region: z.enum(['caribbean', 'bahamas', 'mediterranean']),
    name: z.string(),
    country: z.string(),
    nights: z.number().default(7),
    pricePerGuestUSD: z.number(),
    heroImage: z.string(),
    galleryImages: z.array(z.string()).default([]),
    availableWeeks: z.array(z.object({
      start: z.string(),       // ISO date
      end: z.string(),
      cabinsAvailable: z.number().int().min(0).max(8),
      ghlEventId: z.string().optional(),
    })),
    itinerary: z.array(z.object({
      day: z.number(),
      label: z.string(),
      title: z.string(),
      body: z.string(),
    })),
    inclusions: z.array(z.string()),
    exclusions: z.array(z.string()),
    seo: z.object({
      title: z.string().max(60),
      description: z.string().max(155),
      keywords: z.array(z.string()).default([]),
    }),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
  }),
});

const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().max(220),
    category: z.enum(['guide', 'field-notes', 'wellness', 'behind-the-boat']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    author: z.enum(['dodie', 'clint', 'guest']),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    seo: z.object({
      title: z.string().max(60),
      description: z.string().max(155),
    }),
  }),
});

const reviews = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    location: z.string(),
    voyage: z.string(),                   // slug of the voyage
    rating: z.number().int().min(1).max(5).default(5),
    date: z.date(),
  }),
});

export const collections = { voyages, journal, reviews };
```

## 4. GoHighLevel integration

### 4.1 Authentication

GHL v2 API uses OAuth 2.0 with a Location-scoped Access Token. For server-side use (Astro Actions), the Private Integration Token is simpler and acceptable.

Environment variables (in `.env.local`, never committed):

```
GHL_API_BASE=https://services.leadconnectorhq.com
GHL_API_VERSION=2021-07-28
GHL_LOCATION_ID=<dodie's subaccount location id>
GHL_PRIVATE_TOKEN=<private integration token from Dodie's account>
GHL_CALENDAR_ID_BVI=<calendar id for BVI voyages>
GHL_CALENDAR_ID_BAHAMAS=<calendar id for Bahamas voyages>
GHL_CALENDAR_ID_MED=<calendar id for Mediterranean voyages>
```

### 4.2 Client wrapper (`src/lib/ghl/client.ts`)

```typescript
const BASE = import.meta.env.GHL_API_BASE;
const VERSION = import.meta.env.GHL_API_VERSION;
const TOKEN = import.meta.env.GHL_PRIVATE_TOKEN;

export async function ghl<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Version': VERSION,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
```

### 4.3 Create contact (inquiry)

`POST /contacts/` — endpoint accepts `firstName`, `lastName`, `email`, `phone`, `tags`, `customFields`, `locationId`. The Astro Action wraps validation and tag application:

```typescript
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { ghl } from '../lib/ghl/client';

export const inquire = defineAction({
  accept: 'form',
  input: z.object({
    firstName: z.string().min(1).max(60),
    lastName: z.string().min(1).max(60),
    email: z.string().email(),
    phone: z.string().optional(),
    week: z.string(),                     // "BVI · Jan 9–16, 2027"
    partySize: z.string(),
    notes: z.string().max(1000).optional(),
    region: z.enum(['bvi', 'bahamas', 'mediterranean']),
    // honeypot
    website: z.string().max(0),           // must be empty
  }),
  handler: async ({ firstName, lastName, email, phone, week, partySize, notes, region }) => {
    const tags = ['inquiry', `inquiry-${region}`, 'website-2026'];
    return await ghl('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: import.meta.env.GHL_LOCATION_ID,
        firstName, lastName, email, phone,
        tags,
        customFields: [
          { key: 'preferred_week', field_value: week },
          { key: 'party_size', field_value: partySize },
          { key: 'inquiry_notes', field_value: notes ?? '' },
          { key: 'inquiry_source', field_value: 'guidingwinds-unplug.com' },
        ],
      }),
    });
  },
});
```

### 4.4 Cabin availability + 72-hour hold

`GET /calendars/{calendarId}/free-slots?startDate=...&endDate=...` for availability.
`POST /calendars/events/appointments` to create a 72h soft hold.

The custom UI fetches free slots server-side (cached per-week for 15 min), renders them on the trip page's pricing card, and on submit creates an appointment with `appointmentStatus: 'new'`. Dodie's workflow then triggers an "inquiry → hold confirmed" email and a 72h-expiry reminder.

### 4.5 Tag schema

| Tag | Meaning | Triggers |
|---|---|---|
| `inquiry` | Any inquiry form submission | "New inquiry" workflow |
| `inquiry-bvi` / `-bahamas` / `-mediterranean` | Region-specific routing | Per-region nurture sequence |
| `newsletter` | Newsletter signup only | Welcome sequence |
| `hold-cabin` | Created a 72h cabin hold | "Hold expiring" reminder workflow |
| `booked-2027` | Manual tag once cabin is paid | Pre-trip prep sequence |
| `guest-2025` / `-2026` | Past guest segmentation | Re-engagement campaigns |

## 5. Schema markup (JSON-LD)

Every voyage page emits all four:

```typescript
// src/lib/schema/tourist-trip.ts
export function touristTrip(voyage) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": voyage.name,
    "description": voyage.seo.description,
    "image": voyage.heroImage,
    "touristType": "Adventure traveler, Wellness traveler",
    "itinerary": voyage.itinerary.map(day => ({
      "@type": "Place",
      "name": day.title,
      "description": day.body,
    })),
    "offers": voyage.availableWeeks.map(w => ({
      "@type": "Offer",
      "price": voyage.pricePerGuestUSD,
      "priceCurrency": "USD",
      "availability": w.cabinsAvailable > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "validFrom": w.start,
      "validThrough": w.end,
    })),
    "provider": organization(),
  };
}
```

Same pattern for `Organization`, `Event` (per available week), `FAQPage`, `BreadcrumbList`, and `Review` + `AggregateRating` where reviews exist.

## 6. Environment variables

Schema for `.env.local`:

```
# GHL
GHL_API_BASE=https://services.leadconnectorhq.com
GHL_API_VERSION=2021-07-28
GHL_LOCATION_ID=
GHL_PRIVATE_TOKEN=
GHL_CALENDAR_ID_BVI=
GHL_CALENDAR_ID_BAHAMAS=
GHL_CALENDAR_ID_MED=

# Analytics
PLAUSIBLE_DOMAIN=guidingwinds-unplug.com

# Build
PUBLIC_SITE_URL=https://guidingwinds-unplug.com
PUBLIC_BUSINESS_NAME=Guiding Winds Unplug
PUBLIC_CONTACT_EMAIL=dodie@guidingwinds-unplug.com
```

## 7. Forms — full data flow

```
[Browser]
  ↓ Zod-validated form submit (POST to Astro Action)
[Astro Action — server]
  ↓ honeypot check, rate-limit check, server-side Zod
  ↓ POST /contacts/  → GHL Contacts API
[GHL — Dodie's subaccount]
  ↓ contact created with tags
  ↓ workflow fires:
     - confirmation email to guest
     - SMS to Dodie
     - task created in Dodie's inbox
  ↓ if `hold-cabin` also fires:
     - calendar appointment created
     - 72h reminder workflow scheduled
[Browser]
  ↓ success response → redirect to /inquire/thank-you
```

Failure cases:
- Validation fails → form rejects client-side with inline errors.
- Honeypot trips → server returns 200 with a fake success (don't tip bots off).
- Rate limit exceeded → server returns 429.
- GHL API down → retry 3× with exp backoff, then fallback to mailto link with prefilled subject.

## 8. Performance & caching

- Static-first: every page is pre-rendered at build time except `/api/*` and `/calendar` (which fetches GHL availability on-demand with a 15-minute edge cache via Cloudflare).
- Images served as AVIF with WebP fallback via `astro:assets`. LQIP for above-the-fold imagery.
- Hero videos: `<video preload="metadata">` (not `auto`), 720p mobile / 1080p desktop, encoded with `-crf 28 -preset slow` in ffmpeg for size. Total budget per scene: 2–4 MB.
- Critical CSS inlined per page (Astro does this automatically).
- Fonts: system stack from `DESIGN.md`. If we ever load web fonts, preload + `font-display: swap`.

## 9. Deployment

- GitHub repo at `markholland/guidingwinds-unplug` (or under Dodie's org if she has one).
- Cloudflare Pages connected to `main` for prod, `preview` branch for previews.
- Build command: `npm run build`. Output: `dist/`.
- Environment variables set in Cloudflare Pages dashboard (same names as `.env.local`).
- DNS: A / CNAME via Cloudflare DNS to Pages.
- SSL: full (strict) via Cloudflare.
- WAF: default rules + bot fight mode on (Plausible analytics whitelisted; AI bots allowed via `robots.txt`).

## 10. Local dev

```bash
npm install
cp .env.example .env.local       # fill in GHL credentials
npm run dev                      # localhost:4321
npm run build && npm run preview # production-like preview
npm run design:lint              # alias for `designmd lint DESIGN.md`
npm run design:export            # regenerate tailwind.theme.json from DESIGN.md
```

## 11. CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every PR:

1. `npm ci`
2. `npm run design:lint` — fails the build on any DESIGN.md error.
3. `npm run typecheck`
4. `npm run build`
5. Lighthouse CI against the preview deploy — fails if Performance < 90 mobile.
6. axe-core a11y scan — fails on any serious violation.

## 12. Open technical decisions

| Decision | Status | Notes |
|---|---|---|
| Self-host Plausible vs cloud | Pending | Cloud is $9/mo; self-host adds a server. Default to cloud unless cost concern. |
| Cloudflare Stream for video | Pending | Adds $5/mo + per-min. Hero loops are small enough to serve from Pages; reconsider for the YouTube-equivalent mini-doc. |
| Email sender domain (SPF/DKIM/DMARC) | Pending | Dodie's existing GHL email setup will need DKIM records added to the new domain's DNS. |
| Reviews source | Pending | Manual `content/reviews/` for v1; consider Trustpilot integration in v2 if review volume grows. |
