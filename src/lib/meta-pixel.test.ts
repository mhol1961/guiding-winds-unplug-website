// Run: npm test
// Guards the Oct 2026 bug where MetaPixel.astro shipped its snippet as an inert
// string ({`...`} is not evaluated inside an is:inline script), so fbq never existed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../components/shared/MetaPixel.astro', import.meta.url), 'utf8');
const body = src.match(/<script is:inline[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';

test('Meta Pixel snippet runs: defines fbq and queues init + PageView', () => {
  const inserted: unknown[] = [];
  const el = { parentNode: { insertBefore: (n: unknown) => inserted.push(n) } };
  const window: Record<string, any> = {};
  const document = {
    createElement: () => ({}),
    getElementsByTagName: () => [el],
    addEventListener: () => {},
  };
  window.document = document;
  // define:vars wraps the body like this at build time.
  vm.runInNewContext(`(function(){const pixelId = "123";\n${body}\n})();`, { window, document, fbq: (...a: unknown[]) => window.fbq(...a) });
  assert.equal(typeof window.fbq, 'function', 'fbq was never defined: snippet did not run');
  // JSON copy: arrays made inside the vm belong to another realm.
  assert.deepEqual(JSON.parse(JSON.stringify(window.fbq.queue.map((a: unknown[]) => [...a]))), [['init', '123'], ['track', 'PageView']]);
  assert.equal(inserted.length, 1, 'fbevents.js was not inserted');
});
