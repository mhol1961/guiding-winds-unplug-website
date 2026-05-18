#!/usr/bin/env python3
"""Render the establishing video for the "The Boat" section of about.astro
via fal.ai Seedance v1 Pro (text-to-video). One 16:9 1080p clip of a
Lagoon 50 catamaran at anchor with cinematic dolly motion, no people.

Run from project root:
    python3 scripts/render-about-boat-video.py

FAL_KEY resolution mirrors render-hero-videos-portrait.py: env, --env-file,
repo .env, then the shared fallback at
/mnt/c/business-suite-portal/apps/api/.env.

Cost: roughly $1 for the single 5-second 1080p Seedance v1 Pro clip.
After render, compress with ffmpeg-static (CRF 27, no audio, 1080-tall)
to keep the payload under 3 MB for hero-section use.
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.request

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / 'public' / 'media' / 'about'
ENDPOINT = 'fal-ai/bytedance/seedance/v1/pro/text-to-video'

FALLBACK_ENV_PATHS = [
    REPO_ROOT / '.env',
    pathlib.Path('/mnt/c/business-suite-portal/apps/api/.env'),
]

SCENE = {
    'name': 'boat-lagoon50-establishing',
    'prompt': (
        "Slow cinematic dolly-in from 60 feet alongside a 50-foot white "
        "Lagoon catamaran at anchor in turquoise Caribbean water, late "
        "afternoon golden hour, sun low behind the camera. Twin hulls "
        "slicing clean shadows on white sand visible beneath the shallow "
        "water. Sails furled tight, mast vertical, hull paint clean and "
        "sun-lit. Camera tracks alongside the starboard hull at deck height, "
        "revealing the foredeck trampoline and the cockpit aft. Calm "
        "Bahamas-blue water, no waves, only ripples. Wide aspect 16:9, "
        "photorealistic, Arri Alexa LF cinematography, Black Tomato "
        "travel-brand color grade, painterly warm highlights and deep teal "
        "shadows. No people visible."
    ),
}


def _extract_fal_key(env_text: str) -> str | None:
    match = re.search(r'FAL_KEY="?([^"\n]+)"?', env_text)
    return match.group(1) if match else None


def load_fal_key(cli_env_path: pathlib.Path | None = None) -> str:
    env_key = os.environ.get('FAL_KEY')
    if env_key:
        return env_key

    search_paths: list[pathlib.Path] = []
    if cli_env_path is not None:
        search_paths.append(cli_env_path)
    search_paths.extend(FALLBACK_ENV_PATHS)

    for path in search_paths:
        if path.exists():
            key = _extract_fal_key(path.read_text())
            if key:
                return key

    tried = '\n  '.join(str(p) for p in search_paths)
    print(
        "ERROR: FAL_KEY not set in environment and not found in any .env file.\n"
        f"Tried:\n  {tried}\n"
        "Set FAL_KEY=... in your shell, drop a .env at the repo root, "
        "or pass --env-file <path>.",
        file=sys.stderr,
    )
    sys.exit(1)


def render_scene(scene: dict, *, fal_client_module) -> dict:
    name = scene['name']
    print(f"[{name}] submitting to {ENDPOINT}…", flush=True)
    try:
        result = fal_client_module.subscribe(
            ENDPOINT,
            arguments={
                'prompt': scene['prompt'],
                'aspect_ratio': '16:9',
                'duration': '5',  # Seedance v1 pro accepts 5 or 10 seconds
                'resolution': '1080p',
            },
            with_logs=False,
        )
    except Exception as exc:
        print(f"[{name}] ERROR: {exc}", flush=True)
        return {'name': name, 'ok': False, 'error': str(exc)}

    video_url = (result.get('video') or {}).get('url') or result.get('url')
    if not video_url:
        print(f"[{name}] no video URL in response: {json.dumps(result)[:300]}", flush=True)
        return {'name': name, 'ok': False, 'error': 'no video url', 'response': result}

    target = OUTPUT_DIR / f"{name}.mp4"
    print(f"[{name}] downloading {video_url} -> {target}", flush=True)
    try:
        with urllib.request.urlopen(video_url, timeout=180) as r, target.open('wb') as f:
            f.write(r.read())
    except Exception as exc:
        print(f"[{name}] download failed: {exc}", flush=True)
        return {'name': name, 'ok': False, 'error': f'download: {exc}', 'video_url': video_url}

    size = target.stat().st_size
    print(f"[{name}] saved {size / 1024 / 1024:.2f} MB", flush=True)
    return {'name': name, 'ok': True, 'file': str(target), 'size': size, 'video_url': video_url}


def compress_with_ffmpeg(path: pathlib.Path) -> dict:
    """Compress in-place using project-vendored ffmpeg-static via Node helper."""
    helper = REPO_ROOT / 'scripts' / '_compress-one.mjs'
    if not helper.exists():
        helper.write_text(
            """#!/usr/bin/env node
import { execaSync } from 'execa';
import ffmpegPath from 'ffmpeg-static';
import { existsSync, renameSync, statSync, unlinkSync } from 'node:fs';
const inp = process.argv[2];
if (!inp || !existsSync(inp)) { console.error('source missing:', inp); process.exit(1); }
const tmp = inp.replace(/\\.mp4$/, '.compressed.mp4');
const beforeMB = statSync(inp).size / 1024 / 1024;
console.log(`compressing (was ${beforeMB.toFixed(2)} MB)…`);
try {
  execaSync(ffmpegPath, [
    '-y', '-i', inp,
    '-c:v', 'libx264', '-crf', '27', '-preset', 'medium',
    '-movflags', '+faststart', '-an', '-pix_fmt', 'yuv420p',
    '-vf', 'scale=-2:1080:flags=lanczos',
    tmp,
  ], { stdio: 'inherit' });
} catch (err) {
  console.error('ffmpeg failed:', err.shortMessage || err.message);
  if (existsSync(tmp)) unlinkSync(tmp);
  process.exit(1);
}
const afterMB = statSync(tmp).size / 1024 / 1024;
renameSync(tmp, inp);
console.log(`done — ${beforeMB.toFixed(2)} MB -> ${afterMB.toFixed(2)} MB`);
"""
        )
    try:
        subprocess.run(['node', str(helper), str(path)], check=True, cwd=str(REPO_ROOT))
        return {'ok': True, 'size': path.stat().st_size}
    except subprocess.CalledProcessError as exc:
        return {'ok': False, 'error': str(exc)}


def main() -> int:
    cli_env: pathlib.Path | None = None
    args = sys.argv[1:]
    if '--env-file' in args:
        idx = args.index('--env-file')
        if idx + 1 < len(args):
            cli_env = pathlib.Path(args[idx + 1]).expanduser().resolve()

    os.environ['FAL_KEY'] = load_fal_key(cli_env)
    print(f"FAL_KEY loaded ({len(os.environ['FAL_KEY'])} chars)")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    import fal_client

    result = render_scene(SCENE, fal_client_module=fal_client)
    if not result['ok']:
        print(f"\nRender failed: {result.get('error')}")
        return 1

    print("\n--- compressing ---")
    target = pathlib.Path(result['file'])
    comp = compress_with_ffmpeg(target)
    if comp['ok']:
        print(f"compressed: {comp['size'] / 1024 / 1024:.2f} MB")
    else:
        print(f"compression skipped/failed: {comp.get('error')}")

    print("\n--- summary ---")
    print(f"  ok {SCENE['name']}  {target.stat().st_size / 1024 / 1024:.2f} MB")
    return 0


if __name__ == '__main__':
    sys.exit(main())
