#!/usr/bin/env python3
"""Render the 4 portrait (9:16) hero video reels for Guiding Winds Unplug
via fal.ai Seedance 2.0 Pro. Pulls FAL_KEY from Mark's
business-suite-portal .env, runs all 4 scenes in parallel via
ThreadPoolExecutor, downloads MP4s to public/media/hero/ with a
"-portrait" suffix so the desktop files (16:9) remain untouched.

Run from project root:
    python3 scripts/render-hero-videos-portrait.py

Costs roughly $0.80–1.20 per 8-second 1080p clip on Seedance 2.0 Pro,
so ~$4 total for the four portrait reels (mirroring the desktop run).

After rendering, compress each portrait MP4 with the project's
ffmpeg-static (npm package). See scripts/compress-portrait.mjs.
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ENV_PATH = pathlib.Path('/mnt/c/business-suite-portal/apps/api/.env')
OUTPUT_DIR = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'media' / 'hero'
ENDPOINT = 'fal-ai/bytedance/seedance/v1/pro/text-to-video'

SCENES = [
    {
        'name': 'hero-bvi-01',
        'prompt': (
            "Slow aerial drone push-in from 80 feet altitude descending to 20 feet, "
            "framed wide then tightening. A 50-foot white sailing catamaran lies at "
            "anchor in glassy turquoise Caribbean water off a deserted BVI cay, sails "
            "furled, hulls casting clean shadows on the white sand visible beneath the "
            "shallow water. Late golden hour, the sun low behind the camera casting "
            "warm directional light across the deck and the water's surface. Gentle "
            "ripple pattern on the bay, no waves. Calm, cinematic, contemplative "
            "mood. Smooth steady aerial push-in toward the boat, anamorphic lens "
            "compression. Shot on Arri Alexa LF. No people visible. Photorealistic, "
            "Black Tomato travel-brand cinematography, painterly color grade with warm "
            "highlights and deep teal shadows. Vertical 9:16 framing emphasizing the "
            "catamaran centered in the tall frame with the turquoise bay extending "
            "above and below it, sky occupying the upper third and reflective water "
            "the lower two-thirds."
        ),
    },
    {
        'name': 'hero-bahamas-02',
        'prompt': (
            "Low gimbal-stabilized point-of-view shot from the bow of a tender "
            "dinghy, water just inches below the lens. The dinghy glides toward an "
            "empty pink-sand spit in the Abacos at sunrise, the shore line "
            "approaching steadily, distant palms on a horseshoe bay in the "
            "soft-focus background. Soft pink-and-amber sunrise sky, water shifting "
            "from deep cobalt in the foreground to pale pink-tinted aqua in the "
            "shallows ahead. Quiet, anticipatory mood, the first moment of a day at "
            "anchor. Steady forward glide, no wake visible, no engine sound "
            "implied, the boat appears to drift. Shot on RED Komodo, low contrast "
            "warm grade. No people visible. Photorealistic, editorial travel "
            "cinematography, painterly atmosphere. Vertical 9:16 framing emphasizing "
            "the tall sky-to-water column, pink sunrise filling the upper half of "
            "the frame and the cobalt-to-aqua water lane leading the eye straight "
            "down the centerline toward the approaching shore."
        ),
    },
    {
        'name': 'hero-greece-03',
        'prompt': (
            "Locked-off camera at sea level looking into a Cycladic cove on a "
            "Greek island, anchored 50 yards offshore. A 50-foot white catamaran "
            "sits in the middle of the frame, its hull and sails reflected perfectly "
            "in mirror-flat aquamarine water. Above the cove, a whitewashed village "
            "climbs a stepped hillside, blue-domed church visible at the highest "
            "point, bougainvillea spilling over a stone retaining wall. Late "
            "afternoon Aegean light, warm but not yet golden, sun is high and "
            "slightly behind the village so the catamaran is lit and the hillside is "
            "in soft shadow. Quiet, classic Mediterranean atmosphere, no boat "
            "traffic, no swimmers. Subtle slow dolly-right movement of about 6 "
            "inches across the 8 seconds, just enough to create parallax between the "
            "catamaran and the village behind. Shot on Arri Alexa Mini LF, gentle "
            "teal-and-orange grade. No people visible. Photorealistic, editorial "
            "travel cinematography. Vertical 9:16 framing emphasizing the stacked "
            "composition: whitewashed village and blue-domed church in the upper "
            "third, the catamaran centered in the middle third, and its mirror "
            "reflection filling the lower third of the tall frame."
        ),
    },
    {
        'name': 'hero-deck-04',
        'prompt': (
            "Medium close-up at table level. A teak boat-deck table with two stemmed "
            "wine glasses (one white wine, one rosé) sits in the foreground, "
            "weather-aged teak grain catching the warm light, the curve of the "
            "boat's gunwale and the open horizon visible behind. Late golden hour "
            "fading to magic hour, sun setting just out of frame screen-left casting "
            "strong warm side-light across the table and producing a soft anamorphic "
            "lens flare across the upper third of the frame. Slight breeze "
            "visible in the wine surface, micro-ripples. Romantic, intimate, "
            "end-of-day mood, the boat at rest at anchor, soft orange-and-purple "
            "sky in the background. Slow dolly-in toward the glasses across 8 "
            "seconds, just under a foot of travel. Shot on Arri Alexa with vintage "
            "anamorphic glass (Cooke Anamorphic /i), rich teal-and-orange Hollywood "
            "grade. No people visible. Photorealistic, editorial travel "
            "cinematography in the Black Tomato / Cereal magazine register. "
            "Vertical 9:16 framing emphasizing the wine glasses standing tall in "
            "the lower two-thirds of the frame with the orange-and-purple sunset "
            "sky stretching upward through the upper third."
        ),
    },
]


def load_fal_key() -> str:
    env_text = ENV_PATH.read_text()
    match = re.search(r'FAL_KEY="?([^"\n]+)"?', env_text)
    if not match:
        print(f"ERROR: FAL_KEY not found in {ENV_PATH}", file=sys.stderr)
        sys.exit(1)
    return match.group(1)


def render_scene(scene: dict, *, fal_client_module) -> dict:
    name = scene['name']
    print(f"[{name}-portrait] submitting…", flush=True)
    try:
        result = fal_client_module.subscribe(
            ENDPOINT,
            arguments={
                'prompt': scene['prompt'],
                'aspect_ratio': '9:16',
                'duration': '5',  # Seedance v2 pro accepts 5 or 10 seconds
                'resolution': '1080p',
            },
            with_logs=False,
        )
    except Exception as exc:
        print(f"[{name}-portrait] ERROR: {exc}", flush=True)
        return {'name': name, 'ok': False, 'error': str(exc)}

    video_url = (result.get('video') or {}).get('url') or result.get('url')
    if not video_url:
        print(f"[{name}-portrait] no video URL in response: {json.dumps(result)[:300]}", flush=True)
        return {'name': name, 'ok': False, 'error': 'no video url', 'response': result}

    target = OUTPUT_DIR / f"{name}-portrait.mp4"
    print(f"[{name}-portrait] downloading {video_url} → {target}", flush=True)
    try:
        with urllib.request.urlopen(video_url, timeout=120) as r, target.open('wb') as f:
            f.write(r.read())
    except Exception as exc:
        print(f"[{name}-portrait] download failed: {exc}", flush=True)
        return {'name': name, 'ok': False, 'error': f'download: {exc}', 'video_url': video_url}

    size = target.stat().st_size
    print(f"[{name}-portrait] saved {size / 1024 / 1024:.2f} MB", flush=True)
    return {'name': name, 'ok': True, 'file': str(target), 'size': size, 'video_url': video_url}


def main() -> int:
    os.environ['FAL_KEY'] = load_fal_key()
    print(f"FAL_KEY loaded ({len(os.environ['FAL_KEY'])} chars)")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    import fal_client

    results = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(render_scene, scene, fal_client_module=fal_client): scene['name'] for scene in SCENES}
        for fut in as_completed(futures):
            results.append(fut.result())

    print("\n--- summary (portrait) ---")
    ok = [r for r in results if r['ok']]
    fail = [r for r in results if not r['ok']]
    for r in ok:
        print(f"  ✓ {r['name']}-portrait  {r['size'] / 1024 / 1024:.2f} MB")
    for r in fail:
        print(f"  ✗ {r['name']}-portrait  {r.get('error')}")
    return 0 if not fail else 1


if __name__ == '__main__':
    sys.exit(main())
