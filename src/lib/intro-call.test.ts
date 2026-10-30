// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toDays, isOffered, matchesAppointment, shortCache } from './intro-call.ts';

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

test('shortCache: one load per window, shared while in flight, failures not kept', async () => {
  let t = 0, calls = 0, fail = false;
  const c = shortCache(60_000, async () => { calls++; if (fail) throw new Error('x'); return calls; }, () => t);
  assert.deepEqual(await Promise.all([c.get(), c.get()]), [1, 1]);
  t = 59_999; assert.equal(await c.get(), 1);
  t = 60_000; assert.equal(await c.get(), 2);
  c.clear(); fail = true; await assert.rejects(c.get());
  fail = false; assert.equal(await c.get(), 4);
  assert.equal(c.fresh(), true);
});

test('shortCache: a slow load is never re-fired, and its TTL starts when it resolves', async () => {
  let t = 0, calls = 0, release!: (v: number) => void;
  const c = shortCache(60_000, () => { calls++; return new Promise<number>((r) => { release = r; }); }, () => t);
  const first = c.get();
  t = 120_000; // GHL still hasn't answered, two TTLs later
  assert.equal(c.fresh(), true);
  const second = c.get();
  assert.equal(calls, 1);
  release(7);
  assert.deepEqual(await Promise.all([first, second]), [7, 7]);
  t = 179_999; assert.equal(await c.get(), 7); // 60 s from resolve, not from start
  assert.equal(calls, 1);
});

test('shortCache: a load in flight when clear() runs is not saved', async () => {
  let calls = 0, release!: (v: number) => void;
  const c = shortCache(60_000, () => { calls++; return new Promise<number>((r) => { release = r; }); }, () => 0);
  const stale = c.get();
  c.clear();
  release(1); await stale;
  assert.equal(c.fresh(), false);
  void c.get(); assert.equal(calls, 2);
});
