import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Voyages ──────────────────────────────────────────────────────────────
// One MD per trip in src/content/voyages/. Drives the 5 destination pages,
// the home picker, the /calendar grid, the destinations hub, and the
// TouristTrip + Event + Offer schema graphs.
const voyages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/voyages' }),
  schema: z.object({
    slug: z.string(),
    region: z.enum(['caribbean', 'bahamas', 'mediterranean']),
    name: z.string(),
    country: z.string(),
    /** Three-line hero stat (e.g., "Tortola · BVI") */
    heroEyebrow: z.string(),
    nights: z.number().default(7),
    /** Human-facing nights range, e.g. "4 to 7". Falls back to `nights` when unset. */
    nightsLabel: z.string().optional(),
    pricePerGuestUSD: z.number(),
    /** Short narrative card description used on the home ExploreCards row. */
    shortDescription: z.string().max(280),
    /** Hero image path under /public or absolute URL. Falls back gracefully
     *  to a gradient if the file isn't present. */
    heroImage: z.string(),
    heroImageAlt: z.string(),
    galleryImages: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
    availableWeeks: z.array(
      z.object({
        start: z.string(), // ISO yyyy-mm-dd
        end: z.string(),
        cabinsAvailable: z.number().int().min(0).max(8),
        ghlEventId: z.string().optional(),
      }),
    ),
    itinerary: z.array(
      z.object({
        day: z.number().int().min(1).max(8),
        label: z.string(), // e.g., "Saturday"
        title: z.string(), // e.g., "Norman Island"
        body: z.string(),
      }),
    ),
    inclusions: z.array(z.string()),
    exclusions: z.array(z.string()),
    /** Per-page FAQ. Renders into FAQPage schema + an Accordion on the
     *  voyage page itself. */
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    seo: z.object({
      title: z.string().max(70),
      description: z.string().max(165),
      keywords: z.array(z.string()).default([]),
    }),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
});

// ── Journal ──────────────────────────────────────────────────────────────
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string().max(240),
    /** TL;DR / "answer capsule" surfaced at the top of the post - what AI
     *  search engines extract for citations. See SEO-PLAN.md. */
    tldr: z.string().min(40).max(800),
    category: z.enum(['guide', 'field-notes', 'wellness', 'behind-the-boat']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    author: z.enum(['dodie', 'clint', 'guest']).default('dodie'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Link to a relevant voyage by slug, drives the post's primary CTA. */
    relatedVoyage: z.string().optional(),
    seo: z.object({
      title: z.string().max(70),
      description: z.string().max(165),
    }),
    draft: z.boolean().default(false),
  }),
});

// ── Reviews ──────────────────────────────────────────────────────────────
// Data collection - loaded from JSON/YAML rather than MD bodies. Each entry
// is one testimonial. Drives the home TestimonialRow + Review/AggregateRating
// schema.
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/reviews' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    location: z.string(),
    /** Voyage slug. */
    voyage: z.string(),
    rating: z.number().int().min(1).max(5).default(5),
    date: z.coerce.date(),
    /** Whether to surface on the home page. */
    homepageFeature: z.boolean().default(false),
    /** Optional guest photo path under /public - used as the avatar in
     *  the TestimonialRow card footer and (for featured) as the card
     *  background. When absent the component falls back to a monogram. */
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
  }),
});

export const collections = { voyages, journal, reviews };
