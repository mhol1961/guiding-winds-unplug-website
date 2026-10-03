// Latest videos from Dodie & Clint's YouTube channel, via the channel's public
// RSS feed (no API key). New uploads reach the site within the cache TTLs.

export const CHANNEL_URL = 'https://www.youtube.com/@GuidingWindsCatamaranCharters';
const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCdvpJOXvz4e_bvr2_n4iF7g';
/** Plays in the home page's welcome section, so the latest-videos list skips it. */
export const WELCOME_VIDEO_ID = '4bJV2e8y0g8';
const FALLBACK_TITLE = 'A video from the boat';

export interface Video {
  id: string;
  title: string;
  /** ISO timestamp, or '' when the feed's date is missing or invalid. */
  published: string;
}

const NAMED: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };

function decodeEntities(s: string): string {
  return s.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (m, e: string) => {
    if (e[0] !== '#') return NAMED[e.toLowerCase()] ?? m;
    const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : m;
  });
}

/** Text of the first <tag>, tolerating attributes and CDATA. */
function field(entry: string, tag: string): string {
  const raw = entry.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`))?.[1] ?? '';
  const cdata = raw.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return cdata ? cdata[1] : decodeEntities(raw);
}

/** Feed titles carry hashtags and the channel handle; drop them for display. */
function cleanTitle(raw: string): string {
  const t = raw.replace(/(^|\s)[#@][\w-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t || FALLBACK_TITLE;
}

/** Parse the YouTube Atom feed, newest first. Entries without a valid id are dropped. */
export function parseFeed(xml: string): Video[] {
  return [...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => {
      const date = new Date(field(entry, 'published'));
      return {
        id: field(entry, 'yt:videoId').trim(),
        title: cleanTitle(field(entry, 'title')),
        published: Number.isFinite(date.getTime()) ? date.toISOString() : '',
      };
    })
    .filter((v) => /^[\w-]{11}$/.test(v.id))
    .sort((a, b) => b.published.localeCompare(a.published));
}

/** null = the feed couldn't be fetched or read (don't cache that); [] = no videos. */
export async function latestVideos(): Promise<Video[] | null> {
  try {
    const res = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(5000),
      // Cloudflare edge cache for the feed: successes only, never errors.
      // ponytail: a truncated 200 would sit in this cache up to 15 min (served as a 503 fallback
      // meanwhile); move to Cache API with post-validation put if that ever happens.
      cf: { cacheTtlByStatus: { '200-299': 900, '300-599': 0 } },
    } as RequestInit);
    if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
    const xml = await res.text();
    // A truncated body would parse as "no videos"; only accept a complete feed.
    if (!/<feed[\s>][\s\S]*<\/feed>\s*$/.test(xml)) throw new Error('feed body is not a complete Atom document');
    return parseFeed(xml);
  } catch (err) {
    console.error('[youtube] feed fetch failed', err);
    return null;
  }
}
