// Thin typed wrapper around the GoHighLevel v2 REST API.
//
// Credentials are read at REQUEST TIME from the Cloudflare Worker runtime
// env (secrets/vars set in the dashboard or via wrangler). On Cloudflare,
// `import.meta.env` is inlined at BUILD time and does NOT carry runtime
// secrets, so reading it at module load gave an empty token in production
// and tripped the mailto fallback. We read the runtime env per call and
// fall back to import.meta.env for local dev / non-Cloudflare contexts.
//
// Env vars (see .env.example):
//   GHL_API_BASE       - https://services.leadconnectorhq.com
//   GHL_API_VERSION    - date-stamped version string
//   GHL_PRIVATE_TOKEN  - Private Integration Token from Dodie's GHL
//   GHL_LOCATION_ID    - subaccount Location ID
//   GHL_CALENDAR_ID_*  - per-region calendar IDs
//
// DRY_RUN_GHL=true lets local dev exercise form code without a real token.

import { env as runtimeEnv } from 'cloudflare:workers';

/** Read an env value from the Cloudflare runtime first, then build-time. */
function envVar(key: string): string | undefined {
  const fromRuntime = runtimeEnv?.[key];
  if (typeof fromRuntime === 'string' && fromRuntime !== '') return fromRuntime;
  const fromBuild = (import.meta.env as Record<string, unknown>)[key];
  return typeof fromBuild === 'string' && fromBuild !== '' ? fromBuild : undefined;
}

interface GhlRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Retry on 5xx + transient network errors. Defaults to 3. */
  retries?: number;
}

export class GhlError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string, message: string) {
    super(message);
    this.name = 'GhlError';
    this.status = status;
    this.body = body;
  }
}

export async function ghl<T>(path: string, options: GhlRequestOptions = {}): Promise<T> {
  // Read at call time so Cloudflare runtime secrets/vars are picked up.
  const DRY_RUN = envVar('DRY_RUN_GHL') === 'true';
  const TOKEN = envVar('GHL_PRIVATE_TOKEN') ?? '';
  const BASE = envVar('GHL_API_BASE') ?? 'https://services.leadconnectorhq.com';
  const VERSION = envVar('GHL_API_VERSION') ?? '2021-07-28';

  if (DRY_RUN) {
    console.log(`[GHL DRY RUN] ${options.method ?? 'GET'} ${path}`, options.body ?? '');
    return { dryRun: true, path } as T;
  }

  if (!TOKEN) {
    // Missing token in production. Fail loud so API handlers trip their
    // mailto-fallback path instead of silently swallowing the lead.
    throw new GhlError(
      0,
      '',
      'GHL_PRIVATE_TOKEN is not configured. Set it in the deployment environment.',
    );
  }

  const { body, retries = 3, headers: extraHeaders = {}, ...init } = options;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${TOKEN}`,
    Version: VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(extraHeaders as Record<string, string>),
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (res.ok) {
        if (res.status === 204) return undefined as T;
        return (await res.json()) as T;
      }

      const text = await res.text();
      // 4xx - don't retry; bubble up immediately.
      if (res.status >= 400 && res.status < 500) {
        throw new GhlError(res.status, text, `GHL ${res.status} on ${path}: ${text.slice(0, 200)}`);
      }
      // 5xx - fall through to retry logic.
      lastError = new GhlError(res.status, text, `GHL ${res.status} on ${path}`);
    } catch (err) {
      lastError = err;
      // Don't retry GhlError 4xx.
      if (err instanceof GhlError && err.status >= 400 && err.status < 500) throw err;
    }

    // Exp backoff: 200ms, 500ms, 1.25s.
    if (attempt < retries) {
      const delay = 200 * Math.pow(2.5, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`GHL request failed after ${retries + 1} attempts: ${path}`);
}

export function locationId(): string {
  return envVar('GHL_LOCATION_ID') ?? '';
}

export type CalendarRegion = 'bvi' | 'bahamas' | 'mediterranean';

/** Per-region calendar IDs, read from the runtime env at call time. */
export function getCalendarIds(): Record<CalendarRegion, string> {
  return {
    bvi: envVar('GHL_CALENDAR_ID_BVI') ?? '',
    bahamas: envVar('GHL_CALENDAR_ID_BAHAMAS') ?? '',
    mediterranean: envVar('GHL_CALENDAR_ID_MED') ?? '',
  };
}
