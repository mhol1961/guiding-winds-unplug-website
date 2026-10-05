// Responsive attributes for a photo in public/: a WebP srcset from
// scripts/optimize-images.mjs plus its intrinsic width/height (no layout
// shift). Paths without variants (svg, small files) pass through unchanged.
import manifest from './image-variants.json';

const M = manifest as Record<string, { w: number; h: number; widths: number[] }>;
const variant = (src: string, w: number) => src.replace(/\.(jpe?g|png|webp)$/i, `-${w}.webp`);

export function img(src: string, sizes = '100vw') {
  const e = M[src];
  if (!e) return { src };
  return {
    src: variant(src, e.widths.at(-1)!),
    srcset: e.widths.map((w) => `${variant(src, w)} ${w}w`).join(', '),
    sizes,
    width: e.w,
    height: e.h,
  };
}
