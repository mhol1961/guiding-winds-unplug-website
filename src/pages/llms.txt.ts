// llms.txt - emerging convention for telling AI crawlers what's worth
// indexing on a site. Distinct from robots.txt (which gates ACCESS).
// llms.txt is a curated content map for LLM consumers: priority pages,
// in markdown, with one-line descriptions.
// See https://llmstxt.org/

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BUSINESS, ADDRESS_ONE_LINE, BOND_ONE_LINE, SELLER_OF_TRAVEL_DISCLOSURE } from '../lib/business';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') ?? 'https://guidingwinds-unplug.com';
  const voyages = await getCollection('voyages');

  const lines: string[] = [];
  lines.push('# Guiding Winds Unplug');
  lines.push('');
  lines.push(
    '> Crewed, all-inclusive catamaran voyages for up to 12 guests in the British Virgin Islands, the Bahamas, Greece, Italy and Croatia. From $3,350 per guest, per week. Owner-run by Clint and Dodie Kendall.',
  );
  lines.push('');
  lines.push(
    'Brand promise: "unplug." Up to twelve guests per voyage. The same two-person crew sails every voyage personally.',
  );
  lines.push('');
  lines.push(`Cabin occupancy: ${BUSINESS.cabinOccupancyNote}`);
  lines.push('');
  lines.push('## Voyages (2027 calendar)');
  lines.push('');
  for (const v of voyages) {
    const weeks = v.data.availableWeeks.length;
    lines.push(
      `- [${v.data.name}](${origin}/voyages/${v.data.slug}): ${v.data.shortDescription} ${weeks} ${weeks === 1 ? 'week' : 'weeks'} open in 2027. From $${v.data.pricePerGuestUSD.toLocaleString()} per guest, all-inclusive.`,
    );
  }
  lines.push('');
  lines.push('## Plan');
  lines.push('');
  lines.push(`- [About: Clint & Dodie Kendall](${origin}/about): Owner-run by the husband-and-wife crew who sail every voyage. Clint at the helm, Dodie running the galley and the guest experience. Based in Stuart, Florida.`);
  lines.push(`- [Aboard: what's included](${origin}/aboard): All meals cooked fresh aboard, snorkel gear and paddleboards (plus kayaks in the BVI and Bahamas), a private cabin with ensuite head, fuel, moorings and crew. Up to 12 guests.`);
  lines.push(`- [Calendar](${origin}/calendar): 2027 weeks across the BVI, Bahamas, Greece, Italy and Croatia. Weeks run Saturday to Saturday.`);
  lines.push(`- [FAQ](${origin}/faq): Booking, the boat, the experience, logistics, and safety.`);
  lines.push(`- [Book a quick call](${origin}/inquire): We speak with every guest before booking. Dodie or Clint reply within 24 hours.`);
  lines.push('');
  lines.push('## How booking works');
  lines.push('');
  lines.push('- We speak with every guest before booking. Send the inquiry form or book a quick call; Dodie or Clint reply within 24 hours.');
  lines.push('- After the call, if you decide to go, we send you a private booking link. There is no public checkout.');
  lines.push('- Every voyage is crewed by Clint and Dodie, with up to 12 guests aboard.');
  lines.push('');
  lines.push('## Contact');
  lines.push('');
  lines.push(`- Phone: ${BUSINESS.phoneDisplay}`);
  lines.push(`- Email: ${BUSINESS.email}`);
  lines.push(`- Inquiry form: ${origin}/inquire`);
  lines.push('');
  lines.push('## Fine print');
  lines.push('');
  lines.push(`- [Privacy](${origin}/privacy)`);
  lines.push(`- [Terms](${origin}/terms): Booking and voyage terms. We recommend travelers insurance that lets you cancel for any reason.`);
  lines.push('');
  lines.push('## Business identity');
  lines.push('');
  lines.push(`- Legal name: ${BUSINESS.legalName}`);
  lines.push(`- Address: ${ADDRESS_ONE_LINE}`);
  lines.push(`- Bonded: ${BOND_ONE_LINE}`);
  lines.push(`- Seller of Travel: ${SELLER_OF_TRAVEL_DISCLOSURE}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
