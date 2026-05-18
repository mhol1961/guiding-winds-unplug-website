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

## Scene 3 — Greek Cycladic cove

**16:9 desktop (`hero-greece-03.mp4`)**

```
Wide locked-off camera at sea level looking into a Cycladic cove on a Greek island, anchored 50 yards offshore. A 50-foot white catamaran sits in the middle of the frame, its hull and sails reflected perfectly in mirror-flat aquamarine water. Above the cove, a whitewashed village climbs a stepped hillside, blue-domed church visible at the highest point, bougainvillea spilling over a stone retaining wall. Late afternoon Aegean light, warm but not yet golden — sun is high and slightly behind the village so the catamaran is lit and the hillside is in soft shadow. Quiet, classic Mediterranean atmosphere, no boat traffic, no swimmers. Subtle slow dolly-right movement of about 6 inches across the 8 seconds, just enough to create parallax between the catamaran and the village behind. Shot on Arri Alexa Mini LF, 35mm equivalent, gentle teal-and-orange grade. No people visible. Photorealistic, editorial travel cinematography.
```

**9:16 mobile (`hero-greece-03-portrait.mp4`)**

```
Vertical framing of a Cycladic cove on a Greek island. The 50-foot white catamaran sits in the lower third of the frame, reflected in mirror-flat aquamarine water; the whitewashed village climbs the stepped hillside above, blue-domed church near the top. Late afternoon Aegean light, sun high and behind the village. Quiet, classic Mediterranean atmosphere, no boat traffic. Subtle slow vertical pan from village down to catamaran across 8 seconds. Shot on Arri Alexa Mini LF in 9:16 portrait crop. No people visible. Photorealistic, gentle teal-and-orange grade.
```

---

## Scene 4 — Sunset teak deck, two glasses

**16:9 desktop (`hero-deck-04.mp4`)**

```
Medium close-up at table level. A teak boat-deck table with two stemmed wine glasses (one white wine, one rosé) sits in the foreground, weather-aged teak grain catching the warm light, the curve of the boat's gunwale and the open horizon visible behind. Late golden hour fading to magic hour, sun setting just out of frame screen-left casting strong warm side-light across the table and producing a soft anamorphic lens flare across the upper-left third of the frame. Slight breeze visible in the wine surface — micro-ripples. Romantic, intimate, end-of-day mood, the boat at rest at anchor, soft orange-and-purple sky in the background. Slow dolly-in toward the glasses across 8 seconds, just under a foot of travel. Shot on Arri Alexa with vintage anamorphic glass (Cooke Anamorphic /i), 65mm equivalent, rich teal-and-orange Hollywood grade. No people visible. Photorealistic, editorial travel cinematography in the Black Tomato / Cereal magazine register.
```

**9:16 mobile (`hero-deck-04-portrait.mp4`)**

```
Medium close-up at table level, vertical framing. A teak boat-deck table with two stemmed wine glasses (one white, one rosé) in the lower third; the curve of the boat's gunwale and open horizon in the upper two-thirds. Late golden hour fading to magic hour, warm side-light, soft anamorphic lens flare. Slight micro-ripples in the wine. Romantic, intimate, end-of-day mood. Slow dolly-in across 8 seconds. Shot on Arri Alexa with vintage anamorphic glass in 9:16 portrait crop. No people visible. Photorealistic, rich teal-and-orange grade.
```

---

## Asset filename chart

| Scene | Desktop file (16:9) | Mobile file (9:16) |
|---|---|---|
| 1 — BVI catamaran at anchor | `public/media/hero/hero-bvi-01.mp4` | `public/media/hero/hero-bvi-01-portrait.mp4` |
| 2 — Bahamas pink-sand approach | `public/media/hero/hero-bahamas-02.mp4` | `public/media/hero/hero-bahamas-02-portrait.mp4` |
| 3 — Greek Cycladic cove | `public/media/hero/hero-greece-03.mp4` | `public/media/hero/hero-greece-03-portrait.mp4` |
| 4 — Sunset teak deck + glasses | `public/media/hero/hero-deck-04.mp4` | `public/media/hero/hero-deck-04-portrait.mp4` |

Encode each MP4 with `+faststart` so the browser plays without
buffering the whole file:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow \
  -movflags +faststart -an -pix_fmt yuv420p output.mp4
```

Target file size per scene: **2–4 MB**. Drop a `.webm` companion if
you want even tighter compression for Chrome/Firefox.

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
