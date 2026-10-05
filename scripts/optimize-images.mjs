// Make small WebP copies of every photo the site references, at 480/960/1200/1600px
// wide (never upscaled), plus a manifest the img() helper reads for srcset and
// width/height. Run after adding or replacing a photo:  npm run images
// Outputs sit next to the original: /img/x.jpg -> /img/x-480.webp, -960, -1600.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const WIDTHS = [480, 960, 1200, 1600];
const SKIP_BELOW = 40 * 1024; // tiny files gain nothing
const BUDGET = 250 * 1024; // per file; quality steps down until it fits (floor 40)

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)],
  );
}

// Every /img/... or /welcome-poster.jpg path mentioned in src/.
const refs = new Set();
// The journal is unpublished (src/pages/_journal), so its photos are skipped.
for (const f of walk('src').filter((f) => /\.(astro|ts|md|json|mjs)$/.test(f) && !f.endsWith('image-variants.json') && !/journal/.test(f))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\/(?:img\/[^\s,}'"`)]+|welcome-poster)\.(?:jpe?g|png|webp)/gi)) refs.add(m[0]);
}

mkdirSync('public/og', { recursive: true });
const manifest = {};
for (const ref of [...refs].sort()) {
  const file = join('public', ref);
  if (!existsSync(file) || statSync(file).size < SKIP_BELOW) continue;
  const { width: w, height: h } = await sharp(file).metadata();
  const widths = WIDTHS.filter((x) => x < w);
  if (w <= WIDTHS.at(-1)) widths.push(w);
  for (const width of widths) {
    const out = file.slice(0, -extname(file).length) + `-${width}.webp`;
    if (existsSync(out) && statSync(out).mtimeMs > statSync(file).mtimeMs) continue;
    let buf;
    for (let q = 72; ; q -= 8) {
      buf = await sharp(file).resize({ width }).webp({ quality: q, effort: 5 }).toBuffer();
      if (buf.length <= BUDGET || q <= 40) break;
    }
    writeFileSync(out, buf);
  }
  manifest[ref] = { w, h, widths };
}
writeFileSync('src/lib/image-variants.json', JSON.stringify(manifest, null, 1) + '\n');

// Share images (og:image): 1200x630 JPEG crops of each voyage hero and ad
// page hero. public/og/default.jpg (the branded fallback) is made by hand.
const SHARE = {
  'lp-1': '/img/stock/hero/hero-bvi-catamaran-turquoise-01.jpg',
  'lp-2': '/img/source/hero/02-sunset-catamaran-anchorage.jpg',
  'lp-3': '/img/source/destinations/catamaran-anchored-green-headland-01.jpg',
};
for (const f of walk('src/content/voyages').filter((f) => f.endsWith('.md') && !f.endsWith('CLAUDE.md'))) {
  const md = readFileSync(f, 'utf8');
  const slug = md.match(/^slug:\s*(\S+)/m)?.[1];
  const hero = md.match(/^heroImage:\s*(\S+)/m)?.[1];
  if (slug && hero) SHARE[slug] = hero;
}
for (const [name, src] of Object.entries(SHARE)) {
  await sharp(join('public', src)).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 80, mozjpeg: true }).toFile(join('public/og', `${name}.jpg`));
}
console.log(`${Object.keys(SHARE).length} share images written to public/og/`);
console.log(`${Object.keys(manifest).length} images, manifest written`);
