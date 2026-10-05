// Per-visitor form limits in D1 (LEAD_DB, table ip_hits), shared by every
// Worker instance. Fixed one-hour buckets; old buckets are pruned as we go.

export interface D1Like {
  prepare(sql: string): {
    bind(...values: unknown[]): { first<T>(): Promise<T | null>; run(): Promise<unknown> };
  };
}

const HOUR_S = 3600;

/** Count this request against `key`; true while the key is within `max` per hour. */
export async function allowRequest(db: D1Like, key: string, max: number, now = Date.now()): Promise<boolean> {
  const bucket = Math.floor(now / 1000 / HOUR_S);
  const row = await db
    .prepare(
      `INSERT INTO ip_hits (key, bucket, n) VALUES (?1, ?2, 1)
       ON CONFLICT (key, bucket) DO UPDATE SET n = n + 1 RETURNING n`,
    )
    .bind(key, bucket)
    .first<{ n: number }>();
  await db.prepare('DELETE FROM ip_hits WHERE bucket < ?1').bind(bucket - 1).run().catch(() => {});
  return (row?.n ?? 0) <= max;
}
