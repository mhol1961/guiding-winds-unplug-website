# Seedance 2.0 — Hero Reel Prompts (Guiding Winds Unplug)

Four 8-second video reels for the home hero crossfade. Generated per the
seedance-prompt skill formula:

> `[Shot type and angle]. [Subject + action]. [Environment + lighting].`
> `[Mood + atmosphere]. [Camera movement]. [Style reference].`

Each scene has two prompts — **16:9 desktop** (primary) and **9:16 mobile**
(portrait crop). Render desktop first, then mobile; the crossfade
component swaps based on viewport.

**Important rules across all four:**

- `--no_people` / "no people visible" — we can't ship recognizable faces without releases
- `--photorealistic` — no stylized renders
- `--slow_camera_motion` — under 0.5 m/s perceived push or pan
- Golden-hour where called for, otherwise mid-morning cool light
- 1080p output, standard quality tier (these are hero assets, worth the credits)

When the renders land, drop them into `public/media/hero/` named per
the chart at the bottom of this file. The `Hero.astro` component already
accepts a `videoSrc` field — swap from `src=` (img) to `videoSrc=`.

---

## Scene 1 — BVI turquoise, catamaran at anchor

**16:9 desktop (`hero-bvi-01.mp4`)**

```
Slow aerial drone push-in from 80 feet altitude descending to 20 feet, framed wide then tightening. A 50-foot white sailing catamaran lies at anchor in glassy turquoise Caribbean water off a deserted BVI cay, sails furled, hulls casting clean shadows on the white sand visible beneath the shallow water. Late golden hour, the sun low behind the camera casting warm directional light across the deck and the water's surface. Gentle ripple pattern on the bay, no waves. Calm, cinematic, contemplative mood. Smooth steady aerial push-in toward the boat, anamorphic lens compression. Shot on Arri Alexa LF, anamorphic 2.39:1 framing scaled to 16:9. No people visible. Photorealistic, Black Tomato travel-brand cinematography, painterly color grade with warm highlights and deep teal shadows.
```

**9:16 mobile (`hero-bvi-01-portrait.mp4`)**

```
Slow aerial drone push-down from 60 feet altitude descending to 25 feet, vertical framing. A 50-foot white sailing catamaran lies at anchor in glassy turquoise Caribbean water off a deserted BVI cay, sails furled, hulls casting clean shadows on the white sand visible beneath the shallow water. Late golden hour, warm directional light. Calm, contemplative mood. Smooth steady aerial descent toward the boat. Shot on Arri Alexa LF in 9:16 portrait crop. No people visible. Photorealistic, painterly color grade with warm highlights and deep teal shadows.
```

```python
fal_client.subscribe("fal-ai/seedance-2/text-to-video", arguments={
    "prompt": "<scene 1 desktop prompt>",
    "duration": 8,
    "aspect_ratio": "16:9",
})
```

---

## Scene 2 — Pink-sand approach, Abacos

**16:9 desktop (`hero-bahamas-02.mp4`)**

```
Low gimbal-stabilized point-of-view shot from the bow of a tender dinghy, water just inches below the lens. The dinghy glides toward an empty pink-sand spit in the Abacos at sunrise, the shore line approaching steadily, distant palms on a horseshoe bay in the soft-focus background. Soft pink-and-amber sunrise sky, water shifting from deep cobalt in the foreground to pale pink-tinted aqua in the shallows ahead. Quiet, anticipatory mood — the first moment of a day at anchor. Steady forward glide, no wake visible, no engine sound implied — the boat appears to drift. Shot on RED Komodo at 50mm equivalent, low contrast warm grade. No people visible. Photorealistic, editorial travel cinematography, painterly atmosphere.
```

**9:16 mobile (`hero-bahamas-02-portrait.mp4`)**

```
Low gimbal-stabilized POV from the bow of a tender dinghy gliding toward an empty pink-sand spit in the Abacos at sunrise, vertical framing emphasizing the approach to the shore and the sky above. Water just inches below the lens, soft pink-and-amber sunrise sky filling the upper two-thirds. Quiet, anticipatory mood. Steady forward glide with subtle vertical bobbing motion. Shot on RED Komodo in 9:16 portrait crop. No people visible. Photorealistic, warm editorial color grade.
```

---

## Scene 3 — Greek Cycladic cove (REVISED — village-forward, no centered catamaran)

> **Revised 2026-06-05.** The original Scene 3 put a centered white catamaran on mirror-flat water — too close to Scene 1 (BVI catamaran at anchor), so the reel read as "the same boat twice at a different zoom." This version leads with the village architecture and drops the hero boat for variety. Render at `duration: 5` to match scenes 1–2 (~5s) so each plays once in the 5.5s crossfade window.

**16:9 desktop (`hero-greece-03.mp4`)**

```
Slow cinematic dolly push-in toward a whitewashed Cycladic village climbing a stepped hillside on a Greek island. A blue-domed church stands at the highest point, deep-magenta bougainvillea spilling over a sun-bleached stone retaining wall, narrow whitewashed staircases and cubic houses stacked up the slope. Calm aquamarine Aegean water fills the lower third, gently lapping bare rocks, no boats in the foreground or centre of frame. Late afternoon Aegean light, warm and golden raking across the white architecture from screen-right, soft shadows in the alleys. Quiet, classic Mediterranean atmosphere, no boat traffic. Slow steady dolly push-in toward the blue dome across 8 seconds, gentle parallax between the foreground stone wall and the village behind. Shot on Arri Alexa Mini LF, 40mm equivalent, gentle teal-and-orange grade. No people visible. Photorealistic, editorial travel cinematography in the Black Tomato / Cereal magazine register.
```

**9:16 mobile (`hero-greece-03-portrait.mp4`)**

```
Vertical framing of a whitewashed Cycladic village climbing a stepped hillside on a Greek island, blue-domed church near the top, deep-magenta bougainvillea spilling over a sun-bleached stone wall, cubic white houses stacked up the slope. Calm aquamarine Aegean water in the lower quarter, no boats. Late afternoon Aegean light raking warm across the white architecture, soft shadows in the alleys. Quiet, classic Mediterranean atmosphere, no people, no boats. Slow steady gentle tilt up toward the blue dome across 8 seconds. Shot on Arri Alexa Mini LF in 9:16 portrait crop. No people visible. Photorealistic, gentle teal-and-orange grade.
```

---

## Scene 4 — Sunset teak deck, two glasses (REMOVED — do not render)

> Clint and Dodie asked to drop the wine glasses on the 2026-06-02 call: they don't want a "booze cruise" impression. The original wine-glass prompt has been deleted to prevent an accidental re-render. **Use the "Scene 4 — REVISED" prompt below**, which renders to the same filenames (`hero-deck-04.mp4` / `hero-deck-04-portrait.mp4`).

---

## Scene 4 — REVISED (no alcohol) — sunset teak deck, lantern + book

Same intimate end-of-day detail shot as the original Scene 4, minus any glasses, bottles, or alcohol. Keeps the magic-hour warmth and anamorphic flare. **Render to the same filenames** (`hero-deck-04.mp4` / `hero-deck-04-portrait.mp4`) so `Hero.astro` needs no edit.

**16:9 desktop (`hero-deck-04.mp4`)**

```
Medium close-up at table level. A weather-aged teak boat-deck table in the foreground holds a lit brass hurricane lantern with a soft warm flame and an open cloth-bound book laid face-down beside it, a coiled length of natural rope at the edge of frame; the curve of the boat's gunwale and the open horizon visible behind. Late golden hour fading to magic hour, sun setting just out of frame screen-left casting strong warm side-light across the table and producing a soft anamorphic lens flare across the upper-left third of the frame. Faint breeze stirring the lantern flame. Calm, intimate, unplugged end-of-day mood, the boat at rest at anchor, soft orange-and-purple sky in the background. Slow dolly-in toward the lantern across 8 seconds, just under a foot of travel. Shot on Arri Alexa with vintage anamorphic glass (Cooke Anamorphic /i), 65mm equivalent, rich teal-and-orange Hollywood grade. No people visible, no alcohol, no glasses or bottles of any kind. Photorealistic, editorial travel cinematography in the Black Tomato / Cereal magazine register.
```

**9:16 mobile (`hero-deck-04-portrait.mp4`)**

```
Medium close-up at table level, vertical framing. A weather-aged teak boat-deck table in the lower third holds a lit brass hurricane lantern with a soft warm flame and an open cloth-bound book laid face-down beside it; the curve of the boat's gunwale and open horizon fill the upper two-thirds. Late golden hour fading to magic hour, warm side-light, soft anamorphic lens flare. Faint breeze stirring the flame. Calm, intimate, unplugged end-of-day mood. Slow dolly-in across 8 seconds. Shot on Arri Alexa with vintage anamorphic glass in 9:16 portrait crop. No people visible, no alcohol, no glasses or bottles of any kind. Photorealistic, rich teal-and-orange grade.
```

**Poster note:** the current Scene 4 poster fallback is `/img/stock/hero/hero-sunset-teak-deck-04.jpg`. If that still shows wine glasses, swap it for a glass-free magic-hour deck still (or a frame grab from the new render) so the reduced-motion / pre-load state matches.

---

## Asset filename chart

| Scene | Desktop file (16:9) | Mobile file (9:16) |
|---|---|---|
| 1 — BVI catamaran at anchor | `public/media/hero/hero-bvi-01.mp4` | `public/media/hero/hero-bvi-01-portrait.mp4` |
| 2 — Bahamas pink-sand approach | `public/media/hero/hero-bahamas-02.mp4` | `public/media/hero/hero-bahamas-02-portrait.mp4` |
| 3 — Greek village (revised, no centered boat) | `public/media/hero/hero-greece-03.mp4` | `public/media/hero/hero-greece-03-portrait.mp4` |
| 4 — Sunset teak deck, lantern + book (no alcohol) | `public/media/hero/hero-deck-04.mp4` | `public/media/hero/hero-deck-04-portrait.mp4` |

Encode each MP4 with `+faststart` so the browser plays without
buffering the whole file:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow \
  -movflags +faststart -an -pix_fmt yuv420p output.mp4
```

Target file size per scene: **2–4 MB**. Drop a `.webm` companion if
you want even tighter compression for Chrome/Firefox. (The deck scene
compresses below 2 MB at crf 23 because it's a dark, low-detail
magic-hour shot — that's expected, not over-compression.)

**Keep all scenes ~5 seconds.** `Hero.astro` crossfades on a 5.5s window
per scene; a clip longer than that gets truncated and loops underneath.
Render with `duration: 5` (Seedance 2 honors it), or trim to 5s on encode
with `-t 5`. Scenes 1–2 are Seedance v1 Pro (~5.04s); scenes 3–4 are
Seedance 2 at `duration: 5`.

---

## How to wire into the site once rendered

`src/components/home/Hero.astro` currently uses `<img>` per scene. Add
a `videoSrc` field per scene and the component will pick `<video>`
over `<img>`:

```diff
-  { src: '/img/source/hero/02-sunset-catamaran-anchorage.jpg', alt: '...' },
+  {
+    videoSrc: '/media/hero/hero-bvi-01.mp4',
+    videoSrcPortrait: '/media/hero/hero-bvi-01-portrait.mp4',
+    posterSrc: '/img/source/hero/02-sunset-catamaran-anchorage.jpg',
+    alt: '...',
+  },
```

The hero already handles `prefers-reduced-motion` — videos respect
that automatically when we render `<video>` without `autoplay`.

---

*Generated 2026-05-18 by the seedance-prompt skill.*
*Render in fal.ai playground or via the Python API snippet above.*
