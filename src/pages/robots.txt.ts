// Explicit AI-bot allowlist per ADR-010. The marketing math here is the
// opposite of a publisher's — being cited by ChatGPT / Claude / Perplexity
// / Google AI Overviews drives qualified leads for a $3,000+/week
// purchase. We invite the crawl.

import type { APIRoute } from 'astro';

const BOTS = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot',
  'Applebot-Extended',
  'YouBot',
  'cohere-ai',
  'DuckAssistBot',
];

export const GET: APIRoute = ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') ?? 'https://guidingwinds-unplug.com';
  const lines: string[] = [];

  // Per-bot allow blocks. Explicit allows perform identically to a wildcard
  // allow on every major crawler, but the explicit form is what their
  // operators look for when deciding whether to honor a site.
  for (const bot of BOTS) {
    lines.push(`User-agent: ${bot}`);
    lines.push('Allow: /');
    lines.push('Disallow: /api/');
    lines.push('Disallow: /inquire/thank-you');
    lines.push('');
  }

  // Universal default — anything else is welcome too.
  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('Disallow: /api/');
  lines.push('Disallow: /inquire/thank-you');
  lines.push('');

  lines.push(`Sitemap: ${origin}/sitemap-index.xml`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
