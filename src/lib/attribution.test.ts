// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickAttribution, isMetaAd } from './attribution.ts';

test('pickAttribution keeps only the six known keys, trimmed and capped, dropping blanks and non-strings', () => {
  const a = pickAttribution({
    utm_source: ' facebook ', utm_medium: 'paid_social', utm_campaign: 'x'.repeat(400),
    utm_content: '', utm_term: 42, fbclid: 'IwAR123', email: 'not-attribution@example.org',
  });
  assert.deepEqual(Object.keys(a).sort(), ['fbclid', 'utm_campaign', 'utm_medium', 'utm_source']);
  assert.equal(a.utm_source, 'facebook');
  assert.equal(a.utm_campaign?.length, 300);
});

test('isMetaAd: fbclid or a Meta utm_source', () => {
  assert.equal(isMetaAd({ fbclid: 'x' }), true);
  assert.equal(isMetaAd({ utm_source: 'Instagram' }), true);
  assert.equal(isMetaAd({ utm_source: 'fb' }), true);
  assert.equal(isMetaAd({ utm_source: 'google' }), false);
  assert.equal(isMetaAd({}), false);
});
