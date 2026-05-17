# BUILD-PROMPTS — Guiding Winds Unplug

Stage-by-stage prompts to drive the Astro build with Claude Code. Each phase is a copy-paste-ready prompt block. Run them in order. Every phase begins by loading `CLAUDE.md`, `PRD.md`, `TECH-SPEC.md`, `DESIGN.md`, and any phase-specific docs. Every phase ends with a self-critique pass using Mark's `ui-ux-cro-master` (pre-delivery-checklist) + `multi-agent-code-review` + `council` before declaring done.

**How to use:** open a new Claude Code session in the project root, paste a phase block as the first message, let it run. When the phase passes its done-when criteria, move to the next phase.

**Skill names below refer to Mark's actual installed skills at `~/.claude/skills/`.** If a phase mentions a generic skill name that doesn't exist in Mark's library, substitute the equivalent from his library per CLAUDE.md §3. The most common substitutions:
- "design-critique" / "design-system" / "ux-copy" / "accessibility-review" → use `ui-ux-cro-master` (it covers all of these)
- "brand-review" → `copywriter-master` + `council`
- "schema-markup" → `seo-schema`
- "ultimate-seo-writer" → `seo-content` + `seo-page` + `copywriter-master`
- "on-page-seo" → `seo-page`
- "technical-seo" → `seo-technical`
- "keyword-clustering" → `seo-plan`
- "ai-visibility" → `seo-content` + `seo-schema`
- "broken-links" → `seo-audit`
- "ultimate-seo-writer" for blog posts → `seo-content` + `copywriter-master`
- "content-brief" → `seo-content`
- "email-sequence" → `email-marketing-master`
- "campaign-plan" → `email-marketing-master` + `intellagrow-os-pipeline`
- "performance-report" → `ghl-reporting` + `seo-audit`

**Last updated:** 2026-05-17 (skill names updated to match Mark's real library)

---

## Phase 0 — Pre-flight (you, not Claude Code)

Before paste-running any phase below, verify:

- [ ] Node 20+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Git installed and configured
- [ ] You're at the project root in a terminal
- [ ] All six foundation docs exist: `CLAUDE.md`, `PRD.md`, `TECH-SPEC.md`, `DESIGN.md`, `CONTENT-MAP.md`, `QA-CHECKLIST.md`
- [ ] The `design-md` skill is installed globally (run the install command from `_install-globally/INSTALL.md`)
- [ ] Dodie's GHL credentials are available (Location ID + Private Integration Token + Calendar IDs)
- [ ] `.env.local` exists (copy from `.env.example` and fill in GHL credentials)
- [ ] The visual direction is signed off (currently v3 — confirm with Mark + Dodie before Phase 2)

---

## Phase 1 — Project scaffold

**Goal:** Get an Astro 5.x project running with TypeScript, Tailwind v4, and shadcn/ui primitives wired up. Repo structure matches `TECH-SPEC.md` §2.

**Prompt:**

```
Before doing anything, read CLAUDE.md, TECH-SPEC.md sections 1-3 and §10, and DESIGN.md.

Scaffold a new Astro 5.x TypeScript project in this directory called "guidingwinds-unplug". Use the official `npm create astro@latest` flow with these answers:
- TypeScript: strict
- Install dependencies: yes
- Initialize git: no (we'll use the existing repo)

Then add these integrations and dependencies:
- @astrojs/tailwind (Tailwind v4 — verify latest)
- @astrojs/sitemap
- @astrojs/check (for typecheck)
- @astrojs/vercel or @astrojs/cloudflare adapter — use Cloudflare (TECH-SPEC §9)
- zod
- @google/design.md (dev dependency, used for linting DESIGN.md)
- shadcn/ui — initialize with the CLI, base color "zinc" (we'll override via DESIGN.md tokens)

Create the folder structure exactly as specified in TECH-SPEC.md §2: src/pages, src/content, src/components/{ui,home,voyage,journal,shared}, src/layouts, src/lib/{ghl,schema,utils}, src/styles, public/{media,og}.

Set up the npm scripts in package.json:
- "dev": "astro dev"
- "build": "astro build"
- "preview": "astro preview"
- "typecheck": "astro check"
- "design:lint": "designmd lint DESIGN.md"
- "design:export": "designmd export --format css-tailwind DESIGN.md > src/styles/theme.css"

Configure astro.config.mjs with the Cloudflare adapter, Tailwind integration, sitemap integration (site URL from PUBLIC_SITE_URL env), and content collections enabled.

Set up Tailwind v4 config to import from src/styles/theme.css (which will be generated from DESIGN.md). Use Tailwind's CSS-first config approach — no tailwind.config.js needed if v4.

Create a placeholder src/styles/global.css that imports the theme.

Create the .env.example file per TECH-SPEC.md §6.

Add .gitignore entries: node_modules, dist, .env.local, .astro/.

Run `npm run design:export` to generate the initial theme.css from DESIGN.md, then `npm run design:lint` to confirm zero errors.

Run `npm run typecheck` and `npm run build` to confirm everything compiles.

Skills to invoke: project-kickoff (already used to generate the foundation docs — refresh recall), design-md (for theme export), python-deployment (only if any deployment hiccups; primarily a TypeScript project).

Done when:
- `npm run dev` opens localhost:4321 with the default Astro page
- `npm run design:lint` returns zero errors
- `npm run design:export` generates a non-empty src/styles/theme.css
- `npm run typecheck` passes
- Folder structure matches TECH-SPEC.md §2 exactly
- Commit: "feat: scaffold Astro 5 + Tailwind v4 + shadcn/ui"
```

---

## Phase 2 — Design system + shared components

**Goal:** All UI primitives and shared layout pieces (Nav, Footer, Buttons, Newsletter, SEO head, Schema script tag) built from DESIGN.md tokens.

**Prompt:**

```
Read CLAUDE.md sections 2 and 7, DESIGN.md in full, and TECH-SPEC.md §2 (Components subfolder).

Generate src/styles/theme.css from DESIGN.md via `npm run design:export`. Confirm the theme.css contains CSS custom properties for every token: --color-*, --font-*, --spacing-*, --radius-*. Update src/styles/global.css to apply baseline body styles using these tokens (background, color, font-family).

Build these shared components in src/components/shared/:

1. Nav.astro — sticky top, transparent initially, solid background on scroll. Logo + 4 menu items (Voyages, Aboard, Our Story, Journal) + primary CTA "Hold a Cabin". Mobile menu via shadcn Sheet.
2. Footer.astro — three-column layout (brand+newsletter / Voyages / Plan), social icons row, copyright base. Per DESIGN.md card-bone styling on the brand block.
3. NewsletterSignup.astro — single-input form, POSTs to /api/newsletter (server-side action, to be built in Phase 7). Inline variant + footer variant.
4. SeoHead.astro — accepts props {title, description, canonical, ogImage, schema?} and renders all needed meta tags. Includes Open Graph + Twitter card tags. Conditionally renders the JSON-LD <script type="application/ld+json"> when `schema` prop is provided.
5. SchemaScript.astro — utility that takes a schema object and emits a properly escaped JSON-LD script.

Then build these UI primitives in src/components/ui/ (these are shadcn-style — install only what we use):

1. Button.tsx — variants: primary (coral), ghost (transparent on dark), on-bone (dark on cream). Sizes: default, mini. NO rounded corners (per DESIGN.md "Square everything").
2. Input.tsx + Textarea.tsx + Select.tsx — use the input component spec from DESIGN.md frontmatter.
3. Sheet.tsx — for mobile menu.
4. Accordion.tsx — for FAQ blocks.
5. Tabs.tsx — for picker tab bar on home.
6. Badge.tsx — pill variant only.

All UI primitives must use only tokens from DESIGN.md — `grep` for hex color values in src/components/ui/ should return nothing.

Set up the BaseLayout.astro in src/layouts/ that includes the Nav, a <main> slot, and Footer. Accept all SeoHead props as front-matter props.

Skills to invoke: design-md (re-export if you tweak tokens), design-system (for component naming/variants), ux-copy (button labels, nav labels), accessibility-review (focus rings, ARIA on Sheet and Accordion).

Done when:
- All shared components render without console warnings
- Storybook-style demo page at /preview-components renders every UI primitive in every variant (build this throwaway page; we'll delete before launch)
- accessibility-review of the demo page returns zero serious findings
- npm run design:lint still passes
- Commit: "feat: shared components and UI primitives from DESIGN.md tokens"
```

---

## Phase 3 — Home page

**Goal:** Full home page matching shell-home-v3.html structure with real Astro components.

**Prompt:**

```
Read CLAUDE.md §5 (brand voice) + §6 (media), DESIGN.md in full, CONTENT-MAP.md home section, and re-open shell-home-v3.html for structural reference. The shell is the visual proof; this phase implements it cleanly.

Build src/pages/index.astro using BaseLayout. The page composes these home-specific components from src/components/home/:

1. Hero.astro — full-bleed cinematic crossfade with 4 scenes. Accepts {scenes: HeroScene[]}. Each scene is {video?: string, image: string, alt: string}. If video is present, render <video autoplay muted loop playsinline preload="metadata">; otherwise render <img> with Ken Burns. Centered text overlay with display headline, sub-headline, two CTAs. Trust strip at bottom. Honor prefers-reduced-motion.

2. Feeling.astro — narrow cream section. Eyebrow, h2, three paragraphs, punchline, CTA. Max-width 780px. Text-balance on the h2.

3. TestimonialRow.astro — 4 inline quotes loaded from src/content/reviews/ via getCollection. Filter for `homepage_feature: true` or take the most-recent 4 with rating 5.

4. Picker.astro — 5 pickcards. Region tab is active by default; other tabs are present but disabled with a "Coming Soon" tooltip for v1 (per CONTENT-MAP §Home).

5. ExploreCards.astro — 3 large editorial trip cards. Loads from src/content/voyages/ filtered by region. Card title uses the formula "{verb}: {italic phrase}" — verbs are Uncover / Drift / Wander per CONTENT-MAP.

6. PressStrip.astro — 4 credential items in a thin row.

7. Megatype.astro — full-bleed image background + dark overlay + giant "UNPLUG" type. Accepts {bgImage, mainText, subText, ctaLabel, ctaHref}.

8. AboutSplit.astro — two-column layout. Left: text + CTAs. Right: image with play button overlay (links to /about and triggers video modal — modal itself is a Phase 5 task; for now the button is a link).

9. TrustPillars.astro — 5-column row with 5 trust pillars. Icon (28px stroke svg, coral), label, 2-line description.

10. GoBlock.astro — full-width coral CTA section. Headline + single button.

Use only DESIGN.md tokens for all styling. No hardcoded hex. No rounded corners except on the badge chip in pickcards.

Hero scenes for v1 (until Seedance renders are ready): use the four scene URLs from shell-home-v3.html with the same gradient fallbacks.

Skills to invoke: design-critique (after building the page, before showing Mark), brand-review (voice and word check), ux-copy (button labels), schema-markup (add Organization schema in SeoHead).

Done when:
- /index.astro renders pixel-close to shell-home-v3.html (variation in image loading is fine)
- All copy on the page passes brand-review (no banned words, no exclamation marks)
- design-critique returns no "major" findings
- accessibility-review passes (keyboard navigation through hero CTAs, picker tabs, all buttons)
- Lighthouse Performance ≥ 95 desktop on the page
- Commit: "feat: home page with cinematic hero and full section composition"
```

---

## Phase 4 — Voyage detail template + content collections

**Goal:** One template renders all 5 voyage pages from content collection data. BVI is the canonical example; the rest reuse it.

**Prompt:**

```
Read CLAUDE.md §7 (folder structure), TECH-SPEC.md §3 (content schemas) and §5 (schema markup), CONTENT-MAP.md voyage detail section, and DESIGN.md.

Define the content collections in src/content/config.ts exactly as in TECH-SPEC.md §3. Validate Zod schemas compile.

Create the five voyage content files in src/content/voyages/:
- british-virgin-islands.md
- bahamas.md
- italy.md
- greece.md
- croatia.md

Each file has the frontmatter populated per the Zod schema (region, name, country, nights, pricePerGuestUSD, heroImage, availableWeeks per PRD's 2027 calendar, full 8-day itinerary, inclusions/exclusions, SEO title and description per CONTENT-MAP). Body uses real, on-brand prose for the "Overview" section. Pull from CONTENT-MAP §`/voyages/british-virgin-islands` for the BVI itinerary; write the other four in the same voice. For Italy, Greece, Croatia: itineraries can be condensed to "Sample route — flexes with weather" since we have less day-by-day specificity. Pricing: $3,550 for BVI + Bahamas, $3,850 for Italy + Greece + Croatia.

Build src/pages/voyages/[slug].astro as a dynamic route using getStaticPaths over the voyages collection. The page composes these voyage-specific components from src/components/voyage/:

1. VoyageHero.astro — destination-specific full-bleed image, breadcrumb, eyebrow with region + dates, h1, stats row.
2. VoyageOverview.astro — left: prose narrative from the .md body + inclusion chips. Right: PricingCard (sticky on desktop).
3. PricingCard.astro — sticky-on-desktop card. Price line, "All-inclusive · No hidden fees," available weeks list with cabins-left badges (data from voyage frontmatter), CTA "Hold a Cabin" → /api/hold-cabin form, fine-print legal.
4. Timeline.astro — vertical day-by-day rail with coral dots. Renders the itinerary array from the voyage.
5. Gallery.astro — 5-tile asymmetric grid. Lazy-loaded images (loading="lazy"), focus-able for keyboard users.
6. VoyageFaq.astro — Accordion (uses Phase 2 UI primitive). 6 questions from CONTENT-MAP.
7. VoyageInquiry.astro — wraps the InquiryForm component (built in Phase 7) pre-tagged with this voyage's region.

Build src/pages/voyages/index.astro (the destinations hub):
- Secondary hero with one still image
- Calendar overview table (14 rows for 2027) — uses data aggregated from all voyage content files
- Three region cards (BVI, Bahamas, Mediterranean)
- Footer

Skills to invoke: ultimate-seo-writer (when writing the .md body prose for each voyage), content-brief (cross-reference each voyage page brief in CONTENT-MAP), schema-markup (TouristTrip + Event + Offer + FAQPage + BreadcrumbList), on-page-seo (validate each page), internal-linking (each voyage page links to adjacent voyages and the journal).

Done when:
- All 5 voyage pages render with full data
- /voyages/ hub page renders all 14 weeks correctly
- Schema markup validates in Google Rich Results Test for each voyage
- Each voyage page's <title> and <meta description> match CONTENT-MAP targets
- design-critique pass: no major findings
- brand-review pass: voice consistent, no banned words
- accessibility-review pass: keyboard navigable, sticky pricing card doesn't trap focus
- Commit: "feat: voyage detail template + 5 content files + destinations hub"
```

---

## Phase 5 — Aboard, About, FAQ, Inquire pages

**Goal:** Round out the static page set.

**Prompt:**

```
Read CONTENT-MAP.md sections /aboard, /about, /faq, /inquire. Read CLAUDE.md §5 (brand voice).

Build the four pages:

1. src/pages/aboard.astro — hero with boat-interior image, 8-icon What's Included grid (reuse the IncludedGrid component or extract one if not yet built), "The Boat" section with 4-6 areas (salon, galley, cabins, foredeck, helm, head — note "photos to come" if unavailable), "What's NOT included" numbered list, "A typical day aboard" narrative paragraph, final CTA.

2. src/pages/about.astro — hero with image of Clint and Dodie, Clint's story (3 paragraphs from CONTENT-MAP), Dodie's story (3 paragraphs), "Why Guiding Winds exists" section, "The boat" preview linking to /aboard, credentials and safety list, CTA + "Watch the Film" button. The "Watch the Film" button opens a modal Dialog (shadcn primitive) with an empty <video> placeholder for now — Mark will fill the source after the Remotion edit is done.

3. src/pages/faq.astro — Accordion grouped by topic: Before booking, The boat & cabins, The experience, Logistics, Safety. All Q&A from CONTENT-MAP. Apply FAQPage schema. Add internal links from answers back to relevant pages (cancellation policy → /terms, what to pack → /journal/what-to-actually-pack).

4. src/pages/inquire.astro — minimal hero, InquiryForm component (Phase 7), "What happens next" 3-step list, FAQ shortcut with 3 inline Q&A.

Skills to invoke: ultimate-seo-writer (each page's body), brand-review, ux-copy (form labels and helpers on /inquire), schema-markup (FAQPage on /faq, Person on /about for Clint and Dodie), accessibility-review.

Done when:
- All four pages render without console errors
- /faq passes Google Rich Results Test for FAQPage schema
- /about has Person schema for both Clint and Dodie
- design-critique, brand-review, accessibility-review all pass
- Commit: "feat: aboard, about, faq, inquire pages"
```

---

## Phase 6 — Journal system

**Goal:** Editorial content hub + post template + first 5 launch posts.

**Prompt:**

```
Read CLAUDE.md §3 (journal-related skills), TECH-SPEC.md §3 (journal content schema), CONTENT-MAP.md /journal sections, DESIGN.md.

Build:

1. src/pages/journal/index.astro — journal landing. Hero header, category filter row (Guides / Field Notes / Wellness / Behind the Boat), post grid (9 per page), pagination.

2. src/pages/journal/[slug].astro — post template. Hero image + category eyebrow + h1 + author + date. Long-form body. Author bio block. 3 related-posts cards. Inline NewsletterSignup. CTA bar.

3. PostLayout.astro in src/layouts/ — wraps the BaseLayout and adds post-specific schema markup (BlogPosting + Article + BreadcrumbList).

4. Write the 5 launch posts in src/content/journal/ using the ultimate-seo-writer skill. Each post must:
   - Have a TL;DR / "answer capsule" paragraph immediately after the h1 (used by AI search engines for citation).
   - Be 1,500–2,500 words.
   - Use sequential heading hierarchy (h2, h3 only — h1 is the post title).
   - Cite specific facts (anchorages, exact gear brands, exact weather windows, named experiences).
   - End with a CTA that links to the relevant voyage or to /inquire.

Posts to write:
- "What to actually pack for a week off the grid" (Guide) — TL;DR: 7 essentials, 9 overrated items, one secret. Internal-link to /aboard.
- "The five anchorages in the BVI we love most" (Field Notes) — TL;DR + 5 anchorages with reasons. Internal-link to /voyages/british-virgin-islands.
- "Why mornings at sea are the best therapy" (Wellness) — TL;DR + breathwork/meditation framing + science citations.
- "A captain's case for the catamaran over the monohull" (Behind the Boat) — TL;DR + 6 reasons + Clint quote.
- "Anegada lobster: a deeply unserious guide" (Field Notes) — TL;DR + history + how to order + photo direction (note "photos to come").

Skills to invoke: ultimate-seo-writer (every post), content-brief (per-post brief before writing), keyword-clustering (group posts around topical clusters), internal-linking, schema-markup (BlogPosting per post), ai-visibility (TL;DR formula).

Done when:
- /journal/ landing page renders all 5 posts with correct category filtering
- Each post renders with TL;DR at top, proper heading hierarchy, internal links to relevant pages
- Each post has BlogPosting + Article + BreadcrumbList schema validated in Rich Results Test
- All 5 posts pass brand-review for voice consistency
- on-page-seo skill passes for each post
- Commit: "feat: journal system + 5 launch posts"
```

---

## Phase 7 — GHL integration (forms + calendar)

**Goal:** Real lead capture and cabin holds wired through to Dodie's GHL account.

**Prompt:**

```
Read CLAUDE.md §4 (GHL non-negotiables), TECH-SPEC.md §4 (full GHL integration), CONTENT-MAP.md §"GHL email & SMS templates", and GHL-INTEGRATION.md (the operational runbook).

Build the GHL client wrapper:

1. src/lib/ghl/client.ts — the typed fetch wrapper from TECH-SPEC §4.2.
2. src/lib/ghl/contacts.ts — exports createContact(payload), tagContact(id, tag), upsertContact(payload).
3. src/lib/ghl/calendars.ts — exports getFreeSlots(calendarId, startDate, endDate) and createHoldAppointment(calendarId, contactPayload, slot, holdHours).

Build the Astro Actions:

4. src/actions/inquire.ts — the inquire action from TECH-SPEC §4.3, exactly as specified. Honeypot field, server-side Zod validation, rate-limit middleware (5 submissions per IP per hour using a simple in-memory or KV-backed counter), 3-retry logic on GHL failure, mailto fallback.

5. src/actions/newsletter.ts — minimal version of inquire — creates a contact with only the `newsletter` tag.

6. src/actions/hold-cabin.ts — checks GHL availability, creates a contact (if new), creates a 72-hour hold appointment, returns success state.

Build the InquiryForm component in src/components/shared/InquiryForm.astro that's used on /inquire and on each voyage page:

7. Form uses Astro Actions form binding. Client-side validation via Zod schema imported from the action. Honeypot field hidden via CSS (don't use display:none — bots detect that; use opacity:0 + tabindex:-1 + aria-hidden + position:absolute).
8. On submit success: replace form with thank-you message, fire a Plausible custom event "inquiry_submitted".
9. On submit failure: show inline error and mailto fallback link with prefilled subject.

Build the calendar booking flow:

10. src/pages/calendar.astro — server-rendered (or ISR with 15-minute revalidation). Calls getFreeSlots for each region's calendar at build time + every 15 min via Cloudflare edge cache. Renders the 14 weeks with live cabin-availability badges.
11. The "Hold a Cabin" button on each row opens a Sheet (mobile) or Dialog (desktop) with a mini-form: name, email, party size. Submits to hold-cabin action.
12. Success state: "Held until {date}. Check your email."

Skills to invoke: fastapi-backend (for Action patterns — adapt to Astro), ux-copy (form labels, validation messages, success/error states), accessibility-review (form is keyboard-only navigable, errors are announced to screen readers).

Pre-build with Mark:
- Verify GHL credentials in .env.local
- Verify GHL workflows exist for the four tags (inquiry-bvi, inquiry-bahamas, inquiry-med, newsletter) — Mark will build these in GHL alongside this phase (see GHL-INTEGRATION.md)
- Test in a staging environment first

Done when:
- Submitting /inquire form lands a contact in Dodie's GHL with all custom fields populated and correct tag
- Submitting from a voyage page applies the region-specific tag
- Newsletter signup creates a contact with only `newsletter` tag
- Cabin hold creates the GHL appointment with appointmentStatus 'new'
- Rate limiter rejects 6th submission within an hour
- Honeypot returns 200 + does NOT create a contact for spam
- GHL API failure path: 3 retries with exp backoff, then mailto fallback
- Forms validated against a11y rules (associated labels, error announcements)
- Commit: "feat: GHL integration — inquiry, newsletter, cabin holds"
```

---

## Phase 8 — Schema markup pass

**Goal:** Every page has the structured data it needs to compete in Google rich results and AI search citations.

**Prompt:**

```
Read TECH-SPEC.md §5 (schema markup) and CONTENT-MAP.md "AI search visibility plan".

Build src/lib/schema/ utilities:

1. organization.ts — returns the Organization JSON-LD with brand name, URL, logo, social profiles, contact info.
2. tourist-trip.ts — accepts a voyage object and returns TouristTrip + nested Offer per available week.
3. event.ts — accepts a single available week and returns Event with startDate, endDate, offers, location.
4. faq-page.ts — accepts an array of Q&A and returns FAQPage with mainEntity.
5. blog-posting.ts — accepts a journal post and returns BlogPosting + Article.
6. person.ts — accepts a person object and returns Person.
7. breadcrumb.ts — accepts an array of {name, item} and returns BreadcrumbList.
8. review.ts — accepts a review object and returns Review + AggregateRating if multiple.

Then wire schemas into pages via SeoHead's `schema` prop:

- / : Organization + AggregateRating
- /voyages/ : ItemList + BreadcrumbList
- /voyages/[slug] : TouristTrip + Event[] + FAQPage + Review + AggregateRating + BreadcrumbList
- /aboard : Product + BreadcrumbList
- /about : Person[Clint, Dodie] + Organization + BreadcrumbList
- /journal/ : Blog + BreadcrumbList
- /journal/[slug] : BlogPosting + Article + Person + BreadcrumbList + FAQPage (if Q&A present in body)
- /faq : FAQPage + BreadcrumbList
- /inquire : ContactPage + BreadcrumbList

Validate every page through Google Rich Results Test (https://search.google.com/test/rich-results) and Schema.org validator (https://validator.schema.org/).

Update robots.txt and add public/robots.txt (or src/pages/robots.txt.ts) explicitly allowing: Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai. Disallow only /api/.

Make sure src/pages/sitemap.xml.ts (or the @astrojs/sitemap integration) generates a proper sitemap with all pages including voyage [slug] paths.

Skills to invoke: schema-markup (every schema definition), technical-seo (sitemap and robots), ai-visibility (TL;DR/answer-capsule placement on each indexable page).

Done when:
- Every page in the sitemap returns valid JSON-LD in Google Rich Results Test
- robots.txt explicitly allows the 8 listed bots
- Sitemap renders at /sitemap.xml and includes all public pages
- Manual prompt test: ask ChatGPT "What's the best small-group BVI catamaran charter for 2027?" — at minimum, the response should not be wildly off (baseline capture before launch)
- Commit: "feat: structured data + AI-search-ready robots and sitemap"
```

---

## Phase 9 — Performance pass

**Goal:** Hit Lighthouse ≥ 95 desktop / ≥ 90 mobile on every key route.

**Prompt:**

```
Read TECH-SPEC.md §8 (Performance & caching) and QA-CHECKLIST.md §7.

Run Lighthouse against /, /voyages/, /voyages/british-virgin-islands, /aboard, /about, /journal, /journal/[slug], /inquire. Note any score under 95 desktop or 90 mobile.

Fix any of these common issues:

1. Hero video: encode each scene with ffmpeg `-crf 28 -preset slow -movflags +faststart`. Target ≤ 4 MB per scene. Provide both .mp4 (h.264) and .webm (vp9) sources. preload="metadata" only.
2. Images: ensure astro:assets is doing AVIF + WebP. Above-the-fold images get explicit width/height. Below-the-fold images get loading="lazy". LQIP enabled.
3. Fonts: confirm system stack — no web font loads. If a brand demands a custom font later, preload with font-display: swap.
4. JS payload: confirm initial route JS ≤ 50 KB. If exceeded, find the culprit. Likely candidates: any unintended React island, third-party widgets, large Tailwind output (use the v4 JIT mode).
5. Render-blocking: confirm zero render-blocking JS or CSS in Lighthouse audit. Critical CSS should be inlined per page (Astro does this).
6. Third-party: Plausible only. Remove any other scripts.
7. Cache headers: Cloudflare Pages handles static caching. For /calendar (dynamic), set Cache-Control: public, max-age=900, s-maxage=900 (15 minutes).
8. CLS: explicit dimensions on every image and video. Reserve space for the trust strip on hero (don't let it appear after the video loads).

Skills to invoke: technical-seo (LCP, CLS, TBT — Core Web Vitals), python-deployment (only for the Cloudflare config tweaks, if relevant).

Set up Lighthouse CI in .github/workflows/lighthouse.yml that runs against the preview deploy on every PR and fails the build if Performance drops below 90 mobile.

Done when:
- Lighthouse Performance ≥ 95 desktop / ≥ 90 mobile on every key route
- LCP ≤ 2.0s on 4G mobile throttling
- CLS ≤ 0.05 every route
- Hero video size budget: ≤ 4 MB per scene
- Lighthouse CI green
- Commit: "perf: hit Lighthouse targets across all key routes"
```

---

## Phase 10 — Pre-launch QA

**Goal:** Walk every line of QA-CHECKLIST.md and resolve everything before DNS cutover.

**Prompt:**

```
Read QA-CHECKLIST.md in full.

Walk every section, every checkbox. For each unchecked item:
- If it's an automated check (Lighthouse, axe, design.md linter): run it, fix any failures, re-run until green.
- If it's a manual check (visual scan, content QA, browser matrix): do the manual check.
- If it's a Mark-specific check (sign-off, photo permissions): flag it and stop.

Pay special attention to sections 2 (self-critique), 4 (SEO on-page), 5 (structured data), 7 (Lighthouse), 9 (GHL integration), and 10 (content QA — banned words list).

Run the design-critique, brand-review, and accessibility-review sub-agents one final time on the full set of public pages. Resolve any "major" finding.

Build a launch checklist file at .launch-day.md with anything that must happen on cutover day specifically (DNS swap, sitemap submission, old-site redirect setup, monitoring confirmation, rollback procedure).

Skills to invoke: design-critique, brand-review, accessibility-review, on-page-seo (every page), technical-seo (sitemap, robots, perf), schema-markup (re-validate), broken-links (final sweep), seo-audit (consolidated final report).

Done when:
- Every checkbox in QA-CHECKLIST.md sections 1-13 is checked, OR documented as deliberately deferred with reason and ticket
- Section 14 (backup) is set up (git tag, GHL workflow snapshots)
- Section 15 (sign-off) sent to Mark for final review
- A separate .launch-day.md exists with the cutover runbook
- Commit: "chore: pre-launch QA pass + launch-day runbook"
```

---

## Phase 11 — Launch

**Goal:** Cut over DNS, verify everything, monitor.

**Prompt:**

```
Read .launch-day.md (the launch-specific runbook produced in Phase 10) and DEPLOY.md.

Execute the cutover:

1. Final build: `npm run build`. Confirm successful.
2. Tag the release: `git tag -a v1.0.0 -m "Launch"`. Push tags.
3. Cloudflare Pages production deploy: confirm the build is green on `main`.
4. DNS cutover via Cloudflare:
   - Change A/CNAME records for guidingwinds-unplug.com to point to Cloudflare Pages.
   - Verify SSL is Full (Strict).
   - Verify HSTS preload.
5. Verify the live site at https://guidingwinds-unplug.com loads correctly. Walk the home page on desktop + mobile.
6. Submit sitemap to Google Search Console: https://guidingwinds-unplug.com/sitemap.xml
7. Submit sitemap to Bing Webmaster.
8. Set up 301 redirects from old GHL URLs to new equivalents (in Cloudflare Rules or _redirects):
   - / → / (no change, just confirm)
   - /destination-schedule → /voyages/
   - /-649302 → /about
   - /privacy-policy → /privacy
   - /terms-and-conditions → /terms
9. Test 5 inquiry submissions end-to-end. Confirm they land in Dodie's GHL with correct tags and trigger her workflows.
10. Confirm Plausible is recording page views.
11. Confirm UptimeRobot is pinging.
12. Send Mark + Dodie the "launched" email with link.

Skills to invoke: python-deployment (DNS / CDN config sanity), technical-seo (sitemap submission), brand-review (the launch email).

Done when:
- Production site is live at https://guidingwinds-unplug.com
- Old URLs redirect to new equivalents
- Test inquiries are landing in GHL
- Monitoring is active
- Mark and Dodie have been notified
- Commit: "launch: v1.0.0 — production cutover"
```

---

## Phase 12 — Post-launch monitoring (ongoing)

**Goal:** Catch regressions early, learn from real traffic.

**Daily for the first week:**
- Check Plausible: visits, top pages, top sources, conversion to inquiry.
- Check Search Console: indexing status, any crawl errors.
- Check Cloudflare analytics: any 4xx/5xx spikes.
- Check Dodie's GHL: any inquiries that didn't fire workflows.
- Check UptimeRobot: uptime ≥ 99.9%.

**Weekly for first month:**
- Re-run QA-CHECKLIST sections 4, 5, 6, 7.
- Manual prompt test in ChatGPT/Claude/Perplexity: are we getting cited yet?

**Monthly thereafter:**
- Performance report (per the performance-report skill).
- 2 new journal posts (per content-strategy).
- SEO audit (per seo-audit skill).

If any metric trends in the wrong direction, open an issue and re-engage the relevant phase prompt above.

---

## Skills referenced across phases — Mark's real library

For quick scan, the skills each phase should invoke from `~/.claude/skills/`:

- **Phase 1 (scaffold)**: `project-kickoff`, `astro-builder` (read references/astro-setup.md), `design-md`, `planning-with-files`
- **Phase 2 (design system + shared components)**: `ui-ux-cro-master` (read references/design-trends-2026.md, references/creative-philosophy.md, references/component-patterns.md, references/pre-delivery-checklist.md), `astro-builder` (read references/tailwind-components.md, references/taste-skill.md), `design-md` (re-export tokens), `claude-design-handoff`
- **Phase 3 (home page)**: `ui-ux-cro-master` (read references/conversion-optimization.md, references/component-patterns.md), `cro-landing-page`, `astro-builder` (read references/taste-skill.md), `copywriter-master` (for hero, section copy), `seo-schema` (Organization, AggregateRating on home), `seo-page` (on-page SEO for /)
- **Phase 4 (voyage detail + content collections)**: `seo-content` (for voyage prose), `copywriter-master`, `astro-builder` (read references/content-collections.md, references/seo-checklist.md), `seo-schema` (TouristTrip, Event, Offer, FAQPage, Review, BreadcrumbList), `seo-page`, `ui-ux-cro-master` (sticky pricing card pattern in references/component-patterns.md)
- **Phase 5 (Aboard / About / FAQ / Inquire)**: `seo-content`, `copywriter-master`, `ui-ux-cro-master`, `seo-schema` (FAQPage on /faq, Person on /about), `seo-page`
- **Phase 6 (journal system)**: `seo-content`, `seo-plan` (cluster planning), `copywriter-master`, `astro-builder` (read references/content-collections.md), `seo-schema` (BlogPosting, Article, BreadcrumbList), `seo-page`
- **Phase 7 (GHL integration)**: `ghl-api` (the core), `astro-builder` (read references/turso-setup.md for the action-handler pattern), `ui-ux-cro-master` (form design — references/component-patterns.md), `email-marketing-master` (for the GHL workflow nurture copy)
- **Phase 8 (schema markup pass)**: `seo-schema`, `seo-technical` (sitemap, robots), `seo-content` (TL;DR answer-capsule placement for AI search)
- **Phase 9 (performance)**: `seo-technical` (Core Web Vitals, LCP/CLS/INP), `astro-builder` (read references/deployment.md, references/astro-setup.md), `seo-images` (AVIF/WebP, lazy loading)
- **Phase 10 (pre-launch QA)**: `ui-ux-cro-master` (full pre-delivery-checklist run), `seo-audit`, `seo-technical`, `seo-page` (every page), `seo-schema` (re-validate), `copywriter-master` (final voice pass), `council` or `multi-agent-code-review` (independent review pass), `security-audit` (forms + GHL integration)
- **Phase 11 (launch)**: `astro-builder` (read references/deployment.md), `ghl-snapshot-spec` (snapshot workflows before launch), `seo-technical` (Search Console / Bing submission), `seo-sitemap`, `copywriter-master` (for the launch announcement email))

If a phase calls for a skill that isn't installed in `~/.claude/skills/`, install it first or substitute per the mapping in the header of this file. New skills should follow the SKILL.md format (frontmatter `name:` + `description:`, optional `references/` folder for on-demand context) and live at `~/.claude/skills/<skill-name>/SKILL.md`.
