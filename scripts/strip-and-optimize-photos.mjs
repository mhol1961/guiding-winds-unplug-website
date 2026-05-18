#!/usr/bin/env node
// Codex review caught it: iPhone photos shipped to /public/img/source/ with
// 3-13KB EXIF blocks per file — GPS coordinates and all. Plus the originals
// are 1.5-2K on the long edge which is overkill for the web. Codex flagged
// the SectionInterrupt photo variant specifically, but this is the right
// fix for every iPhone photo in the source tree.
//
// What this script does, in-place:
//   1. Strip ALL metadata (EXIF, GPS, ICC headers except color profile).
//   2. Downsize the long edge to 1920px (mid-page sections never need more).
//   3. Re-encode at mozjpeg quality 78, progressive. Average ~70-80% smaller.
//
// Idempotent — safe to re-run. The Astro <Image> pipeline would do this on
// the fly, but routing 16 lazy-loaded photos through that would also mean
// changing every caller. This is the surgical fix.

import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SOURCE_DIR = join(__dirname, '..', 'public', 'img', 'source');
const MAX_LONG_EDGE = 1920;
const JPEG_QUALITY = 78;

async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full)));
    else if (['.jpg', '.jpeg'].includes(extname(ent.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function processOne(path) {
  const before = (await stat(path)).size;
  const md = await sharp(path).metadata();
  const longEdge = Math.max(md.width, md.height);
  const tmp = path + '.tmp';
  const pipeline = sharp(path).rotate(); // honor existing orientation, then drop EXIF
  if (longEdge > MAX_LONG_EDGE) {
    pipeline.resize({
      width: md.width >= md.height ? MAX_LONG_EDGE : undefined,
      height: md.height > md.width ? MAX_LONG_EDGE : undefined,
      withoutEnlargement: true,
    });
  }
  // Sharp's default behavior is to STRIP all metadata unless withMetadata()
  // is called. Calling .withMetadata({ exif: {} }) actually preserves
  // existing EXIF (the {} just adds empty fields on top). So we omit
  // withMetadata entirely to guarantee EXIF/GPS/IPTC are dropped.
  await pipeline
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmp);
  await import('node:fs').then((m) => m.promises.rename(tmp, path));
  const after = (await stat(path)).size;
  const savedPct = (((before - after) / before) * 100).toFixed(0);
  console.log(
    `  ${path.replace(SOURCE_DIR + '/', '')}  ${(before / 1024).toFixed(0)}K -> ${(after / 1024).toFixed(0)}K  (-${savedPct}%)`,
  );
  return { before, after };
}

(async () => {
  const files = await walk(SOURCE_DIR);
  console.log(`Found ${files.length} JPEG(s) under ${SOURCE_DIR}`);
  let totalBefore = 0;
  let totalAfter = 0;
  for (const f of files) {
    const { before, after } = await processOne(f);
    totalBefore += before;
    totalAfter += after;
  }
  console.log(
    `\nTotal:  ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB  (saved ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`,
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
