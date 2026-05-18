#!/usr/bin/env python3
"""Generate a clear, readable 'quiet anchorage' photo for the About
page's "On any given night" SectionInterrupt via fal.ai FLUX 1.1 Pro.

Prior pick (harbor-sunset-moon-portrait.jpg, IG) reads as a murky
silhouette at full-bleed. Mark called out he can't make out what it
is. New version: an actual recognizable scene of a single anchored
catamaran in a sheltered cove at blue-hour with a visible moon —
clearly readable, still tranquil, still "night."
"""
from __future__ import annotations

import os
import pathlib
import re
import sys
import urllib.request

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / 'public' / 'img' / 'stock' / 'destinations'
ENDPOINT = 'fal-ai/flux-pro/v1.1'

FALLBACK_ENV_PATHS = [
    REPO_ROOT / '.env',
    pathlib.Path('/mnt/c/business-suite-portal/apps/api/.env'),
]


def _extract_fal_key(env_text: str) -> str | None:
    match = re.search(r'FAL_KEY="?([^"\n]+)"?', env_text)
    return match.group(1) if match else None


def load_fal_key() -> str:
    env_key = os.environ.get('FAL_KEY')
    if env_key:
        return env_key
    for path in FALLBACK_ENV_PATHS:
        if path.exists():
            key = _extract_fal_key(path.read_text())
            if key:
                return key
    print("ERROR: FAL_KEY not found", file=sys.stderr)
    sys.exit(1)


def main() -> int:
    os.environ['FAL_KEY'] = load_fal_key()
    print(f"FAL_KEY loaded ({len(os.environ['FAL_KEY'])} chars)")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    import fal_client

    prompt = (
        "Photorealistic editorial wide shot of a single white 50-foot "
        "sailing catamaran anchored alone in a sheltered Caribbean cove "
        "at the blue hour — about 25 minutes after sunset. The sky still "
        "carries warm pink and peach near the horizon transitioning up "
        "to deep teal blue overhead, with a clear full moon high in the "
        "upper-right of the frame. The catamaran sits in still mirror-"
        "flat water that perfectly reflects its hulls, sails furled, "
        "warm interior lights glowing softly from the salon windows and "
        "two amber-orange anchor lights at the bow and stern. A low "
        "wooded headland rises gently in the background on the left, "
        "silhouetted but still visible in the lingering light. No other "
        "boats, no buildings, no people. Empty horizon to the right "
        "with just a faint distant island. Wide aspect 16:9, cinematic "
        "Arri Alexa LF aesthetic, painterly color grade with rich teal "
        "shadows and warm gold accents from the moonlight and the "
        "interior glow. Black Tomato travel-brand photography. "
        "Hyper-detailed, peaceful, recognizable as 'a catamaran at "
        "anchor at twilight' on first look."
    )

    print("Submitting...", flush=True)
    result = fal_client.subscribe(
        ENDPOINT,
        arguments={
            'prompt': prompt,
            'image_size': 'landscape_16_9',
            'num_images': 1,
            'safety_tolerance': '5',
            'output_format': 'jpeg',
        },
        with_logs=False,
    )

    images = result.get('images') or []
    if not images:
        print("ERROR: no images", file=sys.stderr)
        return 1
    url = images[0].get('url')
    target = OUTPUT_DIR / 'quiet-anchorage-blue-hour-ai.jpg'
    print(f"Downloading {url}", flush=True)
    with urllib.request.urlopen(url, timeout=120) as r, target.open('wb') as f:
        f.write(r.read())
    size = target.stat().st_size
    print(f"Saved {target} ({size/1024:.0f}K)", flush=True)
    return 0


if __name__ == '__main__':
    sys.exit(main())
