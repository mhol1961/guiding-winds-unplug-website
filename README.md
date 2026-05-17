# Guiding Winds Unplug — website

The marketing site and lead-capture frontend for **Guiding Winds Unplug**, an all-inclusive wellness catamaran charter business operating in the British Virgin Islands, the Bahamas, and the Mediterranean.

Built on **Astro 5 + Tailwind v4 + shadcn/ui**. Hosted on **Cloudflare Pages**. Lead capture and bookings pipe into the owner's **GoHighLevel** subaccount via the GHL v2 API.

---

## Documentation

| Doc | What it covers |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Instructions for any AI coding agent (Claude Code, Cursor, etc.) working on this repo. **Read first if you are an agent.** |
| [`CLAUDE.md`](./CLAUDE.md) | Project-specific Claude Code conventions: stack, skills to invoke, hard rules. |
| [`PRD.md`](./PRD.md) | Product requirements: business goals, audience, scope, success metrics. |
| [`TECH-SPEC.md`](./TECH-SPEC.md) | Architecture, folder structure, GHL integration code, schema markup, deployment. |
| [`DESIGN.md`](./DESIGN.md) | Google-spec design system. Frontmatter tokens + canonical sections. |
| [`CONTENT-MAP.md`](./CONTENT-MAP.md) | Page-by-page content plan with target keywords and CTAs. |
| [`BUILD-PROMPTS.md`](./BUILD-PROMPTS.md) | Phased Claude Code build prompts. Run in order. |
| [`SETUP.md`](./SETUP.md) | Local development setup. |
| [`DEPLOY.md`](./DEPLOY.md) | Deployment runbook for Cloudflare Pages + DNS. |
| [`GHL-INTEGRATION.md`](./GHL-INTEGRATION.md) | Operational runbook for GHL workflows, tags, calendars. |
| [`SEO-PLAN.md`](./SEO-PLAN.md) | Keyword clusters, editorial calendar, AI-search citation plan. |
| [`QA-CHECKLIST.md`](./QA-CHECKLIST.md) | 15-section pre-launch quality gate. |
| [`DECISIONS.md`](./DECISIONS.md) | Architectural decision log (ADR-style). |

## Quick start

```bash
npm install
cp .env.example .env.local       # fill in GHL credentials — ask Mark or Dodie
npm run dev                      # http://localhost:4321
```

Full local setup, troubleshooting, and prerequisites in [`SETUP.md`](./SETUP.md).

## Common commands

```bash
npm run dev               # local dev
npm run build             # production build
npm run preview           # preview the production build locally
npm run typecheck         # astro check (TypeScript + Astro)
npm run design:lint       # validate DESIGN.md against the Google spec
npm run design:export     # regenerate src/styles/theme.css from DESIGN.md
```

## Project structure

See [`TECH-SPEC.md`](./TECH-SPEC.md) §2 for the full folder layout. Short version:

```
src/
├── pages/        # routes (Astro pages and API endpoints)
├── content/      # voyages, journal posts, reviews (content collections)
├── components/   # ui (primitives), home, voyage, journal, shared
├── layouts/      # BaseLayout, PostLayout
├── lib/          # ghl (API wrapper), schema (JSON-LD), utils
└── styles/       # theme.css (generated from DESIGN.md) + global.css
public/
├── media/        # hero MP4/WebM, fallback images
└── og/           # OG images
DESIGN.md         # canonical design tokens (Google DESIGN.md spec)
```

## Tech stack

- **Astro 5.x** — static-first with islands for interactive bits
- **Tailwind v4** (CSS-first config)
- **shadcn/ui** — only the primitives we actually use
- **TypeScript** everywhere, strict mode
- **Zod** for form schemas
- **Cloudflare Pages** for hosting + edge caching
- **Plausible** for privacy-first analytics
- **GoHighLevel** (Dodie's subaccount) for CRM, email/SMS, and calendar

## Contributing

Trunk-based: small PRs to `main`. Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).

Every PR must:
- Pass `npm run typecheck`
- Pass `npm run design:lint`
- Pass Lighthouse CI (≥ 90 mobile, ≥ 95 desktop on changed routes)
- Pass axe-core a11y scan (no serious/critical violations)

## Owners

- **Operator:** Dodie & Clint Kendall (Guiding Winds Unplug)
- **Build & ongoing:** Mark Holland

## License

This project is private to Guiding Winds Unplug. The brand, copy, and original imagery are not licensed for reuse. Code patterns and the DESIGN.md format are derivative of open-source work and reusable under the same licenses.
