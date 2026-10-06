// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalRedirect, canonicalPath, securityHeaders, CSP } from './edge.ts';

const A = 'https://guidingwinds-unplug.com';

test('canonical URLs pass through untouched', () => {
  for (const u of [`${A}/`, `${A}/about`, `${A}/voyages/croatia`, `${A}/lp-2?utm_source=fb&fbclid=x`, `${A}/_astro/a.js`, 'http://localhost:4321/about/']) {
    if (u.startsWith('http://localhost')) continue;
    assert.equal(canonicalRedirect(u), null, u);
  }
});

test('http, www, trailing slash and .html all go to one canonical URL, keeping the query', () => {
  const cases: [string, string][] = [
    ['http://guidingwinds-unplug.com/', `${A}/`],
    ['http://www.guidingwinds-unplug.com/about/', `${A}/about`],
    ['https://www.guidingwinds-unplug.com/lp-1?utm_source=facebook&utm_campaign=bvi', `${A}/lp-1?utm_source=facebook&utm_campaign=bvi`],
    [`${A}/lp-2/?utm_source=fb&fbclid=abc`, `${A}/lp-2?utm_source=fb&fbclid=abc`],
    [`${A}/voyages/croatia/`, `${A}/voyages/croatia`],
    [`${A}/about.html`, `${A}/about`],
    [`${A}/voyages/index.html`, `${A}/voyages`],
    [`${A}/index.html`, `${A}/`],
    [`${A}/about//`, `${A}/about`],
  ];
  for (const [from, to] of cases) assert.equal(canonicalRedirect(from), to, from);
});

test('local dev keeps its host and scheme; only the path is normalised', () => {
  assert.equal(canonicalRedirect('http://localhost:8787/about'), null);
  assert.equal(canonicalRedirect('http://localhost:8787/about/'), 'http://localhost:8787/about');
});

test('security headers: newsletter media is cross-origin, everything else same-site; Meta off without a Pixel ID', () => {
  assert.equal(securityHeaders('/newsletter/2026-10-croatia/x.jpg')['Cross-Origin-Resource-Policy'], 'cross-origin');
  assert.equal(securityHeaders('/about')['Cross-Origin-Resource-Policy'], 'same-site');
  assert.match(securityHeaders('/')['Strict-Transport-Security'], /max-age=63072000/);
  assert.ok(!CSP.includes('facebook') && !CSP.includes('plausible'));
  assert.ok(CSP.includes("frame-ancestors 'none'") && CSP.includes('https://static.cloudflareinsights.com'));
});

test('canonicalPath: file paths of prerendered pages map to their public URL', () => {
  assert.equal(canonicalPath('/index.html'), '/');
  assert.equal(canonicalPath('/about.html'), '/about');
  assert.equal(canonicalPath('/voyages/croatia.html'), '/voyages/croatia');
  assert.equal(canonicalPath('/voyages/index.html'), '/voyages');
  assert.equal(canonicalPath('/inquire/thank-you'), '/inquire/thank-you');
  assert.equal(canonicalPath('/'), '/');
});
