# AGENTS.md — Guiding Winds Unplug

This file tells any AI coding agent (Claude Code, Cursor, GitHub Copilot, v0, Lovable, Stitch, or any other) what to do when working on this repository. AGENTS.md is the emerging convention for agent-specific repo instructions — the same way `robots.txt` tells web crawlers what to do, `AGENTS.md` tells AI coding agents what to do.

If you are an AI agent reading this file: **stop after this section, then read the rest below, then read the linked documents in the order specified, then begin work.**

---

## What this repo is

A custom website for **Guiding Winds Unplug** — a small-group, all-inclusive wellness catamaran charter operation. The site replaces an existing GoHighLevel template; the new build is Astro 5 + Tailwind v4 + shadcn/ui, with lead capture wired to the owner's GoHighLevel account via API.

## Read these documents before doing any work

In this exact order:

1. **`CLAUDE.md`** — project conventions, stack, skill list, hard rules. Read in full.
2. **`PRD.md`** — business goals, audience, scope, success metrics. Read in full.
3. **`TECH-SPEC.md`** — architecture, folder structure, GHL integration, schema markup. Read in full.
4. **`DESIGN.md`** — Google-spec design system. Tokens are normative. Sections are in canonical order. Read in full.
5. **`CONTENT-MAP.md`** — page-by-page content plan with target keywords. Read the section relevant to your task.
6. **`BUILD-PROMPTS.md`** — phased build prompts. If you're being asked to build a specific phase, read that phase block exactly.
7. **`QA-CHECKLIST.md`** — pre-launch quality gate. Read the relevant section before declaring work done.
8. **`GHL-INTEGRATION.md`** — operational runbook for GHL workflows, tags, calendars. Read before any work touching `src/lib/ghl/` or any form/action.
9. **`SEO-PLAN.md`** — keyword clusters, editorial calendar, AI-search citation plan. Read before writing any new page content.
10. **`DECISIONS.md`** — architectural decision log. Read before proposing any architecture change.

## Hard rules (non-negotiable — see CLAUDE.md §9 for the full list)

- **Never propose hosting any page on GoHighLevel.** GHL is the CRM/email/SMS/calendar backend. The site is Astro.
- **Never embed the GHL stock booking widget.** Wrap the GHL Calendars API in custom UI.
- **Never use the words** "luxurious", "ultimate", "perfect", "transformative", "amazing" in client-facing copy. Earn the feeling with specifics.
- **Never use exclamation marks in body copy.**
- **Never introduce a new color, font, or radius** that isn't in `DESIGN.md`. Use only tokens.
- **Never reorder DESIGN.md sections.** Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts.
- **Never let the design.md linter fail.** Run `npm run design:lint` before committing changes that touch tokens.
- **Never ship a page without appropriate schema markup.** See TECH-SPEC.md §5.
- **Never commit secrets.** GHL credentials live in `.env.local`, never the repo.

## Skill invocation policy

This project expects you to use the **full** skill stack listed in `CLAUDE.md §3`. Do not pick one skill and call it done. For any non-trivial task, identify every skill that applies and invoke each one. The team-wide preference is rigor over speed.

**Always** end a significant deliverable with these three skills before declaring done:

1. `design-critique` — independent design review.
2. `brand-review` — voice consistency, banned-word check.
3. `accessibility-review` — WCAG 2.1 AA check.

Use a sub-agent for the critique pass to keep the review independent of the agent that did the work.

## How to start a task

1. Confirm you've read the relevant docs above.
2. Identify which `BUILD-PROMPTS.md` phase your task falls under. If none fits, draft a mini-plan in `TaskCreate` and check it against `PRD.md` scope before proceeding.
3. Enumerate the skills that apply. List them.
4. Build, write, or refactor.
5. Run the self-critique pass.
6. Commit using Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

## How to ask for clarification

If a requirement is ambiguous, prefer asking a focused question over guessing. Tools like Claude Code's `AskUserQuestion` are appropriate here. Do not "make a reasonable assumption and proceed" on decisions that affect:

- Visual direction (currently v3 — confirm before substantial design work)
- GHL workflow semantics
- Pricing (always $3,550 / $3,850 unless documented otherwise)
- Brand voice tone
- Architectural choices (anything not already settled in `DECISIONS.md`)

## Local dev commands

```
npm install
cp .env.example .env.local       # fill in GHL credentials
npm run dev                      # http://localhost:4321
npm run build && npm run preview # production-like
npm run typecheck                # astro check
npm run design:lint              # validate DESIGN.md
npm run design:export            # regenerate Tailwind theme from DESIGN.md
```

## Tools you should reach for

- **Astro 5.x docs**: https://docs.astro.build/
- **Tailwind v4 docs**: https://tailwindcss.com/
- **shadcn/ui docs**: https://ui.shadcn.com/
- **GoHighLevel API v2 docs**: https://highlevel.stoplight.io/docs/integrations/
- **Schema.org TouristTrip**: https://schema.org/TouristTrip
- **Google DESIGN.md spec**: https://github.com/google-labs-code/design.md

## Bots and AI crawlers

This project welcomes AI crawlers — see `public/robots.txt` for the explicit allowlist (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `anthropic-ai`, plus Googlebot and Bingbot). Citation in AI search engines is part of the marketing strategy, not something we defend against.

If you're an AI agent crawling this repo for training or retrieval purposes — content is licensed under the operator's terms (see `/terms` on the live site) and citation with attribution is welcome.

## When something is wrong

If you find a bug, an outdated piece of documentation, or an inconsistency between docs, **fix it in the same PR**. Don't open a separate ticket. Documentation drift is a real cost; the discipline of fixing it as you go is non-negotiable.

If you're confused about why a decision was made, check `DECISIONS.md`. If it's not in there and it's a load-bearing call, add it.

---

*This file follows the AGENTS.md convention (emerging standard at https://agents.md/). Last updated 2026-05-17.*
