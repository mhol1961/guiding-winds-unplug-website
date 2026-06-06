# Claude Code Prompt — Remaining Guiding Winds Changes (from 6/2 call)

Hand this whole file to Claude Code, running in the `guidingwinds-unplug` repo. It covers everything from the 6/2 call that is **not yet done**. Work top to bottom. After edits, run `npx astro check` (or parse changed `.astro` files with `@astrojs/compiler`) and confirm 0 errors.

## Already applied — DO NOT redo
Capacity ranges (4-6 cabins / 8-12 guests), front-page price removal, hero captain/permit badges, boat size 40 to 60 ft, "never on the boat / four hours" line removed, "this morning's market" line replaced, 2027 + "14 weeks" scrubbed, inventory stat reworked, paddleboards/kayaks → add-on, "Chat with Dodie", and the Experiences gallery (`/experiences` "From aboard" section + compressed clips in `public/media/gallery/`).

Also done 2026-06-05: the **entire credentials strip (`PressStrip`) was removed from the homepage** per Clint (he does not hold those credentials). `AboutSplit.astro` corrected to one captain (heading "One captain, one crew." / "One slow life."), USCG/RYA claims removed, "14 weeks / 8 cabins" softened, and the real couple photo `/dodie-and-clint.png` swapped in. `TrustPillars` and `aboard.astro` "USCG" wording removed. **See A6 for the remaining credential cleanup on the subpages.**

---

## PART A — Ready to run now (no client input needed)

### A1. Make the logo larger
File: `src/components/shared/Nav.astro`
- Main header logo currently `class="size-12 lg:size-14"` with `width/height="56"`. Increase ~35%: set `class="size-16 lg:size-20"` and bump `width`/`height` to `80`.
- The secondary logo in the mobile menu (`class="size-11"`, `width/height="44"`): set `class="size-14"` and `width`/`height` to `56`.
Keep `object-contain` so it doesn't distort.

### A2. Feeling section intro heading
File: `src/components/home/Feeling.astro` (around line 17)
Replace the headline "The world is loud. The water isn't." with **"Sail. Breathe. Reset."** Keep the existing display/italic styling; if the markup splits the line across a `<span>` for the italic emphasis, set the three words cleanly (e.g. plain "Sail. Breathe." + italic "Reset.") — use your judgment to keep it visually balanced.

### A3. Per-region nights as a range
Goal: show "4 to 7 nights" style ranges instead of a fixed "7 nights."
- `src/content.config.ts`: add an optional field to the voyages schema, e.g. `nightsLabel: z.string().optional()`.
- Each `src/content/voyages/*.md`: add `nightsLabel` (e.g. `nightsLabel: '4 to 7'`). Keep the numeric `nights` field as-is (used elsewhere for sorting/schema).
- `src/components/home/Picker.astro` and anywhere else rendering `{voyage.data.nights} nights`: render `{voyage.data.nightsLabel ?? voyage.data.nights} nights`.

### A4. AboutSplit photos — DONE
The couple image in `AboutSplit.astro` was swapped to `/dodie-and-clint.png` on 2026-06-05. (There is no separate solo image in this component.) Nothing to do.

### A6. Remove the remaining false credential claims site-wide
Clint does NOT hold a USCG Master 100-Ton license, an RYA Yachtmaster Offshore certification, or the BVI Cruising & Charter Permit. The homepage is already clean; remove or neutralize these claims everywhere else (keep the plain role words "captain", "Captain Clint", "host Dodie" — only the specific licenses/permit are false):

- `src/pages/about.astro` (~line 47-48): remove the "USCG-licensed captain · documentation on request" and "Current BVI cruising and charter permits" list items.
- `src/pages/faq.astro` (~line 122): the qualifications answer asserts the USCG Master 100-Ton, RYA Yachtmaster, and BVI permit. Rewrite to describe experience only, with NO specific license claims. **Ask Clint for his actual, accurate qualifications** and use those; until then keep it generic ("Clint personally captains every voyage and has years of experience in the Caribbean chain").
- `src/content/voyages/*.md` (all five): in the inclusions lists change "USCG-licensed captain and host" / "USCG / RYA Yachtmaster captain and host" to "Captain and host". In each TL;DR remove "(USCG-licensed)" after "captained by Clint Kendall".
- `src/pages/journal/[...slug].astro` (~line 186): author bio "USCG Master 100-Ton. 20+ years on the water." → "Captain of Guiding Winds Unplug."
- `src/pages/llms.txt.ts` (~lines 19, 38): remove the "(USCG Master 100-Ton, RYA Yachtmaster Offshore)" credential parenthetical and the "Two-captain" / "fourteen weeks a year" phrasing; reword to one captain + "a dozen-plus weeks a year".

While in the voyage content, also reconcile the fleet specs ("45ft+ catamaran with 8 private cabins and a 12-guest cap") with the variable 40-60 ft / 4-6 cabin / 8-12 guest fleet — but only after Clint confirms typical configs (see C3). Leave the per-voyage pricing on these detail pages.

### A5. Hero video — render the no-wine Scene 4
The revised, alcohol-free hero scene prompt is in `docs/seedance-prompts.md` under **"Scene 4 — REVISED (no alcohol)."** Render both the 16:9 and 9:16 via the Seedance/fal pipeline, output to `public/media/hero/hero-deck-04.mp4` and `hero-deck-04-portrait.mp4` (overwrite), encode with:
`ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -movflags +faststart -an -pix_fmt yuv420p out.mp4`
Then check the poster `public/img/stock/hero/hero-sunset-teak-deck-04.jpg`; if it shows wine glasses, replace it with a glass-free still or a frame grab from the new render.

---

## PART B — Blocked on Clint/Dodie's emailed copy + photos
Fill the placeholders below with the real content when it arrives, then run.

### B1. Hero headline
File: `src/components/home/Hero.astro` (it receives `headlinePrefix` / `headlineEmphasis` from `src/pages/index.astro`).
Draft direction from the call: *"Guiding Winds Unplug, where guests become crew, strangers become friends, and the ocean becomes the path back to presence."*
Replace the current "Every voyage starts with a feeling." with the FINAL wording:
> [PASTE FINAL HERO HEADLINE]

### B2. Chef / food framing
Files: `src/pages/aboard.astro` (the "Chef-prepared meals" inclusion item + the meta `description`), `src/components/voyage/PricingCard.astro`, and `src/content/voyages/*.md`.
Reframe away from "all meals chef-prepared" to a **casual, hands-on galley** where guests can cook a night, with a **private chef available as a paid add-on**. Use this final wording:
> [PASTE FINAL CHEF/FOOD WORDING]

### B3. UNPLUG bottom line (confirm or replace)
File: `src/components/home/Megatype.astro`. Currently reads: *"Just bringing life back down to zero. Reset your body and mind, on nothing but water, weather, and time."* If they want different wording:
> [PASTE FINAL UNPLUG LINE — or leave as-is]

### B4. AboutSplit "our story" copy — corrected, optional polish
The homepage `AboutSplit.astro` is already fixed to one captain + Dodie with the false credentials removed. Only needed if Clint wants it in his own words:
> [PASTE FINAL ABOUT/OUR-STORY COPY — optional]

### B5. Replace remaining AI/placeholder photos
Several stock/AI images are inaccurate (a monohull shown as a catamaran; one image "not even a sailboat"). When Clint sends real catamaran/monohull photos, drop them into the appropriate `public/img/...` paths and update the `src`/`alt` where those AI images are used (search `-ai.jpg` under `public/img/stock/`).
> [LIST NEW PHOTO FILES + WHERE EACH GOES]

---

## PART C — Two decisions (confirm, then I/Claude Code will apply)

### C1. PressStrip credentials — RESOLVED
Clint confirmed he does not hold these. The entire `PressStrip` credentials strip was removed from the homepage on 2026-06-05. The true signals it carried (5.0 reviews, 100% all-inclusive) still appear in the hero trust strip. Nothing to do. (The `PressStrip.astro` component file is left unused in case a credentials-free version is wanted later.)

### C2. "Premium open bar"
File: `src/pages/aboard.astro` has a `Premium open bar` inclusion ("Wine, spirits, beer..."), which conflicts with the no-booze-cruise direction. Soften, cut, or keep?
> Decision: [SOFTEN / CUT / KEEP — with replacement wording if softening]

### C3. (Larger, related) Aboard page assumes one 8-cabin Lagoon 50
`src/pages/aboard.astro` is written around a single Lagoon 50 ("Eight queens", "8 cabins", "50 feet"). This conflicts with the variable 40-60 ft / 4-6 cabin fleet. Once Clint confirms the typical boat configs, do a content pass to generalize (or keep the Lagoon 50 as the flagship and frame the rest as "and similar"). Needs direction before editing.
> Direction: [PASTE FLEET / CONFIG NOTES]

---

When done, run a build/typecheck and report any diagnostics.
