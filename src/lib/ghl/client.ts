// Thin typed wrapper around the GoHighLevel v2 REST API.
// Reads credentials from environment via Astro's import.meta.env.
//
// Env vars (see .env.example):
//   GHL_API_BASE       — https://services.leadconnectorhq.com
//   GHL_API_VERSION    — date-stamped version string
//   GHL_PRIVATE_TOKEN  — Private Integration Token from Dodie's GHL
//   GHL_LOCATION_ID    — subaccount Location ID
//   GHL_CALENDAR_ID_*  — per-region calendar IDs
//
// DRY_RUN_GHL=true lets local dev exercise form code without a real
// token — every call logs to console and returns a synthetic success
// payload. Used when Dodie's creds aren't available yet.

const BASE = import.meta.env.GHL_API_BASE ?? 'https://services.leadconnectorhq.com';
const VERSION = import.meta.env.GHL_API_VERSION ?? '2021-07-28';
const TOKEN = import.meta.env.GHL_PRIVATE_TOKEN ?? '';
// Gate DRY_RUN on an EXPLICIT env flag only (per Codex security audit).
// Previously this also activated when TOKEN was empty — which meant a
// missing prod env var silently dropped leads while returning 200 OK to
// the user. The mailto fallback in the API handlers was bypassed.
// Now: missing token in prod = throw → mailto fallback fires.
const DRY_RUN = import.meta.env.DRY_RUN_GHL === 'true';

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
      // 4xx — don't retry; bubble up immediately.
      if (res.status >= 400 && res.status < 500) {
        throw new GhlError(res.status, text, `GHL ${res.status} on ${path}: ${text.slice(0, 200)}`);
      }
      // 5xx — fall through to retry logic.
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
  return import.meta.env.GHL_LOCATION_ID ?? '';
}

export const calendarIds = {
  bvi: import.meta.env.GHL_CALENDAR_ID_BVI ?? '',
  bahamas: import.meta.env.GHL_CALENDAR_ID_BAHAMAS ?? '',
  mediterranean: import.meta.env.GHL_CALENDAR_ID_MED ?? '',
} as const;
