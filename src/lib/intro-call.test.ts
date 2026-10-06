// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toDays, isOffered, matchesAppointment } from './intro-call.ts';

const res = {
  '2026-10-07': { slots: ['2026-10-07T08:00:00-04:00', '2026-10-07T08:30:00-04:00'] },
  '2026-10-06': { slots: ['2026-10-06T09:00:00-04:00'] },
  '2026-10-08': { slots: [] },
  traceId: 'abc',
};

test('toDays keeps real dates with slots, sorted, and drops traceId/empty days', () => {
  assert.deepEqual(toDays(res).map((d) => [d.date, d.slots.length]), [['2026-10-06', 1], ['2026-10-07', 2]]);
});

test('isOffered accepts an offered slot in any timezone notation, rejects anything else', () => {
  const days = toDays(res);
  assert.equal(isOffered(days, '2026-10-07T12:30:00Z'), true); // = 08:30 -04:00
  assert.equal(isOffered(days, '2026-10-07T12:45:00Z'), false);
  assert.equal(isOffered(days, 'not-a-date'), false);
});

test('matchesAppointment finds only this contact at this exact start (lost-response reconcile)', () => {
  const start = new Date('2026-10-07T12:30:00Z');
  const events = [
    { contactId: 'other', startTime: '2026-10-07T08:30:00-04:00' },
    { contactId: 'me', startTime: '2026-10-07T09:00:00-04:00' },
  ];
  assert.equal(matchesAppointment(events, 'me', start), false);
  assert.equal(matchesAppointment([...events, { contactId: 'me', startTime: '2026-10-07T08:30:00-04:00' }], 'me', start), true);
});
