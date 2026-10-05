// Run: npm test  (real SQLite via node:sqlite, same SQL as the D1 table)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { allowRequest, type D1Like } from './lead-limits.ts';

function d1(): D1Like {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../../migrations/0001_lead_limits.sql', import.meta.url), 'utf8'));
  return {
    prepare: (sql) => ({
      bind: (...v) => ({
        first: async <T>() => (db.prepare(sql).get(...(v as never[])) ?? null) as T | null,
        run: async () => db.prepare(sql).run(...(v as never[])),
      }),
    }),
  };
}

test('5 per hour per visitor+route, then blocked; other visitors and routes unaffected; next hour resets', async () => {
  const db = d1();
  const t = Date.UTC(2026, 9, 5, 12, 0, 0);
  for (let i = 1; i <= 5; i++) assert.equal(await allowRequest(db, 'inquire:1.1.1.1', 5, t + i), true, `hit ${i}`);
  assert.equal(await allowRequest(db, 'inquire:1.1.1.1', 5, t + 6), false);
  assert.equal(await allowRequest(db, 'inquire:2.2.2.2', 5, t + 7), true);
  assert.equal(await allowRequest(db, 'newsletter:1.1.1.1', 5, t + 8), true);
  assert.equal(await allowRequest(db, 'inquire:1.1.1.1', 5, t + 3600_000), true);
});
