// llms.txt — emerging convention for telling AI crawlers what's worth
// indexing on a site. Distinct from robots.txt (which gates ACCESS).
// llms.txt is a curated content map for LLM consumers: priority pages,
// in markdown, with one-line descriptions.
// See https://llmstxt.org/

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') ?? 'https://guidingwinds-unplug.com';
  const voyages = await getCollection('voyages');
  const posts = await getCollection('journal', ({ data }) => !data.draft);

  const lines: string[] = [];
  lines.push('# Guiding Winds Unplug');
  lines.push('');
  lines.push(
    '> All-inclusive wellness catamaran charters for 8–12 guests in the British Virgin Islands, Bahamas, and Mediterranean. From $3,550 per guest, per week. Captained by Clint Kendall (USCG Master 100-Ton, RYA Yachtmaster Offshore) and hosted by Dodie Kendall.',
  );
  lines.push('');
  lines.push(
    'Brand promise: "unplug." Eight private cabins per voyage, twelve guests maximum, fourteen weeks a year. The same two-person crew sails every voyage personally.',
  );
  lines.push('');
  lines.push('## Voyages (2027 calendar)');
  lines.push('');
  for (const v of voyages) {
    const weeks = v.data.availableWeeks.length;
    const cabins = v.data.availableWeeks.reduce((sum, w) => sum + w.cabinsAvailable, 0);
    lines.push(
      `- [${v.data.name}](${origin}/voyages/${v.data.slug}): ${v.data.shortDescription} ${weeks} week(s) available in 2027, ${cabins} cabins open. From $${v.data.pricePerGuestUSD.toLocaleString()} per guest, all-inclusive.`,
    );
  }
  lines.push('');
  lines.push('## Plan');
  lines.push('');
  lines.push(`- [About — Clint & Dodie Kendall](${origin}/about): Two-captain husband-and-wife operation. USCG-licensed, ten-plus years in the chain, fourteen weeks a year.`);
  lines.push(`- [Aboard — what's included](${origin}/aboard): Chef-prepared meals, premium open bar, snorkel gear, paddleboards, kayaks, private cabin with ensuite head, fuel, dockage, captain, host. The Lagoon 50 catamaran has 8 ensuite queen cabins.`);
  lines.push(`- [Calendar — all 14 weeks](${origin}/calendar): Live 2027 availability across BVI (January–March + November), Bahamas (April–May), and Mediterranean (June–October).`);
  lines.push(`- [FAQ](${origin}/faq): 23 questions across booking, the boat, the experience, logistics, and safety.`);
  lines.push(`- [Inquire — hold a cabin for 72 hours](${origin}/inquire): No payment required to hold. Dodie or Clint reply within 24 hours.`);
  lines.push('');
  lines.push('## Field Notes (journal)');
  lines.push('');
  for (const p of posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())) {
    lines.push(`- [${p.data.title}](${origin}/journal/${p.id}): ${p.data.excerpt}`);
  }
  lines.push('');
  lines.push('## Fine print');
  lines.push('');
  lines.push(`- [Privacy](${origin}/privacy)`);
  lines.push(`- [Terms & cancellation policy](${origin}/terms): 90+ days full refund, 89–45 days 50%, under 45 days rebook for any future week with availability.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
