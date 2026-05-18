# Source Image Manifest — guidingwinds-unplug.com (legacy GHL site)

> Pulled from the current `guidingwinds-unplug.com` GoHighLevel site on **2026-05-17**.
> Crawled with `firecrawl map` + `firecrawl scrape` against the public site. Images downloaded direct from the underlying `assets.cdn.filesafe.space` originals (the GHL `images.leadconnectorhq.com/.../u_<original>` CDN exposes the raw URL — no auth required).
>
> **Total unique images discovered:** 19 (deduplicated across all 5 crawled pages and srcset variants — original site loaded ~86 URL variants but only 19 distinct media items).
> **Successfully downloaded:** 19 / 19.
> **Auth-required failures:** 0.
>
> **Pages crawled:**
> 1. `https://guidingwinds-unplug.com/` (home)
> 2. `https://guidingwinds-unplug.com/book-a-charter-with-us` (inquiry/booking)
> 3. `https://guidingwinds-unplug.com/destination-schedule` (destination cards)
> 4. `https://guidingwinds-unplug.com/-649302` (duplicate/internal funnel page — same content as home)
> 5. `https://guidingwinds-unplug.com/privacy-policy` (no images)
>
> The legacy site is built on GoHighLevel. URLs follow the `https://images.leadconnectorhq.com/image/f_webp/q_80/r_<width>/u_https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/<id>` pattern. We pulled the underlying `assets.cdn.filesafe.space` originals — these are the highest-fidelity copies (the leadconnectorhq URL just re-encodes to WebP at a requested width).
>
> **Photography note:** Every photo is iPhone-shot, 1536x2048 portrait or 2048x1536 landscape, 700KB–1.4MB. Quality is good but not "agency hero". Several are casual selfies — usable for "Meet your captains" and journal storytelling, less so for the cinematic Black-Tomato-style hero. **Mark / Dodie should be asked for any RAW iPhone library** — these 11 photos almost certainly are a small subset of what she actually has.

---

## Tag legend

- `[PHOTO]` real photography, usable
- `[LOGO]` official Guiding Winds brand mark — keep
- `[ICON]` generic GHL system icon — **SKIP** for the rebuild, replace with Lucide/Phosphor SVGs (per CLAUDE.md anti-AI-slop rule on icon libraries)
- `[SPACER]` GHL layout pixel / placeholder — **SKIP**

---

## hero/ — promoted candidates for hero / above-fold use

Copies of the strongest 5 photographic images, renamed with a leading sort prefix for easy ordering. Originals remain in their semantic folders (boat/, destinations/) — these are duplicates so designers can scan `hero/` without context-switching.

| File | Source | Pages | Dimensions | Description |
|---|---|---|---|---|
| `hero/01-catamaran-green-headland.jpg` | `destinations/catamaran-anchored-green-headland-01.jpg` | home, book-a-charter, destination-schedule, /-649302 | 1536x2048 (portrait) | [PHOTO] White catamaran anchored alone in deep blue BVI bay, steep green hillside, scattered clouds — postcard, the single strongest image on the site. |
| `hero/02-sunset-catamaran-anchorage.jpg` | `destinations/catamaran-anchorage-sunset-bvi-01.jpg` | home, book-a-charter, destination-schedule, /-649302 | 1536x2048 (portrait) | [PHOTO] Catamaran silhouette at anchor with sunset glow over BVI islands, taken from neighboring deck — cinematic, "unplug" mood. |
| `hero/03-foredeck-bow-sun-flare.jpg` | `boat/foredeck-bow-trampoline-sun-flare-01.jpg` | home, /-649302 | 2048x1536 (landscape) | [PHOTO] View forward across bow trampoline of catamaran, bright sun flare, anchored sailboat in distance — landscape, true hero-shape. |
| `hero/04-cockpit-sunrise.jpg` | `boat/cockpit-bench-seating-sunrise-01.jpg` | home, book-a-charter, destination-schedule, /-649302 | 1536x2048 (portrait) | [PHOTO] Catamaran cockpit at sunrise, charcoal cushions, dining table, open horizon — "what does mornings on board feel like" angle. |
| `hero/05-caribbean-night-moonlit.jpg` | `destinations/caribbean-night-marina-moonlit-01.jpg` | book-a-charter | 1536x2048 (portrait) | [PHOTO] Moonlit Caribbean marina, restaurant glowing yellow on water, blue accent lighting from yacht — rare night shot, gives editorial range. |

---

## boat/ — boat interior / exterior / on-deck POV

| File | Source URL | Pages | Dimensions | Description |
|---|---|---|---|---|
| `boat/cockpit-bench-seating-sunrise-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/697292fd2b73e1336ff6a971.jpg` | home, book-a-charter, destination-schedule, /-649302 | 1536x2048 | [PHOTO] Catamaran cockpit / aft seating area at sunrise — charcoal cushions, dining table, lifering, open horizon and distant mountains. |
| `boat/foredeck-bow-trampoline-sun-flare-01.jpg` | `https://storage.googleapis.com/msgsndr/Ytq1Qi48bKj3ZImQ9Ye8/media/698b383e67d7494f904bbb75.jpg` | home, /-649302 | 2048x1536 | [PHOTO] Looking forward from cockpit across bow trampoline, bright sun flare, anchored sailboat in distance. True landscape hero. |

---

## destinations/ — water / anchorage / island / destination teaser

| File | Source URL | Pages | Dimensions | Description |
|---|---|---|---|---|
| `destinations/catamaran-anchorage-sunset-bvi-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/69727e25c0f1c00809298153.jpg` | home, book-a-charter, destination-schedule, /-649302 | 1536x2048 | [PHOTO] Catamaran silhouette at anchor at sunset, golden glow over BVI islands. |
| `destinations/catamaran-anchored-green-headland-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/698b383e7305aa5b8e2f4982.jpg` | book-a-charter | 1536x2048 | [PHOTO] White catamaran anchored alone in deep blue BVI bay, steep green hillside, postcard composition — strongest single image. |
| `destinations/caribbean-night-marina-moonlit-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/698b383e7305aa49cd2f4981.jpg` | book-a-charter | 1536x2048 | [PHOTO] Moonlit Caribbean marina at night, glowing restaurant on water, blue yacht lighting in foreground, dramatic clouds. |
| `destinations/staircase-down-to-cove-01.webp` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/574814fb-3093-49d4-af05-7ddc4c7eb094.webp` | destination-schedule | 905x610 | [PHOTO] Wooden staircase descending steep tropical hillside to turquoise cove — destination card image. NOTE: this looks like stock/Adobe — not iPhone EXIF — verify with Dodie before using as authentic content. |
| `destinations/staircase-down-to-cove-02.webp` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/699476456bac2489bfffb3b8.webp` | destination-schedule | 905x610 | [PHOTO] **Identical pixels to staircase-01.webp** — GHL stored the same image twice under different IDs. Delete one in cleanup. Same stock-source caveat. |

---

## people/ — Clint, Dodie, guests

| File | Source URL | Pages | Dimensions | Description |
|---|---|---|---|---|
| `people/clint-dodie-deck-selfie-sunset-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/6978ff59eb0d1a3cf4c01738.jpeg` | home, /-649302 | 1536x2048 | [PHOTO] Clint and Dodie selfie on deck mid-passage, soft sunset clouds, both in sun-shirts. |
| `people/clint-dodie-foredeck-portrait-sunset-01.jpg` | `https://storage.googleapis.com/msgsndr/Ytq1Qi48bKj3ZImQ9Ye8/media/698f9ae87d68771184d0932e.jpg` | home, /-649302 | 1536x2048 | [PHOTO] Clint (pink linen shirt) and Dodie (red-floral sundress) standing on bow of catamaran at golden hour, anchored sailboats behind. **Best "your captains" portrait** — usable for About page hero. |
| `people/clint-dodie-thai-fishing-boats-selfie-01.jpg` | `https://storage.googleapis.com/msgsndr/Ytq1Qi48bKj3ZImQ9Ye8/media/698f9cb0008498d63a5288d7.jpg` | home, /-649302 | 1536x2048 | [PHOTO] Close-up selfie of Clint & Dodie smiling, cloudy day, colorful Thai longtail fishing boats and green headland behind — travel/about story image. |
| `people/clint-peace-sunset-portico-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/698b383ea41b87eb794a9ef6.jpg` | book-a-charter | 1536x2048 | [PHOTO] Clint (long hair, glasses, peace sign) under string-lit harbor portico at golden hour — personality shot, candid. |
| `people/couple-foredeck-embrace-bvi-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/698b383e67d749cc2f4bbb60.jpg` | book-a-charter | 1536x2048 | [PHOTO] Couple in swimwear on catamaran foredeck arms around each other, looking out at turquoise BVI water and green island. **Guests, not Clint/Dodie** — strong "this is what a charter feels like" image. |
| `people/group-guests-bvi-overlook-01.jpg` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/697291db4a646490ed6c3867.jpg` | home, /-649302 | 2048x1536 | [PHOTO] Group of 7-8 guests/crew in matching light-blue "Guiding Winds" tee-shirts, palm trees and BVI cove behind. Social proof image. Landscape. |

---

## food/ — (empty)

No food / galley shots existed on the current site. Flag for Dodie: cuisine is a known driver at this price point; we need food photography for the rebuild (provisioning, on-deck dining, sundowner cocktails, plated meals from the galley). Recommend asking her for any phone shots, or generating with Seedance for placeholder positions until real images land.

---

## misc/ — logos, GHL system icons, layout pixels

| File | Source URL | Pages | Dimensions | Description |
|---|---|---|---|---|
| `misc/logo-guiding-winds-unplug-circle-01.png` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/6977772bd2f5b7cce9712cc0.png` | home, book-a-charter, destination-schedule, /-649302 | 500x500 | [LOGO] **Official brand mark** — circular badge, black ring with cyan center, white Celtic triskele symbol, "GUIDING WINDS" arched above and "UNPLUG" below. **Keep and re-export as SVG for the rebuild.** Current PNG is 500x500 — too small for retina hero placement; needs vector regeneration. |
| `misc/icon-map-pin-dark-teal.png` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/659fff44-4378-43f3-8ddc-c57ff94c735e.png` | book-a-charter | 840x859 | [ICON] **GHL system icon** — dark teal map-with-pin glyph. **SKIP — replace with Lucide `map-pin` or `map` SVG.** |
| `misc/icon-paper-plane-dark-teal.png` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/7711ce33-8fc1-47ed-bcb7-8ac4c53a7985.png` | book-a-charter | 840x859 | [ICON] **GHL system icon** — dark teal paper-airplane glyph (used as "send/inquire"). **SKIP — replace with Lucide `send` SVG.** |
| `misc/icon-map-location-pin-flat.webp` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/e0af4375-5d8f-49b9-8468-3034d74f72d9.webp` | book-a-charter | 835x681 | [ICON] **GHL system icon** — dark teal flat map-pin glyph (variant). **SKIP.** |
| `misc/icon-5-stars-yellow.png` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/c92ef217-91a6-4f8d-b8ad-a583838c4d30.png` | destination-schedule | 722x141 | [ICON] **GHL review-stars graphic** — 5 solid yellow stars. **SKIP** — generate review-stars in JSX/SVG so we can drive 0–5 fill from data. |
| `misc/spacer-pixel-32px.png` | `https://assets.cdn.filesafe.space/Ytq1Qi48bKj3ZImQ9Ye8/media/c5e14604-a5a4-4c6d-b4a9-7691cdb3f2bf.png` | home, /-649302 | 32x30 | [SPACER] Tiny near-transparent PNG — GHL layout pixel or 1px lazy-load placeholder. **SKIP — not content.** |

---

## Skipped: video / non-image assets

The current site uses **no** hero video, no `<video>` tags, no MP4/WebM source. All "motion" on the legacy site is GHL's stock fade/slide CSS transitions. Per `CLAUDE.md` §6 the rebuild's 4-scene cycling hero loop will be **freshly generated** (Seedance 2) — no source video to pull.

The current site also includes 3 social SVG icons (Facebook, Instagram, X) from `stcdn.leadconnectorhq.com/funnel/icons/` — skipped. Footer social icons in the rebuild come from Lucide or Simple Icons.

---

## Recommended next actions

1. **Ask Dodie for her full iPhone library** from BVI / Bahamas / Mediterranean trips. The 11 photos here are a small sample — she almost certainly has hundreds. Prioritize: food/galley, multiple guest groups (not the one current set), sailing/sails-up shots (we have **zero**), snorkeling/water-activity shots, Clint at the helm, Dodie cooking/serving.
2. **Re-export the logo as SVG.** The 500x500 PNG won't scale cleanly for navbar + footer + favicon + OG.
3. **Verify the two staircase-cove WEBPs.** They appear identical and don't look like Clint/Dodie's own photography — they may be stock or AI. If stock, license needs verification or replace.
4. **Delete the `misc/spacer-pixel-32px.png`** after confirming it's not load-bearing anywhere. It is the broken 348-byte download in the raw fetch logs (the CDN intentionally serves a tiny placeholder for layout-pixel IDs).
5. **All 5 hero/* candidates need to be supplemented.** Strongest is `01-catamaran-green-headland.jpg` but it's portrait — we'll need a true 2048-wide landscape hero for above-fold desktop. `03-foredeck-bow-sun-flare.jpg` is landscape and works.
