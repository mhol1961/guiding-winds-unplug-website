// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as business from './business.ts';
const { SELLER_OF_TRAVEL_DISCLOSURE } = business;

test('Seller of Travel disclosure is the exact sentence Fla. Stat. 559.928(5) requires', () => {
  assert.equal(
    SELLER_OF_TRAVEL_DISCLOSURE,
    'Guiding Winds Unplug LLC is registered with the State of Florida as a Seller of Travel. Registration No. ST150174.',
  );
});

test('no shared wording promises a refund from us (owners, 29 Oct 2026)', () => {
  const text = JSON.stringify(business).toLowerCase();
  for (const banned of ['full refund', 'refund guaranteed', 'up to 12', '\u2014', '\u2013']) {
    assert.ok(!text.includes(banned), `business.ts must not say "${banned}"`);
  }
});
