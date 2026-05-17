# DECISIONS — Architectural decision log

A running log of architectural and product decisions made on this project, in ADR (Architecture Decision Record) style. Add an entry every time a load-bearing call gets made. Never delete entries — supersede them with new ones.

**Format:** numbered, dated, with context, decision, and consequences. Status is one of `accepted` | `superseded by ADR-NNN` | `deprecated` | `proposed`.

---

## ADR-001 — Use Astro over Next.js for the marketing site

**Date:** 2026-05-17
**Status:** accepted

**Context:**
The site is content-heavy, low-interactivity, SEO-critical, image-heavy, and has no current app surface (no user accounts, no real-time data, no complex client-side state). Mark's default stack is Astro or Next.js + Tailwind + shadcn/ui.

**Decision:**
Astro 5.x. Next.js is reserved for projects with a real app surface — customer portals, real-time availability with state, deposit checkout flows with retries and webhooks, guest-uploaded media galleries.

**Consequences:**
- Near-zero JavaScript by default — Lighthouse and Core Web Vitals targets are reachable without extra effort.
- Content collections handle voyages, journal posts, and reviews cleanly.
- React islands available for the few interactive pieces (booking form modal, picker tabs).
- If/when an app surface is needed (guest portal, deposit checkout), spin up a Next.js subdomain (`app.guidingwinds-unplug.com`) that talks to the same GHL backend. Don't migrate the marketing site.

---

## ADR-002 — Dodie owns her own GoHighLevel subaccount; Mark doesn't allocate one of his

**Date:** 2026-05-17
**Status:** accepted

**Context:**
Mark runs a GHL Agency Starter plan ($97/mo, 3 subaccounts) with 2 slots remaining. Dodie has two sites in scope (this one + dodiekendall.com). Mark considered giving her one of his subaccounts and rebilling. The alternatives were: Dodie pays GHL directly on her own Starter plan, or Mark upgrades to GHL Pro ($497/mo) for SaaS Mode reselling.

**Decision:**
Dodie pays GHL directly ($97/mo Starter). The website POSTs leads to her account via the GHL v2 API. Mark builds and maintains the GHL workflows as part of the engagement but does not absorb the GHL bill.

**Consequences:**
- No data-portability risk. If the engagement ends, Dodie keeps her CRM with no migration friction.
- Mark's subaccount slots remain available for clients where he's running a true managed-marketing engagement at a margin.
- Mark stays on Agency Starter ($97/mo) instead of being pushed to Agency Unlimited ($297/mo) prematurely.
- Dodie sees one GHL bill (predictable) instead of an opaque "marketing services" line on Mark's invoice.
- Trade-off: Dodie has to manage her own GHL billing and login. Mitigation: Mark has admin access to maintain workflows.

---

## ADR-003 — Wrap the GHL Calendars API in custom UI; don't embed the GHL booking widget

**Date:** 2026-05-17
**Status:** accepted

**Context:**
GHL provides an embeddable booking widget that drops directly into a page. It works, but it's recognizably GHL — different typography, different button styles, different microcopy, no design-token integration. On a premium brand site this would undo every design choice.

**Decision:**
Use the GHL Calendars REST API behind a fully custom Astro UI. Fetch availability with `GET /calendars/{id}/free-slots`. Create 72-hour soft holds with `POST /calendars/events/appointments`. The booking flow renders entirely from our design system tokens.

**Consequences:**
- More implementation work — the booking flow has to handle loading states, errors, and edge cases that the GHL widget handles for us.
- The booking UI matches the brand. Critical for a premium product.
- API rate limits are a real concern at high traffic. Mitigation: cache availability at the Cloudflare edge for 15 minutes per region. Sub-1000 monthly bookings makes this comfortable.
- If GHL deprecates the v2 Calendars API in the future, we have implementation risk. Mitigation: the API is versioned via the `Version` header; we pin to a known-good version and audit annually.

---

## ADR-004 — Plausible over Google Analytics 4 for analytics

**Date:** 2026-05-17
**Status:** accepted

**Context:**
Need analytics for traffic, top pages, conversion to inquiry/booking. Options: GA4 (free, broad feature set, complex, requires cookie consent banner in many jurisdictions), Plausible (paid $9/mo cloud or self-hostable, simpler dashboard, privacy-first, no consent banner needed), PostHog (free product analytics, broader feature set but overkill for a marketing site).

**Decision:**
Plausible Cloud at $9/mo. Single script, no cookie banner, ≤1KB payload.

**Consequences:**
- Lower performance overhead than GA4.
- No GDPR/CCPA consent banner needed — Plausible doesn't use cookies or store PII.
- Smaller feature set than GA4. Acceptable for a marketing site at this stage; revisit if Dodie ever wants behavioral cohorts.
- Conversion goals tracked: inquiry submitted, cabin hold created, newsletter signup.
- Re-evaluate if traffic exceeds 100K monthly pageviews (Plausible pricing tiers up).

---

## ADR-005 — Visual direction is "v3 cinematic" (Black Tomato-adjacent) pending Mark + Dodie sign-off

**Date:** 2026-05-17
**Status:** proposed (pending sign-off)

**Context:**
Three visual directions were explored in the proposal shells:
- v1: Editorial sea + bone + brass (initial Claude default, rejected — too generic, blended into category)
- v2: Editorial magazine — ivory + ink + terracotta, serif-led, illustration-led (interesting but quiet)
- v3: Cinematic dark — near-black + bone + coral, sans-led, video-led, modeled on Black Tomato's homepage rhythm

Mark referenced Black Tomato as the direction he liked. Dodie sign-off pending.

**Decision:**
v3 is the working direction. DESIGN.md codifies the full token system for this direction. If the final sign-off comes back rejecting v3, the DESIGN.md is rewritten — structure stays identical, tokens and prose change.

**Consequences:**
- Build can proceed against DESIGN.md tokens as if approved. The visual identity is encoded in the file, not in components — replacing the direction is a token-level edit, not a code rewrite.
- The proposal shells (v1, v2, v3) remain in the workspace until Dodie signs off on a final direction; then the rejected shells get deleted.

---

## ADR-006 — DESIGN.md format adopted as the canonical design-system source of truth

**Date:** 2026-05-17
**Status:** accepted

**Context:**
Need a way to communicate the design system to (a) future AI coding agents working on the project, (b) any human developer joining later, (c) the Tailwind theme generator. Options: Storybook (heavy, separate UI), Figma tokens (separate tool, no AI-agent integration), CSS variables in code only (not human-readable), the new Google DESIGN.md format.

**Decision:**
DESIGN.md per the Google open-source spec (https://github.com/google-labs-code/design.md). Tokens in YAML frontmatter, rationale in markdown prose, canonical section order, validated by `@google/design.md lint`, exported to Tailwind via `@google/design.md export --format css-tailwind`.

**Consequences:**
- Single source of truth that AI agents read directly without prompt engineering.
- Lint and diff CLI tools give us a contract for changes.
- Tailwind theme is generated, not hand-maintained. Eliminates drift between intent and implementation.
- Adoption cost: contributors have to learn the format. Mitigated by `_install-globally/design-md/` skill installed in Mark's global Claude Code skills folder, which can scaffold a new DESIGN.md or update an existing one.

---

## ADR-007 — Cloudflare Pages over Vercel for hosting

**Date:** 2026-05-17
**Status:** accepted

**Context:**
Astro deploys cleanly to both Cloudflare Pages and Vercel. Cloudflare DNS is already used for other Mark projects. Vercel has tighter integration with Next.js (which we're not using).

**Decision:**
Cloudflare Pages. DNS, hosting, edge caching, and SSL all in one dashboard.

**Consequences:**
- Free tier is generous (unlimited bandwidth, 500 builds/mo, 100 custom domains).
- Edge functions for the Astro Action endpoints run on Cloudflare Workers — fast globally.
- If we ever need ISR (incremental static regeneration) for `/calendar` with smarter caching, Cloudflare's edge caching plus a 15-min revalidate is good enough; if not, switch to Vercel.
- One vendor for DNS + hosting + analytics (Cloudflare also has its own analytics).

---

## ADR-008 — System font stack instead of web fonts

**Date:** 2026-05-17
**Status:** superseded by ADR-013

**Context:**
DESIGN.md specifies an editorial sans for display (Helvetica-style) and a serif for italic emphasis. Options: load a web font (Inter from Google Fonts, Söhne from Klim, etc.), or use a system font stack (varies per platform but feels native).

**Decision:**
System font stack for both sans (`-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif`) and serif (`"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`).

**Consequences:**
- Zero font loading. No FOIT, no FOUT, no layout shift. Performance budget is preserved.
- Each OS renders slightly differently (Mac shows San Francisco, Windows shows Segoe UI, Linux shows whatever sans is preferred). Acceptable — the brand still reads as cohesive.
- If we ever want a distinctive custom font for the display (Söhne, Canela, GT Sectra), the cost is a font license + ~30 KB on the page. Revisit if the brand grows enough to justify it.
- Trade-off: we lose the visual signature of a recognizable typeface (e.g., Black Tomato's specific display font is part of their identity). For now, the design carries on layout, palette, and motion.

**Superseded reason:** see ADR-013. Mark's `ui-ux-cro-master` skill explicitly bans system fonts (and Inter) as display/heading fonts, treating that pattern as AI-slop. The "distinctive font" mandate trumps the performance/zero-FOUT argument.

---

## ADR-013 — Fraunces + Inter web fonts (Google Fonts) per ui-ux-cro-master arsenal

**Date:** 2026-05-17
**Status:** accepted; supersedes ADR-008

**Context:**
After auditing Mark's `~/.claude/skills/ui-ux-cro-master/SKILL.md`, the skill explicitly forbids Inter, Roboto, Arial, and system fonts as display or heading fonts — treating that as the canonical AI-slop signal — and mandates picking distinctive typography from an approved arsenal of ~20 fonts. ADR-008's "system stack everywhere" decision violates this guardrail.

**Decision:**
Switch DESIGN.md typography to **Fraunces** (display, h1–h3, serif-quote — variable-axis serif from the arsenal, free on Google Fonts) + **Inter** (body-lg, body-md, body-sm, label-caps — only role Inter is allowed in per the rule). The pairing fits the "serif display + sans body" rule and rotates away from the generic system stack.

**Consequences:**
- Adds ~50–80 KB on initial load (Fraunces variable + Inter variable, Latin-only subset). Mitigated by `<link rel="preconnect">` to `fonts.googleapis.com` + `<link rel="preload">` for the two critical weights (Fraunces 300 + Inter 400). Net Lighthouse impact: expected −2 to −4 points on first-contentful-paint, recoverable with preload.
- Fraunces's optical-sizing axis (opsz 9–144), SOFT axis, and WONK axis give the hero headline real character without needing a paid font.
- Variable fonts mean one file per family — no separate downloads for italic/weight variants.
- The brand now has a recognizable visual signature instead of relying on layout alone. Black-Tomato-adjacent positioning is reinforced.
- `font-display: swap` is mandatory to avoid FOIT.
- If a future Mark project needs the same brand direction, pick a different display from the arsenal (Cabinet Grotesk, Neue Montreal, Bricolage Grotesque, etc.) per the "never repeat the pairing on consecutive projects" rule.

---

## ADR-009 — No Stripe deposit checkout in v1; soft 72-hour holds only

**Date:** 2026-05-17
**Status:** accepted

**Context:**
Two booking models considered: (a) inquiry-driven with manual deposit (Dodie sends Stripe invoice or wire instructions after the call), (b) automated deposit via Stripe Checkout at the moment of booking.

**Decision:**
Inquiry + 72-hour soft hold for v1. No payment collected on the website. Deposit handled manually after Dodie's reply call.

**Consequences:**
- Lower implementation cost. No Stripe webhooks, no payment failure handling, no PCI considerations.
- Friction is higher for the guest — they have to wait for a call. Mitigation: 24-hour response SLA promised in the UI.
- Conversion data after launch will tell us whether to add Stripe in v2. If most guests convert on the first call anyway, the inquiry model is fine. If we lose serious-buyer momentum waiting for the call, add Stripe.
- Cabins held via 72-hour soft hold via the GHL Calendars API — capacity is reserved, but no payment locks it.

---

## ADR-010 — robots.txt explicitly allows AI search bots

**Date:** 2026-05-17
**Status:** accepted

**Context:**
Some publishers (the New York Times, large e-commerce brands) are now blocking AI bots in robots.txt to protect content from being used in LLM training without compensation. For Guiding Winds, the marketing math is the opposite — being cited by ChatGPT, Claude, Perplexity, and Google AI Overviews drives qualified leads.

**Decision:**
Explicitly allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `anthropic-ai`, plus Googlebot and Bingbot. Disallow only `/api/`. Encourage citation, not protect from it.

**Consequences:**
- AI engines can index and cite the site freely. We get the citation lift.
- Content is exposed for LLM training. For a marketing site this is neutral-to-positive.
- If brand exposure ever becomes a concern (e.g., copy starts getting plagiarized in competitor content), revisit.

---

## ADR-011 — Photography strategy: AI/stock acceptable for v1, real photography pursued aggressively

**Date:** 2026-05-17
**Status:** accepted

**Context:**
The single highest-impact asset for a premium charter brand is professional photography of the boat, the food, the cabins, the captains, the destinations. Dodie does not currently have a professional photo library. Without real photos, the shells default to gradient fallbacks and SVG illustrations or AI-generated/stock imagery.

**Decision:**
Launch with AI-generated and licensed stock imagery clearly disclosed where used. In parallel, push for a half-day professional photo shoot before the 2027 sailing season. iPhone photography from past trips integrated where available.

**Consequences:**
- v1 launch is not blocked on photography.
- Site is designed to hold without real photos and get richer with them — adding photos is a swap, not a redesign.
- Photography budget is a separately scoped line item ($500–$2,000 depending on photographer and travel cost).
- AI-generated imagery is disclosed in the alt text and footnotes where used, never presented as authentic photography.

---

## ADR-012 — Documentation set: 14 files at launch

**Date:** 2026-05-17
**Status:** accepted

**Context:**
A full project-kickoff document set varies in size. Minimal kickoffs ship 4–5 files; comprehensive ones ship 12+. Mark's preference is rigor over speed.

**Decision:**
Ship all 14 of: README.md, AGENTS.md, CLAUDE.md, PRD.md, TECH-SPEC.md, DESIGN.md, CONTENT-MAP.md, BUILD-PROMPTS.md, SETUP.md, DEPLOY.md, GHL-INTEGRATION.md, SEO-PLAN.md, QA-CHECKLIST.md, DECISIONS.md (this file). Plus `.env.example`.

**Consequences:**
- The set is the source of truth — no question about "where do I look for X."
- Documentation drift is a real cost. Mitigation: docs are versioned in git, every PR updates affected docs, and quarterly docs review is on the maintenance schedule.
- New contributors (or future AI agents) can ramp from zero context to productive in one read-through of `AGENTS.md` + the linked docs.

---

## ADR-014 — Dodie's proposal goes through proposal-generator-pipeline from IntellaGrow, NOT hand-written

**Date:** 2026-05-17
**Status:** accepted

**Context:**
The original plan was for me (Mark) to hand-write a client-facing proposal doc using the `docx` skill or similar, with three pricing tiers and a manual SOW. After auditing my actual skill library, I confirmed I already have a `proposal-generator-pipeline` skill that orchestrates the whole flow — intake → entity brand load → compliance → copywriting → price lock → GHL-opportunity creation → GHL-native proposal with e-signature → approval gate → delivery → +3/+7/+14 follow-up scheduling — and registers a CRM opportunity in the IntellaGrow GHL subaccount.

**Decision:**
Use `proposal-generator-pipeline` for the Dodie proposal. Invoke it with these intake answers (templated in memory file `reference_proposal_generator_pipeline.md`):
- Entity: **IntellaGrow** (service entity → GHL-native path)
- Tiered structure expressed as base scope + add-on checkboxes (per intake question 9):
  - Base: Astro rebuild of guidingwinds-unplug.com
  - Add-on: companion dodiekendall.com build (bundled discount)
  - Add-on: GHL workflow setup (W1–W9)
  - Add-on: AI imagery + Seedance hero scenes
  - Add-on: "Watch a Day Aboard" mini-doc via Remotion
  - Add-on: monthly maintenance retainer

**Consequences:**
- The proposal is e-signable in Dodie's email, auto-converts to invoice on signature, lands as a tracked opportunity in IntellaGrow's CRM with auto-scheduled +3/+7/+14 day follow-up nudges. None of this would happen with a hand-written PDF.
- Approval gate trips automatically at >$5K (all tiered structures here exceed that). I am my own approver — the gate exists for audit and intentionality.
- The proposal lives in **IntellaGrow's GHL subaccount**, not Dodie's. Dodie's GHL is the website's lead-capture backend (ADR-002). The two GHL contexts don't intersect.
- If Dodie accepts only the base tier or rejects an add-on, the pipeline records that and the invoice converts only the accepted items.
- Documenting the tier structure as line items + add-on upsells (per intake Q4 and Q9) instead of three separate proposals lets Dodie self-select what she can afford without me anchoring a number.

---

## ADR-015 — Local DESIGN.md → Tailwind v4 exporter (`scripts/design-export.mjs`)

**Date:** 2026-05-17
**Status:** accepted

**Context:**
TECH-SPEC.md §10 and the original BUILD-PROMPTS.md Phase 1 specified using `@google/design.md export --format css-tailwind` to generate the Tailwind theme from `DESIGN.md`. At Phase 1 scaffold time the installed package is `@google/design.md` v0.1.1, which only supports two export formats: `tailwind` (Tailwind v3-style JSON resembling `tailwind.config.js`) and `dtcg`. Neither matches the Tailwind v4 CSS-first `@theme` block that CLAUDE.md §2 mandates.

**Decision:**
Maintain a small local exporter at `scripts/design-export.mjs` that reads `DESIGN.md`'s YAML frontmatter and emits `src/styles/theme.css` as a Tailwind v4 `@theme` block (with `--color-*`, `--spacing-*`, `--radius-*`, `--font-*`, `--text-*`, `--leading-*`, `--tracking-*`, `--font-weight-*` custom properties). `design.md lint DESIGN.md` is still the contract for token-graph correctness — kept as `npm run design:lint`. The exporter is what becomes `npm run design:export`.

**Consequences:**
- Tailwind v4 stays the single styling layer, no v3 fallback, no parallel config file.
- Token names follow Tailwind v4 conventions (`--color-accent`, not the v3 `theme.extend.colors.accent`), so utility classes like `bg-accent`, `text-ink-soft`, `font-fraunces` work natively.
- One dev dep added: `js-yaml`. The exporter is ~70 lines of plain Node + ESM, no build step.
- If/when `@google/design.md` ships native Tailwind v4 output, retire the local script and switch back to the upstream CLI. Track via the package's GitHub issues.
- Drift risk: the exporter logic and the canonical DESIGN.md spec need to stay in sync. Mitigation: keep the exporter dumb (reads frontmatter as-is), and let `design:lint` catch any structural changes to DESIGN.md that the exporter doesn't yet handle (e.g., a new top-level token category).

---

## ADR template — copy this for new entries

```
## ADR-NNN — One-line title

**Date:** YYYY-MM-DD
**Status:** proposed | accepted | superseded by ADR-MMM | deprecated

**Context:**
What's the situation that requires a decision? What constraints exist? What alternatives were considered?

**Decision:**
What was chosen? Be specific.

**Consequences:**
What changes as a result? What new risks or trade-offs exist? What follow-up work is implied?
```
