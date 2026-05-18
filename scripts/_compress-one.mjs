#!/usr/bin/env node
import { execaSync } from 'execa';
import ffmpegPath from 'ffmpeg-static';
import { existsSync, renameSync, statSync, unlinkSync } from 'node:fs';
const inp = process.argv[2];
if (!inp || !existsSync(inp)) { console.error('source missing:', inp); process.exit(1); }
const tmp = inp.replace(/\.mp4$/, '.compressed.mp4');
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
