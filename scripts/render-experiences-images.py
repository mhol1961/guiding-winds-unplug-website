#!/usr/bin/env python3
"""Generate 3 AI images for the new /experiences page via fal.ai
FLUX 1.1 Pro:

  1. experiences-hero-ai.jpg — PageHero backdrop. Wide editorial
     shot blending wellness + the sea (cushion + tea on a teak deck
     at dawn, no people, ambient).
  2. spiritual-retreat-foredeck-ai.jpg — yoga / breath / meditation
     on the foredeck at sunrise, glassy water, no faces (silhouette
     or rear view if a person is included).
  3. fishing-blue-water-ai.jpg — sport-fishing rod arc, deep blue
     Caribbean water, a hooked-fish splash off the stern.
"""
from __future__ import annotations

import os
import pathlib
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / 'public' / 'img' / 'stock' / 'experiences'
ENDPOINT = 'fal-ai/flux-pro/v1.1'
FALLBACK_ENV_PATHS = [
    REPO_ROOT / '.env',
    pathlib.Path('/mnt/c/business-suite-portal/apps/api/.env'),
]

SCENES = [
    {
        'name': 'experiences-hero-ai',
        'prompt': (
            "Photorealistic editorial wide shot of the teak aft deck of a "
            "50-foot white sailing catamaran at first light. A single "
            "cream linen meditation cushion sits centered on the polished "
            "teak. A small ceramic teapot and one matching cup beside it, "
            "wisps of steam rising. A folded woven blanket and a small "
            "stack of two paperbacks. The boat is anchored alone in glassy "
            "turquoise Caribbean water, no other vessels in sight. Soft "
            "peach-and-gold dawn sky transitioning to clear pale blue "
            "overhead. A distant green Caribbean headland silhouetted on "
            "the horizon. Warm directional sidelight from the rising sun "
            "casting long shadows across the teak. Subtle anamorphic lens "
            "flare top-right. No people visible. Painterly color grade, "
            "Black Tomato travel-brand cinematography, Arri Alexa LF "
            "aesthetic. Aspect 16:9 wide hero composition with the deck "
            "occupying the lower two-thirds and the dawn sky/water filling "
            "the upper third — leaves room overhead for a headline overlay."
        ),
    },
    {
        'name': 'spiritual-retreat-foredeck-ai',
        'prompt': (
            "Photorealistic editorial wide shot of the foredeck trampoline "
            "area of a white sailing catamaran at sunrise. A single "
            "rolled-out cork yoga mat is laid lengthwise across the "
            "starboard trampoline. A small bowl, a singing bowl mallet, "
            "and a folded throw at the head of the mat. The boat sits at "
            "anchor in glassy mirror-flat aquamarine water reflecting "
            "soft pink and peach dawn clouds. Distant green Caribbean "
            "headland on the left, empty water to the horizon on the "
            "right. Warm low side-light from the rising sun casting long "
            "shadows. Subtle anamorphic lens flare. No people visible. "
            "Painterly color grade, warm gold highlights, deep teal "
            "shadows. Black Tomato travel-brand cinematography, Arri "
            "Alexa LF look. Aspect 16:9, peaceful contemplative mood."
        ),
    },
    {
        'name': 'fishing-blue-water-ai',
        'prompt': (
            "Photorealistic editorial wide shot of the stern of a white "
            "sailing catamaran sport-fishing in deep cobalt-blue "
            "Caribbean offshore water. A single graphite trolling rod "
            "arcs hard from a polished stainless rod holder mounted on "
            "the stern rail, line angled down-and-back into the wake. "
            "The water boils 30 feet behind the boat where a hooked "
            "fish has just made a run — a flash of silver and white "
            "froth visible at the surface. White hull, polished gunwale, "
            "empty fighting chair on the right corner of the deck. Mid-"
            "afternoon Caribbean sun high and behind the camera, casting "
            "sharp directional light across the wake and the deck. Sky "
            "is clear deep blue with a few scattered trade-wind cumulus "
            "clouds at the horizon. No people visible. Painterly color "
            "grade with rich teal-and-orange Hollywood tones, Arri Alexa "
            "LF aesthetic, Black Tomato travel-brand photography. Aspect "
            "16:9 wide composition emphasizing the angled rod and the "
            "active strike in the wake."
        ),
    },
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


def render_one(scene: dict, *, fal_client_module) -> dict:
    name = scene['name']
    print(f"[{name}] submitting…", flush=True)
    try:
        result = fal_client_module.subscribe(
            ENDPOINT,
            arguments={
                'prompt': scene['prompt'],
                'image_size': 'landscape_16_9',
                'num_images': 1,
                'safety_tolerance': '5',
                'output_format': 'jpeg',
            },
            with_logs=False,
        )
    except Exception as exc:
        return {'name': name, 'ok': False, 'error': str(exc)}
    images = result.get('images') or []
    if not images:
        return {'name': name, 'ok': False, 'error': 'no images'}
    url = images[0].get('url')
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    target = OUTPUT_DIR / f"{name}.jpg"
    print(f"[{name}] downloading {url}", flush=True)
    with urllib.request.urlopen(url, timeout=120) as r, target.open('wb') as f:
        f.write(r.read())
    return {'name': name, 'ok': True, 'file': str(target), 'size': target.stat().st_size}


def main() -> int:
    os.environ['FAL_KEY'] = load_fal_key()
    print(f"FAL_KEY loaded ({len(os.environ['FAL_KEY'])} chars)")
    import fal_client
    results = []
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = {pool.submit(render_one, s, fal_client_module=fal_client): s['name'] for s in SCENES}
        for fut in as_completed(futures):
            results.append(fut.result())
    print("\n--- summary ---")
    fail = [r for r in results if not r['ok']]
    for r in results:
        if r['ok']:
            print(f"  ✓ {r['name']}  {r['size']/1024:.0f}K")
        else:
            print(f"  ✗ {r['name']}  {r.get('error')}")
    return 0 if not fail else 1


if __name__ == '__main__':
    sys.exit(main())
