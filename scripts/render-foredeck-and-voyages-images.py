#!/usr/bin/env python3
"""Generate 2 AI images via fal.ai FLUX 1.1 Pro:

  1. boat-foredeck-trampoline-ai.jpg — replaces Plate 04 on /aboard.
     The current photo (foredeck-bow-trampoline-sun-flare-01.jpg) is
     someone else, not Clint and Dodie — Clint asked for it removed.
  2. voyages-hub-pick-the-water-ai.jpg — replaces the centered "Pick
     the water" hero on /voyages. Same source photo, also flagged.

Both photo-realistic, golden-hour, no people visible, Black Tomato
travel-brand aesthetic.
"""
from __future__ import annotations

import os
import pathlib
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
ENDPOINT = 'fal-ai/flux-pro/v1.1'
FALLBACK_ENV_PATHS = [
    REPO_ROOT / '.env',
    pathlib.Path('/mnt/c/business-suite-portal/apps/api/.env'),
]

SCENES = [
    {
        'name': 'boat-foredeck-trampoline-ai',
        'output_dir': REPO_ROOT / 'public' / 'img' / 'stock' / 'boat',
        'prompt': (
            "Photorealistic editorial wide shot of the foredeck trampoline "
            "of a 50-foot white sailing catamaran at late golden hour. "
            "Camera positioned low at deck level looking forward over the "
            "twin black mesh trampolines stretched between the bows, "
            "polished white anchor windlass and chain at center, twin "
            "fiberglass hulls cutting forward into glassy turquoise water "
            "beyond. Anamorphic sun flare blooming in from the upper-right "
            "as the sun sits low behind the rigging, casting warm amber "
            "light across the trampoline mesh and the white fiberglass. "
            "Three folded teak cushions in soft cream linen scattered on "
            "the starboard trampoline suggesting the recently-vacated "
            "lounging spot. Distant green Caribbean headland in the upper "
            "third of the frame. Anchor line vanishing into the clear "
            "shallow water below. Painterly color grade with deep teal "
            "shadows and warm gold highlights. Wide 16:9 aspect, Arri "
            "Alexa LF aesthetic. No people visible. Black Tomato travel-"
            "brand cinematography."
        ),
    },
    {
        'name': 'voyages-hub-pick-the-water-ai',
        'output_dir': REPO_ROOT / 'public' / 'img' / 'stock' / 'voyages',
        'prompt': (
            "Photorealistic editorial wide shot from the bow of a 50-foot "
            "white sailing catamaran heading toward open Caribbean horizon "
            "at golden hour. Camera positioned just behind the foredeck "
            "looking forward over the bow trampolines and pulpit, the twin "
            "white hulls cutting clean lines through turquoise water with "
            "small frothing wakes. Open empty horizon ahead with one tiny "
            "distant island silhouetted on the right and nothing on the "
            "left — vast tranquil sea. Late afternoon sun low and behind "
            "the camera casting long warm shadows across the deck. Sky "
            "shading from warm peach near the horizon up through soft "
            "gold to clear deep blue overhead. Subtle anamorphic lens "
            "flare top-right. Sails not visible from this angle (furled "
            "above frame). Painterly color grade, Black Tomato travel-"
            "brand cinematography, hyper-detailed Arri Alexa LF look. No "
            "people visible. Aspect 16:9 wide hero composition with the "
            "deck/bow occupying the lower third and horizon/sky filling "
            "the upper two-thirds — gives the headline overlay plenty of "
            "tranquil sky room above the deck line."
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
    out_dir = scene['output_dir']
    out_dir.mkdir(parents=True, exist_ok=True)
    target = out_dir / f"{name}.jpg"
    print(f"[{name}] downloading {url}", flush=True)
    with urllib.request.urlopen(url, timeout=120) as r, target.open('wb') as f:
        f.write(r.read())
    size = target.stat().st_size
    print(f"[{name}] saved {size/1024:.0f}K", flush=True)
    return {'name': name, 'ok': True, 'file': str(target), 'size': size}


def main() -> int:
    os.environ['FAL_KEY'] = load_fal_key()
    print(f"FAL_KEY loaded ({len(os.environ['FAL_KEY'])} chars)")
    import fal_client
    results = []
    with ThreadPoolExecutor(max_workers=2) as pool:
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
