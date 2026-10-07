// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SELLER_OF_TRAVEL_DISCLOSURE } from './business.ts';

test('Seller of Travel disclosure is the exact sentence Fla. Stat. 559.928(5) requires', () => {
  assert.equal(
    SELLER_OF_TRAVEL_DISCLOSURE,
    'Guiding Winds Unplug LLC is registered with the State of Florida as a Seller of Travel. Registration No. ST150174.',
  );
});
