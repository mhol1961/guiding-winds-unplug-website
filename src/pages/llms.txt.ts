// llms.txt - emerging convention for telling AI crawlers what's worth
// indexing on a site. Distinct from robots.txt (which gates ACCESS).
// llms.txt is a curated content map for LLM consumers: priority pages,
// in markdown, with one-line descriptions.
// See https://llmstxt.org/

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') ?? 'https://guidingwinds-unplug.com';
  const voyages = await getCollection('voyages');

  const lines: string[] = [];
  lines.push('# Guiding Winds Unplug');
  lines.push('');
  lines.push(
    '> Off-grid all-inclusive catamaran voyages for up to 12 guests in the British Virgin Islands, Bahamas, and Mediterranean. From $3,550 per guest, per week. Captained by Clint Kendall.',
  );
  lines.push('');
  lines.push(
    'Brand promise: "unplug." Up to twelve guests per voyage. The same two-person crew sails every voyage personally.',
  );
  lines.push('');
  lines.push('## Voyages (2027 calendar)');
  lines.push('');
  for (const v of voyages) {
    const cabins = v.data.availableWeeks.reduce((sum, w) => sum + w.cabinsAvailable, 0);
    lines.push(
      `- [${v.data.name}](${origin}/voyages/${v.data.slug}): ${v.data.shortDescription} ${cabins} cabins open in 2027. From $${v.data.pricePerGuestUSD.toLocaleString()} per guest, all-inclusive.`,
    );
  }
  lines.push('');
  lines.push('## Plan');
  lines.push('');
  lines.push(`- [About - Clint & Dodie Kendall](${origin}/about): One-captain husband-and-wife operation. Years in the chain.`);
  lines.push(`- [Aboard - what's included](${origin}/aboard): Chef-prepared meals, snorkel gear, paddleboards, kayaks, private cabin with ensuite head, fuel, dockage, captain, host. Private ensuite cabins for up to 12 guests.`);
  lines.push(`- [Calendar](${origin}/calendar): Live 2027 availability across the BVI, Bahamas, and Mediterranean - see the calendar.`);
  lines.push(`- [FAQ](${origin}/faq): Booking, the boat, the experience, logistics, and safety.`);
  lines.push(`- [Book a quick Zoom call](${origin}/inquire): We speak with every guest before booking. Dodie or Clint reply within 24 hours.`);
  lines.push('');
  lines.push('## Fine print');
  lines.push('');
  lines.push(`- [Privacy](${origin}/privacy)`);
  lines.push(`- [Terms](${origin}/terms): Booking and voyage terms. We recommend travelers insurance that lets you cancel for any reason.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
