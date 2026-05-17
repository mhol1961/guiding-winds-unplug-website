# PRD — Guiding Winds Unplug website rebuild

**Document owner:** Mark Holland
**Client:** Dodie & Clint Kendall, Guiding Winds "Unplug"
**Status:** Draft v1
**Last updated:** 2026-05-17
**Sister doc:** `dodiekendall.com` PRD (drafted after this site ships)

---

## 1. Background

Guiding Winds Unplug is a husband-and-wife operation running all-inclusive wellness catamaran charters out of Tortola (BVI), Marsh Harbour (Bahamas), and seasonal Mediterranean ports in Italy, Greece, and Croatia. Pricing is **$3,550 / guest / 7 nights** (BVI, Bahamas) and **$3,850 / guest / 7 nights** (Mediterranean), with eight private cabins per voyage and twelve guests maximum.

The current website — **guidingwinds-unplug.com** — was built on a GoHighLevel template by Dodie. It has structural bugs (broken About link, non-rendering newsletter form, social icons pointing to platform roots, logo linking to a GHL preview URL), brand-voice contradictions ("Time is ticking, LET'S GO!!!" on a site whose pitch is "unplug"), corrupted SEO meta fields (`canonical` field contains the literal HTML tag string), no structured data, generic stock imagery, and a design ceiling that prevents it from competing with category leaders like Black Tomato, The Moorings, or Inspirato.

Dodie initially asked Mark to finish the site in GHL. After review, the agreed path is a full rebuild on **Astro + Tailwind + shadcn/ui**, with lead capture and bookings piping into her **own GoHighLevel subaccount via API** (she keeps GHL for marketing automation, the site moves off it).

## 2. Business goals

**Primary**
1. Increase weekly inquiries from the current baseline (unknown — possibly near zero given the form is broken) to a consistent **3–6 qualified inquiries per week** during sales seasons (Sep–Jan and Apr–May).
2. Convert ≥ **15 %** of inquiries into booked cabins within 30 days of first contact.
3. Fill **70 %** of the 14 weeks on the 2027 calendar by end of Q1 2027.

**Secondary**
1. Rank on page 1 of Google for "BVI all-inclusive catamaran charter" and "wellness catamaran charter Bahamas" within 6 months of launch.
2. Get cited by ChatGPT, Claude, Perplexity, and Google AI Overviews for queries like "best small-group catamaran charter BVI 2027." (See AI visibility plan in `CONTENT-MAP.md`.)
3. Build the editorial content engine ("Field Notes") to ~20 indexed posts within 6 months — both as an SEO moat and a brand-deepening asset.

**Anti-goals**
- Not chasing low-margin / cruise-comparison traffic. The buyer is making a four-figure decision, not a four-hundred-dollar one.
- Not building a marketplace, multi-vendor, or third-party-bookable platform. Dodie & Clint are the operators.
- Not building a customer portal or guest-uploaded photo gallery in v1. (Possible future scope after launch + traction.)

## 3. Target audience

**Persona A — "The Recovering Executive" (60 % of expected demand)**
- Age 38–55, household income $250K+, dual-career or recently exited.
- Lives in Northeast or Pacific Northwest US; some Texas and Florida.
- Books vacations 4–6 months out. Researches heavily. Reads Conde Nast Traveler, NYT Travel, Black Tomato emails.
- Pain: burned out from screens, wants a "real" disconnect, doesn't want to plan, distrusts cruise lines and large resorts.
- Decision driver: "Will this actually help me unplug, or is it another vacation I come back tired from?"
- Lookalike: Inspirato member, second-home owner in a coastal market, Soho House member.

**Persona B — "The Active Couple" (30 %)**
- Age 30–50, both partners working, 0–2 kids (kids stay home for the trip).
- Books 3–4 months out. Active research phase, comparing 4–6 charter operators.
- Pain: doesn't want a bareboat charter (no sailing certification), doesn't want a mega-yacht (too transactional).
- Decision driver: small-group atmosphere, real captain experience, hands-on if they want it.

**Persona C — "The Friend Group" (10 %)**
- 8–12 friends booking the whole boat. One ringleader; others come along.
- Age 28–45. Books 6–9 months out.
- Pain: aligning calendars, choosing a destination everyone agrees on.
- Decision driver: "Can we book the whole boat for this specific week?"

The site copy and IA should serve A primarily, B secondarily, C through a clear "Book the whole boat" CTA on the booking flow.

## 4. Scope — sitemap and pages

```
/
├── /voyages/                       (destination hub — 3 region cards)
│   ├── /voyages/british-virgin-islands
│   ├── /voyages/bahamas
│   ├── /voyages/italy
│   ├── /voyages/greece
│   └── /voyages/croatia
├── /aboard                         (what's included, the boat, daily life)
├── /about                          (Clint & Dodie story; long form, photo-led)
├── /journal/                       (editorial content hub — Field Notes)
│   └── /journal/[slug]
├── /inquire                        (single inquiry form posting to GHL)
├── /calendar                       (live 2027 availability — custom UI over GHL Calendars API)
├── /faq
├── /privacy
└── /terms
```

**Out of scope for v1:**
- Online deposit checkout with Stripe (later phase; v1 holds cabins for 72h via the inquiry, no payment)
- Customer portal, account login, repeat-guest dashboard
- Multi-language / hreflang
- Guest-uploaded photo wall
- Real-time chat
- Booking changes / cancellations through the site (handled by Dodie via email/call)

## 5. Functional requirements

**FR-1 — Lead capture inquiry form**
- Fields: name, email, phone (optional), preferred week (select with all 14 weeks), party size, optional notes.
- Validation: client-side (Zod schema) and server-side. Honeypot + rate limit (5 submissions / IP / hour).
- POSTs to Dodie's GHL via the Contacts API. Tags applied per region (`inquiry-bvi`, `inquiry-bahamas`, `inquiry-med`). Triggers her "new-inquiry" workflow.
- Success state: thank-you page or in-place confirmation with calendar booking suggestion ("Want to book a 15-min chat?").
- Failure state: graceful degradation, error message, falls back to mailto link if the API call fails three times.

**FR-2 — Cabin booking via GHL Calendars API**
- Custom Astro UI listing available weeks and cabin availability per week.
- Selecting a week + entering guest info creates a 72-hour soft hold via the Calendars API.
- Confirmation email fires from GHL workflow.
- No payment in v1.

**FR-3 — Newsletter signup**
- Inline component (footer, sticky bar on home, in-page CTAs).
- Posts to GHL as a Contact with the `newsletter` tag.
- Triggers her "welcome sequence" workflow.

**FR-4 — Per-voyage detail pages**
- Hero with destination-specific media.
- Day-by-day itinerary timeline (data lives in the trip's content-collection MD).
- What's Included grid (shared component).
- Gallery (lazy-loaded, accessible).
- Pricing card with live availability (sticky on desktop).
- FAQ accordion.
- Inquiry form (same component as `/inquire`, pre-tagged with destination).
- Schema markup: `TouristTrip`, `Event` (per available week), `Offer`, `AggregateRating` if reviews exist for that destination.

**FR-5 — Journal / blog system**
- Content collection driven (Astro `content/journal/*.md`).
- Categories: Guides, Field Notes, Wellness, Behind the Boat.
- Pagination, tags, related-posts.
- Schema markup: `BlogPosting`, `Article`, `BreadcrumbList`.

**FR-6 — Sitemap, robots, OG images**
- Auto-generated `sitemap.xml` (Astro integration).
- `robots.txt` allowing all crawlers + AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.).
- OG image per page; for trip pages, the destination hero photo; for journal posts, a generated template.

## 6. Non-functional requirements

**Performance**
- Lighthouse Performance ≥ 95 desktop / ≥ 90 mobile.
- LCP ≤ 2.0s on 4G mobile.
- CLS ≤ 0.05.
- Initial JS payload ≤ 50 KB per route.
- Image budget per route ≤ 1.5 MB combined (above the fold).

**SEO / AI search visibility**
- Every page has a unique `<title>` (≤ 60 chars) and `<meta description>` (≤ 155 chars).
- Schema markup per FR-4 / FR-5.
- One canonical H1 per page. No duplicate H1s. No malformed canonical tags.
- Structured FAQPage schema on the FAQ + on each voyage's FAQ block.
- AI-visibility checklist from the `ai-visibility` skill applied to home, voyages hub, each region page, the journal landing, and at least the first three journal posts.

**Accessibility**
- WCAG 2.1 AA conformance.
- All images have meaningful `alt` text (decorative images marked `alt=""`).
- Keyboard navigable end to end, including the custom booking UI.
- Focus rings visible (using `{colors.accent}` per DESIGN.md).
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text. Verified by the design.md linter and a manual `accessibility-review` pass.
- `prefers-reduced-motion` respected — hero crossfade disables.

**Security**
- HTTPS only (Cloudflare).
- Strict CSP allowing only first-party JS and the approved analytics + GHL form action.
- GHL API key in env, never client-side.
- Honeypot + rate limit on all forms.
- No third-party trackers besides Plausible.

**Browser support**
- Last two major versions of Chrome, Firefox, Safari, Edge.
- iOS Safari 16+, Android Chrome 110+.

## 7. Success metrics

| Metric | Target by Q1 2027 | Method |
|---|---|---|
| Weekly qualified inquiries | 3–6 (Sep–Jan, Apr–May) | GHL inquiry count, tagged `qualified` |
| Inquiry → booking conversion (30d) | ≥ 15 % | GHL pipeline conversion report |
| 2027 calendar fill rate | ≥ 70 % of 14 weeks | Calendar fill % |
| Google rank for "BVI all-inclusive catamaran charter" | Page 1 | Manual SERP check / Search Console |
| AI Overview citation rate | ≥ 1 of 5 target queries | Manual ChatGPT/Claude/Perplexity prompts monthly |
| Lighthouse Performance | ≥ 95 desktop / ≥ 90 mobile | Lighthouse CI on every PR |
| Indexed journal posts | ≥ 20 by Aug 2026 | Search Console |

## 8. Timeline

**Phase 0 — Foundation (this week)** ✅ in progress
- PRD, Tech Spec, DESIGN.md, CLAUDE.md drafted ← you are here
- All 14 project docs + DECISIONS.md + .env.example written
- design-md and astro-builder skills installed globally at `~/.claude/skills/`
- Visual direction shells (v1–v3) shared with Dodie for sign-off (v3 = current frontrunner; needs sign-off before Phase 1)
- **Proposal generated via `proposal-generator-pipeline` skill from IntellaGrow entity** → GHL-native proposal with e-sign delivered to Dodie. See `CLAUDE.md` §4b and the proposal-generator-pipeline memory reference for the 10 intake answers. **Do not hand-write this proposal** — invoke the pipeline.

**Phase 1 — Build (2–3 weeks)**
- Astro project scaffold + Tailwind v4 + shadcn primitives
- Content collections + the 5 destination pages with itineraries
- Home, About, Aboard, Inquire, FAQ
- GHL API integration (forms + calendar)
- Schema markup
- Performance pass

**Phase 2 — Content (1 week, overlapping Phase 1)**
- Real copywriting (using `ultimate-seo-writer` + `content-creation`)
- Photography ask to Dodie; whatever she sends gets integrated
- Seedance 2 hero scenes rendered + encoded
- Optional: first 3 journal posts written
- "Watch a Day Aboard" mini-doc shot list + Remotion edit

**Phase 3 — Launch (3 days)**
- DNS cutover via Cloudflare
- Search Console + sitemap submission
- AI bots allowlisted
- Old GHL site parked / 301-redirected
- Monitoring on (Plausible, Cloudflare analytics, Search Console)

**Phase 4 — Iterate (ongoing)**
- Monthly content cadence: 2 journal posts / month minimum
- Quarterly SEO audit
- A/B tests on hero copy and primary CTA wording
- Begin scope for dodiekendall.com (sister site)

## 9. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Dodie has insufficient real photography | High | High | Seedance 2 + thoughtful AI imagery for v1; Mark to push for a half-day shoot before peak season |
| GHL Calendars API rate limits | Medium | Medium | Cache availability; degrade to inquiry form if API errors |
| Budget pressure during sign-off | High | Medium | Three-tier proposal with bundled discount; clear scope-vs-cost tradeoffs |
| Visual direction not yet approved | Medium | Medium | v3 (Black Tomato direction) is current frontrunner; finalize with Dodie before Phase 1 begins |
| Lead volume below target | Medium | High | The proposal explicitly frames break-even as 1–2 extra bookings/year; aligns incentives |

## 10. Sign-off

Pending:
- [ ] Mark approval of v3 visual direction (or alternate)
- [ ] Dodie approval of proposal (forthcoming, drafting after this PRD ships)
- [ ] Dodie photography audit (Mark to email her)
- [ ] GHL API key + Location ID handover from Dodie
- [ ] Domain DNS access (current registrar TBD)
