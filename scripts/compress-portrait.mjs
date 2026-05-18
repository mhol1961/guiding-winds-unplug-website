#!/usr/bin/env node
/**
 * Compress the 4 portrait hero MP4s rendered by
 * scripts/render-hero-videos-portrait.py using the project's
 * ffmpeg-static (vendored via npm) so we don't depend on a
 * system ffmpeg install.
 *
 * Targets: 1080 tall (portrait), CRF 27, faststart, no audio,
 * yuv420p, lanczos. File size goal: 1.5–3 MB each.
 *
 * Usage:
 *   node scripts/compress-portrait.mjs
 */
import { execaSync } from 'execa';
import ffmpegPath from 'ffmpeg-static';
import { existsSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HERO_DIR = resolve(__dirname, '..', 'public', 'media', 'hero');

const NAMES = [
  'hero-bvi-01-portrait',
  'hero-bahamas-02-portrait',
  'hero-greece-03-portrait',
  'hero-deck-04-portrait',
];

function compress(name) {
  const inp = join(HERO_DIR, `${name}.mp4`);
  const tmp = join(HERO_DIR, `${name}.compressed.mp4`);
  if (!existsSync(inp)) {
    console.log(`[${name}] skip — source not found`);
    return { name, ok: false, reason: 'missing source' };
  }
  const beforeMB = statSync(inp).size / 1024 / 1024;
  console.log(`[${name}] compressing (was ${beforeMB.toFixed(2)} MB)…`);
  try {
    execaSync(ffmpegPath, [
      '-y',
      '-i', inp,
      '-c:v', 'libx264',
      '-crf', '27',
      '-preset', 'medium',
      '-movflags', '+faststart',
      '-an',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=-2:1920:flags=lanczos',
      tmp,
    ], { stdio: 'inherit' });
  } catch (err) {
    console.error(`[${name}] ffmpeg failed:`, err.shortMessage || err.message);
    if (existsSync(tmp)) unlinkSync(tmp);
    return { name, ok: false, reason: 'ffmpeg failed' };
  }
  const afterMB = statSync(tmp).size / 1024 / 1024;
  renameSync(tmp, inp);
  console.log(`[${name}] done — ${beforeMB.toFixed(2)} MB → ${afterMB.toFixed(2)} MB`);
  return { name, ok: true, before: beforeMB, after: afterMB };
}

const results = NAMES.map(compress);
console.log('\n--- summary ---');
for (const r of results) {
  if (r.ok) {
    console.log(`  ok ${r.name}  ${r.before.toFixed(2)} → ${r.after.toFixed(2)} MB`);
  } else {
    console.log(`  -- ${r.name}  (${r.reason})`);
  }
}
