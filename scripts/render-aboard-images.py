#!/usr/bin/env python3
"""Generate 2 catamaran interior images for the Aboard page via fal.ai
FLUX 1.1 Pro. Codex flagged the existing boat-salon-01.jpg and
boat-cabin-03.jpg as model-ship-toy close-ups (mismatched with the
"premium yacht interior" intent of the section), and Mark called out
that salon + cabins use the same image.

Output: public/img/stock/boat/boat-salon-ai.jpg + boat-cabin-ai.jpg
"""
from __future__ import annotations

import os
import pathlib
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / 'public' / 'img' / 'stock' / 'boat'
ENDPOINT = 'fal-ai/flux-pro/v1.1'

FALLBACK_ENV_PATHS = [
    REPO_ROOT / '.env',
    pathlib.Path('/mnt/c/business-suite-portal/apps/api/.env'),
]

SCENES = [
    {
        'name': 'boat-salon-ai',
        'prompt': (
            "Photorealistic editorial interior of a luxury sailing catamaran's "
            "main salon at golden hour. Wide low-angle shot, eye-level. "
            "Wraparound cream leather bench seating along three walls, a long "
            "varnished teak dining table with eight place settings, warm "
            "natural light streaming through tall surrounding windows showing "
            "turquoise Caribbean water and a distant green headland outside. "
            "Open helm controls visible at the forward end, navigation chart "
            "on the table, two crystal wine glasses, a small bouquet in the "
            "center. Dark teak floor, brass fittings, white headliner. Subtle "
            "afternoon shadows, cinematic color grade with warm highlights "
            "and deep teal blues. Black Tomato travel-brand photography "
            "aesthetic. No people visible. Aspect 16:9 horizontal, hyper-"
            "detailed, Canon R5 with 24mm lens look."
        ),
    },
    {
        'name': 'boat-cabin-ai',
        'prompt': (
            "Photorealistic editorial interior of an ensuite queen cabin in a "
            "luxury sailing catamaran at midday. Wide shot of a perfectly "
            "made queen bed with crisp white linens and a folded throw at "
            "the foot, set against a curved varnished teak headboard. A "
            "large overhead deck hatch above the bed admits bright natural "
            "light from a clear blue sky visible through the glass, casting "
            "soft rectangles on the linens. Small varnished side cabinet "
            "with a stainless reading lamp and a paperback novel. White "
            "headliner, cream cushioned banquette under a porthole on the "
            "left wall showing a sliver of turquoise water outside. Polished "
            "teak floor. Open doorway on the right reveals a glimpse of a "
            "white ensuite bathroom. Warm afternoon light, peaceful, "
            "uncluttered, premium yacht charter aesthetic. Black Tomato "
            "travel-brand photography. No people visible. Aspect 16:9 "
            "horizontal, hyper-detailed, Canon R5 with 24mm lens look."
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
        print(f"[{name}] ERROR: {exc}", flush=True)
        return {'name': name, 'ok': False, 'error': str(exc)}

    images = result.get('images') or []
    if not images:
        return {'name': name, 'ok': False, 'error': 'no images in response'}
    url = images[0].get('url')
    if not url:
        return {'name': name, 'ok': False, 'error': 'no url in image'}

    target = OUTPUT_DIR / f"{name}.jpg"
    print(f"[{name}] downloading {url}", flush=True)
    try:
        with urllib.request.urlopen(url, timeout=120) as r, target.open('wb') as f:
            f.write(r.read())
    except Exception as exc:
        return {'name': name, 'ok': False, 'error': f'download: {exc}'}

    size = target.stat().st_size
    print(f"[{name}] saved {size/1024:.0f}K", flush=True)
    return {'name': name, 'ok': True, 'file': str(target), 'size': size}


def main() -> int:
    os.environ['FAL_KEY'] = load_fal_key()
    print(f"FAL_KEY loaded ({len(os.environ['FAL_KEY'])} chars)")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

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
