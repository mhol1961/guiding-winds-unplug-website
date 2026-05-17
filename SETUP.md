# SETUP — Local development

How to get the Guiding Winds Unplug site running on a fresh machine.

---

## Prerequisites

| Tool | Version | How to install |
|---|---|---|
| Node | ≥ 20 LTS | https://nodejs.org/ or `nvm install --lts` |
| npm | ≥ 10 | bundled with Node |
| Git | latest | https://git-scm.com/ |
| PowerShell / Terminal | — | built in |
| VS Code (optional) | latest | https://code.visualstudio.com/ |

Verify versions:

```bash
node --version    # v20.x or higher
npm --version     # 10.x or higher
git --version     # 2.x or higher
```

## 1. Clone the repo

```bash
git clone https://github.com/markholland/guidingwinds-unplug.git
cd guidingwinds-unplug
```

(Repo URL is a placeholder — update when the repo is created.)

## 2. Install dependencies

```bash
npm install
```

This installs Astro 5, Tailwind v4, the shadcn primitives we use, Zod, and `@google/design.md` (used for linting DESIGN.md).

## 3. Set up environment variables

Copy the example file and fill in the real values:

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in:

```
# GoHighLevel — get these from Dodie or her GHL settings
GHL_LOCATION_ID=                    # Settings → API Keys → Location ID
GHL_PRIVATE_TOKEN=                  # Settings → Private Integrations → create token
GHL_CALENDAR_ID_BVI=                # Calendars → BVI Charters → settings → Calendar ID
GHL_CALENDAR_ID_BAHAMAS=            # Calendars → Bahamas → settings → Calendar ID
GHL_CALENDAR_ID_MED=                # Calendars → Mediterranean → settings → Calendar ID

# Analytics
PLAUSIBLE_DOMAIN=guidingwinds-unplug.com

# Public
PUBLIC_SITE_URL=https://guidingwinds-unplug.com
PUBLIC_BUSINESS_NAME=Guiding Winds Unplug
PUBLIC_CONTACT_EMAIL=dodie@guidingwinds-unplug.com
```

If you're developing locally without the GHL credentials, the inquiry form will fall back to a mailto link. The site renders fine without GHL — you just can't test the form pipeline.

## 4. Generate the Tailwind theme from DESIGN.md

```bash
npm run design:export
```

This reads `DESIGN.md` and writes `src/styles/theme.css` with CSS custom properties for every token (colors, typography, spacing, rounded). Tailwind v4 picks these up automatically via the `@theme` directive.

Re-run this command any time you change tokens in `DESIGN.md`.

## 5. Start the dev server

```bash
npm run dev
```

Astro starts at http://localhost:4321/. Hot-module reloading is on by default.

## 6. Validate the design system

```bash
npm run design:lint
```

This runs the official `@google/design.md lint` against `DESIGN.md`. Zero errors expected. Warnings about contrast or orphaned tokens should usually be resolved.

## 7. Run the type checker

```bash
npm run typecheck
```

Equivalent to `astro check` — catches TypeScript errors and Astro template errors.

---

## Useful npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Astro check + TypeScript |
| `npm run design:lint` | Validate DESIGN.md |
| `npm run design:export` | Regenerate `src/styles/theme.css` from DESIGN.md |
| `npm run design:diff` | Compare current DESIGN.md to a previous version (useful in PRs) |
| `npm run test:a11y` | axe-core a11y scan against built pages (if configured) |
| `npm run test:lighthouse` | Lighthouse CI against the preview build |

---

## Troubleshooting

### "EADDRINUSE: address already in use :::4321"

Another dev server is already running, or port 4321 is taken. Either kill the other process or start Astro on a different port:

```bash
npm run dev -- --port 4322
```

### "Cannot find module '@google/design.md'"

Either `npm install` didn't complete or the package isn't yet published. The CLI alias on Windows is `designmd` (not `design.md`) — make sure your scripts use `designmd lint DESIGN.md`. See the Windows note in [`DESIGN.md`](./DESIGN.md) lint reference.

### "GHL 401" when submitting a test form

Most likely the `GHL_PRIVATE_TOKEN` is missing, expired, or scoped to the wrong location. Verify:

1. `.env.local` has `GHL_PRIVATE_TOKEN=` filled in (no quotes around the value).
2. The token in GHL settings is still active.
3. The token's allowed scopes include `contacts.write` and `calendars.write`.

### "Hero video doesn't play in Safari"

Safari requires `playsinline` on autoplay videos. Verify the `<video>` tag has `autoplay muted loop playsinline preload="metadata"`. Also confirm the MP4 has `+faststart` set (so the moov atom is at the front of the file):

```bash
ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4
```

### "Images don't load in dev"

Astro's image optimization runs at build time, not dev time for production-sized assets. In dev you see the unoptimized original. If an image 404s, check that the path is correct relative to `/public/` or `src/assets/`.

### "Tailwind classes aren't applying"

Make sure `src/styles/theme.css` is generated (run `npm run design:export`) and imported by `src/styles/global.css`. The global stylesheet must be imported in `src/layouts/BaseLayout.astro`.

### "DESIGN.md linter fails on a token I just added"

The most common failures: (1) you added a color but no component references it (`orphaned-tokens`) — either reference it in a component or remove it; (2) you used a `{path}` reference that doesn't resolve (`broken-ref`) — fix the path; (3) the section order got reordered (`section-order`) — restore canonical order: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts.

### "Cloudflare Pages preview deploy is broken but local works"

Usually an env-var mismatch. Confirm every var in `.env.example` is also set in the Cloudflare Pages dashboard under Settings → Environment Variables, for both Production and Preview environments.

---

## IDE setup (recommended — VS Code)

Install these extensions:

- **Astro** (official) — language server, syntax, formatting
- **Tailwind CSS IntelliSense** — class autocomplete from the generated theme
- **TypeScript Importer** — auto-imports
- **markdownlint** — keeps the .md files clean
- **YAML** — for the DESIGN.md frontmatter
- **EditorConfig for VS Code** — picks up `.editorconfig`

Recommended workspace settings (`.vscode/settings.json` — commit this to the repo):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "astro-build.astro-vscode",
  "[astro]": { "editor.defaultFormatter": "astro-build.astro-vscode" },
  "[typescript]": { "editor.defaultFormatter": "vscode.typescript-language-features" },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "['\"`]([^'\"`]*)['\"`]"]
  ],
  "files.associations": {
    "*.md": "markdown",
    "DESIGN.md": "markdown"
  }
}
```

---

## What to read next

- [`AGENTS.md`](./AGENTS.md) if you're an AI agent
- [`BUILD-PROMPTS.md`](./BUILD-PROMPTS.md) if you're starting a fresh build phase
- [`GHL-INTEGRATION.md`](./GHL-INTEGRATION.md) if you're touching the form / calendar code
- [`DEPLOY.md`](./DEPLOY.md) when you're ready to ship
