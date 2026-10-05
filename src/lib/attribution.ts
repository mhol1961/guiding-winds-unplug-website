// Ad attribution: which ad brought a lead in. Captured in the browser from
// the landing URL (AttributionCapture.astro), sent with every form, written
// to matching GHL contact fields (contact.utm_source ... contact.fbclid).

export const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

/** The attribution fields from a form payload. Bad or missing values are dropped, never an error. */
export function pickAttribution(payload: Record<string, unknown>): Attribution {
  const out: Attribution = {};
  for (const k of ATTRIBUTION_KEYS) {
    const v = payload[k];
    if (typeof v === 'string' && v.trim()) out[k] = v.trim().slice(0, 300);
  }
  return out;
}

/** Came from a Facebook or Instagram ad (fbclid, or a Meta utm_source). */
export function isMetaAd(a: Attribution): boolean {
  return Boolean(a.fbclid) || /^(fb|facebook|ig|instagram|meta)\b/i.test(a.utm_source ?? '');
}
