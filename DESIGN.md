---
version: alpha
name: Guiding Winds Unplug
description: Cinematic editorial design for an off-grid catamaran company. The camera is always running.

# ── Colors ──────────────────────────────────────────────────────────
colors:
  primary:       "#0A0A0A"   # near-black — site canvas, dominant
  ink:           "#EFE9DC"   # warm bone — all text on primary
  ink-soft:      "#9C988E"   # bone at fade — secondary text
  ink-mute:      "#6E6A62"   # tertiary text, metadata
  accent:        "#E13F2A"   # coral — interaction only, never decoration
  accent-hot:    "#C92E1C"   # coral pressed/hover-deep
  surface:       "#161412"   # elevated cards/inset blocks on primary
  surface-warm:  "#1F1B17"   # alternate surface for variety
  bone:          "#EFE9DC"   # alias of ink for non-text usage (matches Black Tomato cream-on-coral CTA pattern)
  bone-deep:     "#D9D1BD"   # darker bone for borders on light moments
  hairline:      "#2A2622"   # near-invisible divider on primary
  teal-shadow:   "#0E3F47"   # used only as a gradient base for hero fallbacks — never UI

# ── Typography ──────────────────────────────────────────────────────
# Display + headings: Fraunces (Google Fonts, free). Variable-axis serif with
#   character, opsz axis, distinct italics. Per ui-ux-cro-master font arsenal.
# Body + UI: Inter (Google Fonts, free). The ONLY role Inter is allowed in —
#   ui-ux-cro-master bans Inter as a display or heading font.
# Load via @import or <link rel="preload" as="font"> in the BaseLayout.
typography:
  display:
    fontFamily: Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
    fontSize: 7rem
    fontWeight: 300
    lineHeight: 0.92
    letterSpacing: -0.035em
    fontVariation: '"opsz" 144, "SOFT" 30, "WONK" 0'
  display-italic:
    fontFamily: Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
    fontSize: 7rem
    fontWeight: 400
    fontFeature: "ital"
    lineHeight: 0.94
    letterSpacing: -0.02em
    fontVariation: '"opsz" 144, "SOFT" 50, "WONK" 1'
  h1:
    fontFamily: Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
    fontSize: 3.5rem
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: -0.025em
    fontVariation: '"opsz" 96'
  h2:
    fontFamily: Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
    fontSize: 2.5rem
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.02em
    fontVariation: '"opsz" 72'
  h3:
    fontFamily: Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
    fontSize: 1.75rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.015em
    fontVariation: '"opsz" 36'
  body-lg:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  body-md:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  body-sm:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  label-caps:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
    fontSize: 0.6875rem
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.28em
  serif-quote:
    fontFamily: Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
    fontSize: 1.5rem
    fontWeight: 400
    fontFeature: "ital"
    lineHeight: 1.3
    letterSpacing: -0.015em
    fontVariation: '"opsz" 24, "SOFT" 50, "WONK" 1'

# ── Spacing ─────────────────────────────────────────────────────────
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  "2xl": 96px
  "3xl": 144px

# ── Rounded ─────────────────────────────────────────────────────────
rounded:
  none: 0px
  sm: 2px       # only on inputs, never on buttons
  pill: 999px   # only on circular badges/avatars

# ── Components ──────────────────────────────────────────────────────
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 18px
  button-primary-hover:
    backgroundColor: "{colors.accent-hot}"
  button-ghost:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 18px
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary}"
  button-on-bone:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 18px
  button-on-bone-hover:
    backgroundColor: "{colors.accent}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 28px
  card-bone:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 28px
  pickcard:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 24px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px
  badge:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 6px
  hero-overlay-text:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
---

## Overview

Cinematic, restrained, slightly literary. Guiding Winds Unplug is an off-grid catamaran company; the website is a feeling, not a brochure. The reference vocabulary is **Black Tomato**, **Inspirato**, **Apple keynote landing pages**, and the title sequences of mid-budget travel documentaries cleaned up for the web.

Three principles govern every visual decision.

**The camera is always running.** Hero sections are video reels, not still images. Even secondary sections lean on motion (slow Ken Burns, crossfade, parallax) over chrome.

**One color does the work.** Coral `#E13F2A` is the entire interaction system — buttons, focus rings, the single bright moment in a page. Yacht-club navy, brass, and "luxury gold" are forbidden. The brand sits closer to the wellness lane than the yacht-charter lane.

**Type carries the design.** Massive ultra-light sans for display, italic serif used sparingly for emphasis. Wide-tracked label-caps for kickers and editorial metadata. Body copy is tight but legible. Type is never decorative — every word earns its weight.

## Colors

Near-black dominates. Warm bone is the text. One bright coral does all the heavy lifting for interaction and emphasis. There are no grays in this system — what reads as "gray" is bone at reduced opacity.

- **Primary (`{colors.primary}` `#0A0A0A`):** Background of every dark page section. The default canvas.
- **Ink (`{colors.ink}` `#EFE9DC`):** All text on primary. Warm, never pure white.
- **Ink-soft (`{colors.ink-soft}` `#9C988E`):** Secondary text — captions, metadata, helper copy. Used at ~70% opacity from ink before resorting to this token.
- **Accent (`{colors.accent}` `#E13F2A`):** Interaction only. Buttons, focus rings, the rare emphatic detail. **Never a background.** **Never decoration.** One per visible section, maximum.
- **Accent-hot (`{colors.accent-hot}` `#C92E1C`):** Pressed/active state of accent. Not for emphasis.
- **Surface (`{colors.surface}` `#161412`):** Elevated blocks on primary — cards, inset panels, inputs. Subtle separation, not visual weight.
- **Bone (`{colors.bone}` `#EFE9DC`):** When a section needs to be light (the "feeling" moment, certain testimonials, the final coral CTA's underlying canvas). Same hex as ink — used as background here.
- **Hairline (`{colors.hairline}` `#2A2622`):** Section dividers on primary. Almost invisible. Use when imagery isn't already doing the job.

## Typography

Pairing: **Fraunces** (variable serif, Google Fonts) for everything display and headings, **Inter** (Google Fonts) for body and UI. This pairing fits the `ui-ux-cro-master` rule for premium frontends: serif display + sans body, with each face doing one job and never overlapping. Fraunces was chosen for its optical-sizing axis (opsz 9–144), distinctive italics with the WONK axis, and SOFT axis for slightly humane edges — it makes the brand feel literary without being precious. Inter handles every UI surface where Fraunces would be too loud.

Load via Google Fonts `<link rel="preconnect">` + `<link rel="preload" as="font">` for the two critical weights (Fraunces 300 + Inter 400). Subset to Latin only.

- Use `{typography.display}` exactly **once per page**. Hero only. Never twice.
- Use `{typography.display-italic}` only as inline emphasis inside a `{typography.display}` headline (e.g., "You need a week off **the grid**"). Italic word inherits the display size and switches to the italic variant via `font-feature-settings: "ital"` plus the WONK axis for slightly off-kilter character.
- `{typography.h1}` and `{typography.h2}` open sections. One h1 per page.
- `{typography.label-caps}` is the editorial-credit voice. Eyebrows, kickers, button text, plate numbers ("PLATE II"). Always wide-tracked (0.28em), always all-caps in render, always semibold. **Note:** label-caps uses Inter (allowed because it's a body/UI role, not display).
- Body copy uses `{typography.body-md}` as default. Long-form essay sections (about page, journal posts) use `{typography.body-lg}`.
- `{typography.serif-quote}` is reserved for pull-quotes and testimonials. Italic Fraunces by default.
- Line length never exceeds 72 characters for body copy.
- Numbers in pricing or metadata use `font-variant-numeric: tabular-nums`.

**Note on the ui-ux-cro-master font arsenal:** Fraunces was picked from the approved arsenal (alongside Cabinet Grotesk, Neue Montreal, Bricolage Grotesque, Geist, Canela, etc.). If a future project for the same client needs a different visual language, rotate to a different family from the arsenal — never repeat a pairing on consecutive projects. Per ui-ux-cro-master rule.

## Layout

Mobile-first. Full-bleed by default — content sections sit inside an inner container with a maximum width of `1320px` and outer gutter `28px` on mobile, `56px` from `960px` up.

Section vertical rhythm: `{spacing.3xl}` (`144px`) between major sections on desktop, `{spacing.2xl}` (`96px`) on mobile.

The hero is full-viewport (`100svh`) with a minimum height of `680px`. Below the hero, the page alternates between full-bleed dark sections, narrow centered "feeling" moments on bone (max-width `780px` text column), and gridded card sections.

The home page uses a 12-column grid above `960px`; trip detail pages use a 3:2 split (overview left, sticky pricing card right). The picker section uses a 5-column grid that collapses to 2-column at tablet and 1-column at mobile.

## Elevation & Depth

There are no shadows. Depth comes from three sources only: full-bleed imagery versus flat panels, color contrast between primary and surface, and hairlines via `{colors.hairline}`. Cards never float. Modals, if used, use a `backdrop-filter: blur(14px)` overlay rather than a drop shadow.

Buttons do not lift on hover. They change color (accent → accent-hot, or bone → accent). Cards do not lift; their image scales subtly (~1.04 to ~1.06) on hover instead.

## Shapes

Square everything. `{rounded.none}` is the default for buttons, cards, hero panels, testimonial cards, and pickcards. The only exceptions:

- `{rounded.sm}` (`2px`) on inputs and selects for minimal softening.
- `{rounded.pill}` exclusively on circular badges, avatars, and the small "x weeks" eyebrow chips that sit on top of pickcards.

Roundness reads as casual. The brand isn't.

## Components

### Button

Two primary types: `button-primary` (coral background, bone text, hard square corners) and `button-ghost` (transparent on primary, bone border, bone text). On bone backgrounds, use `button-on-bone` (primary-dark background, bone text, no border).

- Exactly one `button-primary` per visible section.
- Padding is generous: `18px` vertical, `28–30px` horizontal.
- Label is always `{typography.label-caps}` — never sentence-case.
- Disabled state: 50% opacity on the active fill. Never a separate gray.

### Hero

Full-viewport. Always video. Four scenes that crossfade with a 20% overlap, each with a slow Ken Burns push (scale 1.0 → 1.12 over the visible duration). Centered text overlay sits in the lower-middle third on mobile, lower-left on desktop tablet+. A scroll cue ("Scroll" with a thin animated bar) sits bottom-center.

For accessibility: `prefers-reduced-motion: reduce` disables the crossfade and Ken Burns; a single still scene is shown.

### Pickcard

Aspect ratio 3:4. Full-bleed image background, dark gradient overlay (`primary` 85% at the bottom to transparent at the top). Label `{typography.label-caps}` bottom-left. Hint chip `{typography.body-sm}` top-left. Hover swaps the gradient overlay toward an `accent`-tinted treatment (`accent` 60% at the bottom).

### Card (testimonial / explore card)

Square corners, surface or bone background, generous padding (`{spacing.lg}`+). Pull-quote uses `{typography.serif-quote}` with a leading curly-quote glyph in `{colors.accent}` at oversized scale.

### Hero overlay text

Headline is `{typography.display}` with one italic emphasis word in `{typography.display-italic}`. Sub-headline is `{typography.body-lg}` with the price callout in `{colors.accent}`.

### Picker tabs

Tab list is a horizontal row of `{typography.label-caps}` labels separated by `{spacing.lg}`. Active tab has a 1px coral underline at `bottom: -8px`. No background, no border.

### Trust strip

Horizontal `{typography.label-caps}` row across the bottom of the hero. Each item is preceded by a `6×6` coral dot. The strip uses `backdrop-filter: blur(6px)` and `background: primary @ 30%` so it sits clearly over the video without obscuring it.

### Ribbon / marquee

A perpetually scrolling horizontal track of credentials, separated by coral dots. Speed: ~50s for one full cycle. `prefers-reduced-motion: reduce` pauses it.

## Do's and Don'ts

These rules are non-negotiable. The first block is brand-specific; the second is the `ui-ux-cro-master` anti-AI-slop framework, which applies to every Mark Holland project.

**Do (brand-specific)**

- Use `{colors.accent}` exactly once per visible section. One CTA, one focus ring, one moment.
- Use `{typography.display}` exactly once per page. Hero only.
- Treat video as load-bearing. Hero scenes must show real motion (people, place, weather), not abstract loops.
- Use the italic serif (`{typography.display-italic}` or `{typography.serif-quote}`) as a deliberate emphasis device, never as decoration.
- Wrap the GHL Calendars API in custom UI components defined here. Never the GHL embedded widget.
- Render all critical text statically. Animations decorate; they do not deliver content.
- Honor `prefers-reduced-motion: reduce` on hero crossfade, Ken Burns, marquee, and card hover transforms.

**Do (ui-ux-cro-master required moves — apply BEFORE writing any UI code)**

- Choose a bold aesthetic direction before opening a code editor. This project's direction is **cinematic / editorial dark**. Not "clean and modern" — that's a non-direction.
- Define the color system in CSS custom properties (already done via DESIGN.md tokens — `npm run design:export` regenerates `src/styles/theme.css`).
- Decide the layout strategy. This project uses **full-bleed video hero + asymmetric editorial flow on a near-black canvas with a single coral accent**. Bento and split layouts welcome where they fit. Anti-grid is a feature.
- Plan one signature moment. For this project: the four-scene crossfading hero reel with slow Ken Burns push, layered with a centered display headline that has one italic emphasis word.
- Pair distinctive typography. Done: Fraunces (display) + Inter (body).

**Don't (brand-specific)**

- Don't introduce gray. There are no grays — `{colors.ink-soft}` / `{colors.ink-mute}` are bone at reduced opacity.
- Don't round corners on buttons, cards, or hero panels. Square is the point.
- Don't combine `{typography.display}` italic with `{typography.h1}` italic in the same group — pick one moment.
- Don't use the words "luxurious," "ultimate," "perfect," or "transformative" anywhere. Show, don't claim.
- Don't use exclamation marks in body copy. Headlines that need urgency are the wrong headlines.
- Don't use stock yacht-club imagery (gold trim, men in white blazers, champagne towers). The brand is wellness-coded, not yacht-coded.
- Don't pile shadows, gradients, glows, or glassmorphism. Depth is from imagery and hairlines, not effects.
- Don't introduce a second sans family or a third color family at the component level. Every UI color must come from a token in this file.
- Don't host any page on GoHighLevel. The website is Astro; GHL is the CRM backend only.
- Don't use `{colors.accent}` as a section background or large color block — it loses its meaning as an interaction signal.

**Don't (ui-ux-cro-master anti-AI-slop — instant rejection if any of these appear)**

- Don't use **Inter, Roboto, Arial, or any system font** as a display or heading font. Inter is allowed ONLY as body — `{typography.body-*}` and `{typography.label-caps}`. Everything else uses Fraunces.
- Don't use **purple-to-pink gradients on white backgrounds** anywhere. Banned.
- Don't use the **predictable centered hero → features grid → testimonials → CTA layout**. This project's layout is asymmetric editorial — keep it that way.
- Don't use **cookie-cutter card grids with identical border-radius**. Vary card density, scale, and treatment per section.
- Don't use **emoji as icons**. Use SVG icon libraries: Lucide, Heroicons, Simple Icons, Phosphor.
- Don't use **Space Grotesk** as a default anywhere.
- Don't use **generic stock photography** (handshakes, smiling teams in offices, headset wearers). This brand's photography is BVI water, the catamaran, the Kendalls, the food on deck.
- Don't use **carousel sliders**. Slides 2+ get under 1% CTR.
- Don't use generic **"Innovating the future of [noun]"** style headlines. This project uses the reframe formula ("You don't need X. You need Y.") or concrete promises.
- Don't use **pure #FFFFFF** for backgrounds. Use `{colors.bone}` (warm off-white) instead.
- Don't use **pure #000000** for dark backgrounds. Use `{colors.primary}` (`#0A0A0A`).
- Don't ship UI code without first reading `~/.claude/skills/ui-ux-cro-master/references/design-trends-2026.md` and running its `references/pre-delivery-checklist.md`.

---

*This DESIGN.md follows the Google DESIGN.md alpha spec (`github.com/google-labs-code/design.md`). Validate with `npx @google/design.md lint DESIGN.md` before merging changes. Re-export Tailwind tokens with `npx @google/design.md export --format css-tailwind DESIGN.md > src/styles/theme.css` after any token edit.*

*Direction status: **v3 pending Mark + Dodie sign-off**. If approved, this file is the source of truth for the build. If a different direction is chosen, replace the YAML frontmatter and rewrite all prose sections in the canonical section order — never reorder.*
