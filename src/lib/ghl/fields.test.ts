// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toIdFields, blankOnly } from './fields.ts';

const ids = new Map([['utm_source', 'A'], ['fbclid', 'B'], ['party_size', 'C']]);

test('toIdFields maps known keys to ids and drops blanks and unknown keys', (t) => {
  t.mock.method(console, 'warn', () => {});
  assert.deepEqual(
    toIdFields([{ key: 'utm_source', field_value: 'facebook' }, { key: 'fbclid', field_value: '' }, { key: 'nope', field_value: 'x' }, { key: 'party_size', field_value: '4' }], ids),
    [{ id: 'A', field_value: 'facebook' }, { id: 'C', field_value: '4' }],
  );
});

test('blankOnly keeps only fields the contact has no value for (first touch wins)', () => {
  const fields = [{ id: 'A', field_value: 'google' }, { id: 'B', field_value: 'IwAR' }];
  assert.deepEqual(blankOnly(fields, [{ id: 'A', value: 'facebook' }, { id: 'B', value: '' }]), [{ id: 'B', field_value: 'IwAR' }]);
  assert.deepEqual(blankOnly(fields, []), fields);
});
