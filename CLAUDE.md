# CLAUDE.md — Guiding Winds Unplug website rebuild

> **For every future Claude / Claude Code session opened in this project:** read this file in full before doing anything else. It encodes the project's conventions, stack, brand position, and the skill stack the team expects you to use. The other docs (`PRD.md`, `TECH-SPEC.md`, `DESIGN.md`, `CONTENT-MAP.md`, `QA-CHECKLIST.md`) sit alongside this one and should be loaded when relevant to the task at hand.

---

## 1. What this project is

A full rebuild of **guidingwinds-unplug.com** for Dodie & Clint Kendall. The existing site is a GoHighLevel template with multiple structural bugs, generic copy, and a design ceiling that prevents the brand from competing at the price point ($3,550 – $3,850 / guest / week, 7-night all-inclusive catamaran charters).

The replacement is a custom **Astro 5 + Tailwind v4 + shadcn/ui** site that pipes lead capture and bookings into **Dodie's own GoHighLevel account via API** (decoupled — GHL stays as her CRM/marketing engine, but the site is no longer hosted there).

A second site, **dodiekendall.com**, is on deck after this one ships. Conventions established here should carry forward.

See `PRD.md` for full scope and success metrics. See `TECH-SPEC.md` for architecture. See `DESIGN.md` for the brand's design system in the Google DESIGN.md format that all AI coding agents read.

## 2. Stack — the only acceptable choices

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro 6.x (latest stable) | Static-first with islands for interactive bits |
| Styling | Tailwind v4 (CSS-first config) | Tokens generated from `DESIGN.md` by `scripts/design-export.mjs` into `src/styles/theme.css` as a Tailwind v4 `@theme` block. The upstream `@google/design.md` CLI only emits Tailwind v3 JSON, so we maintain the v4 exporter locally — see DECISIONS.md ADR-015. |
| Components | shadcn/ui (selected primitives only) | Only the components actually used — no kitchen sink |
| Forms | Astro Actions + Zod validation | Posts to GHL via API on the server side |
| Hosting | Cloudflare Pages (or Vercel if Cloudflare blocks anything) | Free tier; edge-rendered |
| Domain / DNS | Cloudflare | Migrate from current registrar in launch phase |
| Analytics | Plausible (privacy-first, lightweight) | Or PostHog if Dodie wants product analytics later |
| Email/SMS/CRM | GoHighLevel (Dodie's own subaccount, NOT one of Mark's agency subaccounts) | Forms post to her account via REST API |
| Booking | Custom UI wrapping the GHL Calendars API | Do **not** embed GHL's stock widget — it breaks the design |
| Video | Local MP4/WebM for hero loops · YouTube embeds for SEO sections | See "Media" below |

Do not introduce Next.js, Vue, plain React SPA, WordPress, or any GHL-rendered pages without explicit instruction from Mark. If the answer feels like "we need React state across pages," propose an Astro island first; only escalate to a full Next.js page if there's a genuine app surface.

## 3. Skills — use Mark's actual installed skills on this project

This project benefits from the full skill stack in `~/.claude/skills/`. **Do not pick a single skill and call it done.** Survey and invoke every skill that materially helps. The team-wide preference is rigor over speed (see also `MEMORY.md`).

**Use these exact skill names — they are Mark's real installed skills, not generic equivalents.** Run `/skills` in Claude Code to confirm availability.

**Master design skill — invoke FIRST for any visual / frontend work**
- `ui-ux-cro-master` — the master design / UX / CRO skill. This skill SUPERSEDES all `ui-ux-*` predecessors and bakes in the anti-AI-slop framework (see §9). Triggers on virtually every design keyword. Has on-demand references for design-trends-2026, creative-philosophy, brand-fidelity, clone-and-customize, component-patterns, conversion-optimization, industry-guides, and pre-delivery-checklist. **Read its `references/design-trends-2026.md` and `references/pre-delivery-checklist.md` before writing any UI code.**

**Foundation / setup**
- `project-kickoff` — for any new module of work that needs a mini-PRD
- `planning-with-files` — when planning multi-file work
- `design-md` — generates or updates the project's `DESIGN.md` (Google spec)
- `client-brief-intake` / `service-design-intake` — for any new client work or service definition
- `proposal-generator-pipeline` — for the Dodie proposal (do not hand-write from scratch)

**Design & UX**
- `ui-ux-cro-master` (the master — see above)
- `cro-landing-page` — landing-page CRO specifically
- `claude-design-handoff` — design → dev handoff specs
- `ux-journey-planner` — UX flow planning

**Build (the Astro site itself)**
- `astro-builder` — the full Astro + Tailwind + SEO build skill. Read its `references/taste-skill.md` before any UI code; its `references/astro-setup.md` for scaffolding; `references/seo-checklist.md` for per-page SEO; `references/tailwind-components.md` for component patterns; `references/content-collections.md` for the voyage/journal/reviews collections; `references/deployment.md` for Cloudflare Pages.
- `ecom-frontend-nextjs` — only if the project pivots to needing a real app surface (currently out of scope per ADR-001)
- `ecom-backend-stripe-supabase` — only when Stripe deposit checkout is added (currently deferred per ADR-009)

**Copy & content**
- `copywriter-master` — master copy skill, use for every page's body copy and headlines
- `copywriting` — supporting copy work
- `email-marketing-master` — for the GHL nurture flows (W1–W9 in GHL-INTEGRATION.md). Use this instead of generic email-sequence prompts.

**SEO — Mark's full suite (13 specialized skills)**
- `seo` (umbrella) — invoke first for SEO planning
- `seo-plan` — editorial calendar, keyword cluster planning (already partly captured in SEO-PLAN.md)
- `seo-audit` — pre-launch + quarterly site audit
- `seo-technical` — Core Web Vitals, crawlability, sitemap, robots
- `seo-page` — on-page optimization for individual pages
- `seo-content` — content optimization for journal posts and landing pages
- `seo-schema` — TouristTrip, Event, Organization, Review, FAQPage, BreadcrumbList structured data
- `seo-sitemap` — sitemap generation and submission
- `seo-images` — image SEO (alt text, file naming, AVIF/WebP)
- `seo-competitor-pages` — competitor research and gap analysis
- `seo-geo` — geographic targeting for BVI / Bahamas / Mediterranean queries
- `seo-hreflang` — only if we expand to non-English (out of scope v1)
- `seo-programmatic` — for high-volume programmatic page generation (out of scope v1)

**GoHighLevel — Mark's full 7-skill suite**
- `ghl-api` — the core GHL API skill. Use for any custom integration in `src/lib/ghl/`.
- `ghl-funnel-deploy` — deploying any GHL funnel work (we wrap GHL Calendars API here, not embed)
- `ghl-opportunity` — pipeline opportunity management
- `ghl-invoice` — invoicing flows (relevant if Stripe deposit ever ships)
- `ghl-proposal` — proposal generation through GHL (alternative to proposal-generator-pipeline)
- `ghl-reporting` — reporting + metric pulls for performance reviews
- `ghl-snapshot-spec` — snapshotting GHL workflows before changes (mandatory per DEPLOY.md §9 backup)

**Video & motion — Mark's full stack**
- `seedance-prompt` — for generating the 4 cycling hero scenes (BVI turquoise water, Bahamas sunrise, catamaran at anchor in Greece, sunset on deck). Target: 6–10s clips, 1080p, MP4 + WebM, ≤4MB each.
- `storyboard` — shot list and continuity planning before recording or generating
- `video-brief-intake` — to spec out the "Watch a Day Aboard" 3-minute mini-doc
- `video-production-pipeline` — to orchestrate from brief → shoot/render → edit → encode
- `remotion` + `remotion-best-practices` + `remotion-composite` — for any programmatic video work (text overlays, transitions, composited scenes)

**Research orchestration**
- `notebooklm-query` / `notebooklm-research-loop` — for deep research passes (competitor analysis, niche research, content brief inputs)
- `fan-out-research` — for breadth-first competitor / market scans
- `auto-research-loop` — for ongoing research that needs to refresh

**Multi-agent / validation (the rigor pass)**
- `council` — multi-agent council review (use for proposals, key design decisions, brand-voice signoff)
- `model-debate` — when two reasonable approaches are in tension
- `stochastic-consensus` — for high-stakes decisions where you want N independent passes
- `multi-agent-code-review` — for any non-trivial PR before merge
- `security-audit` — for the GHL integration code and any auth-touching work

**Anti-pattern reminders**
- Do **not** use generic equivalents (`design-critique`, `brand-review`, `accessibility-review`, `theme-factory`, `web-artifacts-builder`, `ultimate-seo-writer`, `content-strategy`, `schema-markup`, `ai-visibility`, `email-sequence`, `campaign-plan`). Mark's skills above are equivalents (typically better) and are the ones actually installed.
- Do **not** invoke a `_disabled_*` skill. Mark has explicitly deprecated those.

**Validation pass — always run before declaring a deliverable done**
1. `ui-ux-cro-master` against its `references/pre-delivery-checklist.md` — the design-side gate
2. `multi-agent-code-review` — independent code review pass
3. `seo-page` against any new page — the SEO gate
4. For any GHL-touching work: `ghl-snapshot-spec` first (snapshot before changes), `security-audit` after

If a needed skill genuinely doesn't exist, install one globally to `~/.claude/skills/<skill-name>/SKILL.md` using the SKILL.md format demonstrated by `design-md` (see `_install-globally/` example).

## 4. GoHighLevel — two separate contexts (don't conflate them)

This project touches **two different GoHighLevel subaccounts**. Keep them mentally separate.

### 4a. Dodie's GHL subaccount — the website's lead-capture backend

- The website does **not** live in GHL. GHL is the CRM/email/SMS/calendar backend; Astro is the public-facing site.
- Lead capture and inquiries POST to **Dodie's own GHL subaccount** via the GHL REST API. She owns the GHL bill directly; Mark is not absorbing the cost or giving her one of his agency subaccounts (ADR-002).
- API credentials live in environment variables only. `GHL_PRIVATE_TOKEN` and `GHL_LOCATION_ID` in `.env.local` (never committed). See `TECH-SPEC.md` §4 for endpoints and `GHL-INTEGRATION.md` for the operational runbook.
- The booking calendar uses the GHL Calendars API behind a **custom Astro UI** — never the embedded GHL widget. The widget undoes the design system.
- The 9 workflows (W1–W9) Mark builds/maintains for Dodie all live in **her** subaccount:
  - W1 Universal new-inquiry → W2/W3/W4 region-specific nurture sequences → W5 newsletter welcome → W6 hold-expiring → W7 pre-trip prep (day-30/14/7) → W8 post-trip thank-you + review → W9 abandoned-form (deferred to v2)
- Form submissions are tagged so the right workflow fires. Tag taxonomy in `GHL-INTEGRATION.md` §"Tags taxonomy".
- Skill stack: `ghl-api` (the integration code in `src/lib/ghl/`), `ghl-funnel-deploy` if a funnel is involved, `ghl-snapshot-spec` before any workflow change, `email-marketing-master` for the workflow copy.

### 4b. Mark's IntellaGrow GHL subaccount — the proposal + invoicing engine

- Separate subaccount. This is where Mark manages his own sales pipeline.
- The **Guiding Winds proposal goes through here**, not Dodie's account. Dodie is the receiving client; she e-signs in IntellaGrow's portal; on signature it auto-converts to an invoice.
- Use the `proposal-generator-pipeline` skill — never hand-write the proposal. The skill routes to the service-entity path (GHL-native proposal + e-sign) and registers a CRM opportunity in IntellaGrow's pipeline.
- The pipeline triggers approval gates if total > $5,000 (it will), schedules +3/+7/+14 day follow-ups automatically, and updates the campaign registry at each phase.
- For ongoing reporting on the Dodie engagement (booking velocity, ROI on the website rebuild), use `ghl-reporting` against IntellaGrow's GHL — not Dodie's. Her GHL tracks her customers; Mark's tracks his clients.

### Skill ordering when Mark says "draft the Dodie proposal"

1. `proposal-generator-pipeline` (the orchestrator — invoke first)
2. The pipeline auto-calls: `service-design-intake`, `brand-intellagrow`, `copywriting`, `ghl-opportunity` (create), `ghl-proposal` (the GHL e-sign delivery), `approval-gates`, `campaign-registry`.
3. Mark does **not** manually invoke each downstream skill — the pipeline does. Mark just provides the 10 intake answers (templated in memory file `reference_proposal_generator_pipeline.md`).

## 5. Brand voice — short version (full in `DESIGN.md` and `CONTENT-MAP.md`)

Wellness + luxury + slow-living catamaran charters. Black-Tomato-adjacent positioning: cinematic, restrained, opinionated, mildly literary. Headlines lean reframe-style ("You don't need another vacation. You need a week off the grid."). Body copy is short, declarative, slightly poetic. Never use exclamation marks. Never use marketing-urgency tropes ("Time is ticking!"). Never the word "luxurious" — earn it instead. CTAs prefer "See Available Weeks" or "Hold a Cabin" over "Book Now."

The brand promise is **"unplug."** Every word, every image, every interaction either supports that promise or contradicts it.

## 6. Media direction

- **Hero**: 4 cycling video scenes, ~6–8s each, crossfading. Render in Seedance 2; encode to MP4 + WebM via Handbrake or ffmpeg; serve from project's static assets (or Cloudflare Stream for adaptive bitrate). Target 2–4 MB per scene.
- **Section videos** (e.g., Meet Clint & Dodie at the helm): same approach, can be longer (15–20s).
- **YouTube embed section** ("Watch a Day Aboard"): one ~3-minute mini-doc, hosted on Dodie's YouTube channel, embedded in a dedicated section. This is the SEO/AI-search lift; it's not the hero.
- **Photography**: ask Dodie for *any* existing photo library (iPhone shots from past trips count). Build the site to work elegantly with the photography she has *and* gracefully without — design must hold on a fresh, photo-less load.
- **Generated imagery**: when needed, use Seedance 2 or the `canvas-design` skill. Label clearly as "concept art" in proposal contexts.

## 7. Conventions

**Folder structure (Astro)**
```
src/
├── pages/
│   ├── index.astro           # home
│   ├── voyages/
│   │   ├── index.astro       # destinations hub
│   │   └── [slug].astro      # individual trip page (driven by content collection)
│   ├── about.astro
│   ├── journal/
│   │   ├── index.astro
│   │   └── [slug].astro      # blog post
│   ├── inquire.astro
│   └── api/
│       └── inquire.ts        # POST endpoint → GHL
├── content/
│   ├── voyages/              # one MD per trip
│   ├── journal/              # blog posts
│   └── config.ts             # content collection schemas
├── components/
│   ├── ui/                   # shadcn primitives we actually use
│   ├── home/                 # home-page-specific components
│   ├── voyage/
│   └── shared/
├── layouts/
└── styles/
    └── global.css            # imports the Tailwind v4 theme exported from DESIGN.md
public/
├── media/                    # MP4/WebM hero loops, image fallbacks
└── og/                       # OG share images per page
DESIGN.md
CLAUDE.md
PRD.md
TECH-SPEC.md
CONTENT-MAP.md
QA-CHECKLIST.md
```

**Code style**
- TypeScript everywhere.
- Astro components first; React islands only when client interactivity is required.
- Tailwind utility classes preferred; small custom CSS in `global.css` when patterns repeat.
- Component file names: `PascalCase.astro` / `PascalCase.tsx`.
- Content files: `kebab-case.md` (e.g., `british-virgin-islands.md`).

**Commits & branches**
- Trunk-based: small PRs to `main`.
- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Every PR must keep the design.md linter green (`npm run design:lint` in CI).

**Performance budget**
- Lighthouse Performance ≥ 95 (desktop) and ≥ 90 (mobile).
- Largest Contentful Paint ≤ 2.0s on 4G.
- Initial JS payload ≤ 50KB per route (Astro makes this easy).
- Image budget per route ≤ 1.5 MB combined (loaded over the fold).

## 8. Working order for any task

When given a task, the default order of operations is:

1. **Load context**: this `CLAUDE.md`, plus whichever of `PRD.md` / `TECH-SPEC.md` / `DESIGN.md` / `CONTENT-MAP.md` is relevant.
2. **Identify skills**: enumerate every skill in §3 that applies. Do not pick a single one.
3. **Plan**: write a brief plan (TaskCreate works well). If the work touches the design system, run `design-md` first to confirm tokens.
4. **Execute**: build, write, or refactor.
5. **Self-critique pass**: invoke `design-critique` + `brand-review` + `accessibility-review` (use a sub-agent for independence) before showing Mark.
6. **Update docs**: if conventions changed, update this file. If brand tokens changed, update `DESIGN.md` and re-export to Tailwind.

## 9. Things to never do

**Project-specific rules**
- Never propose hosting any page on GHL.
- Never use one of Mark's agency subaccounts for Dodie — she pays GHL directly.
- Never embed the GHL stock booking widget. Always wrap their API in custom UI.
- Never use the word "luxurious," "perfect," "ultimate," or "transformative" in client-facing copy. Earn the feeling with specifics.
- Never use exclamation marks in body copy. Headlines that need urgency aren't the right headlines.
- Never ship a page without a TouristTrip / Event / Organization / Review / FAQPage schema where applicable.
- Never let the design.md linter fail.
- Never invent token names without referencing them in a component. (Orphaned tokens fail the linter.)
- Never break the canonical section order in `DESIGN.md` (Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts).

**Anti-AI-slop guardrails (from `ui-ux-cro-master`)**

These are non-negotiable. Any UI work that violates these rules is rejected.

- Never use **Inter, Roboto, Arial, or system fonts as a display or heading font**. Inter is allowed ONLY as a body font. Pick a distinctive display face from the font arsenal: Clash Display, Syne, DM Serif Display, Instrument Serif, Cabinet Grotesk, Neue Montreal, Fraunces, Canela, Editorial New, Owners, Satoshi, General Sans, Mona Sans, Monument Extended, Sora, Plus Jakarta Sans, Outfit, Playfair Display, Bricolage Grotesque, Geist.
- Never use **purple-to-pink gradients on white backgrounds**. That's the canonical AI-slop signal.
- Never use the **predictable centered hero → features grid → testimonials → CTA layout**. Use bento grids, asymmetric layouts, editorial flow, or split compositions instead.
- Never use **cookie-cutter card grids with identical border-radius**. Vary card density, scale, and treatment.
- Never use **emoji as icons**. Use SVG icon libraries: Lucide, Heroicons, Simple Icons, Phosphor.
- Never use **Space Grotesk as the default** for everything.
- Never use **generic stock photography** (handshakes, smiling teams in offices, headset wearers).
- Never use **carousel sliders**. They get under 1% CTR on slides 2+.
- Never use generic **"Innovating the future of [noun]"** style headlines. Use a reframe formula or a concrete promise.
- Never use **pure #FFFFFF** as the page background. Warm off-whites (#F8F7F4, #FAFAF0, or the project's `bone` token) instead.
- Never use **pure #000000** for dark backgrounds. Use #121212 or #0A0A0A.
- Never write UI code without first reading `~/.claude/skills/ui-ux-cro-master/references/design-trends-2026.md`. That's the design context for any visual decision in 2026.
- Never declare a UI deliverable done without running its `references/pre-delivery-checklist.md`.

## 10. Where things live

- **Project root** (this folder): `CLAUDE.md`, `PRD.md`, `TECH-SPEC.md`, `DESIGN.md`, `CONTENT-MAP.md`, `QA-CHECKLIST.md`, plus the Astro project once scaffolded.
- **Shells / proposal artifacts**: `shell-home.html`, `shell-home-v2.html`, `shell-home-v3.html`, `shell-destinations.html` — pre-build visual proofs. To be deleted once the Astro project is live and approved.
- **Skill staging**: `_install-globally/` — contains the `design-md` skill ready to be moved to `C:\Users\mholl\.claude\skills\`. See `_install-globally/INSTALL.md`.
- **Global skills** (after install): `C:\Users\mholl\.claude\skills\`.
- **Environment variables**: `.env.local` (gitignored). Schema in `TECH-SPEC.md`.

---

*Last updated: 2026-05-17.*
