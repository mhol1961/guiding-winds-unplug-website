// Single canonical Organization payload used across pages where the
// brand identity is part of the @graph (home, voyages hub, voyage
// detail, about, journal, FAQ). Linked-data callers can reference
// it by its @id rather than re-emitting it.

interface OrgInput {
  baseUrl: string;
}

export function organization({ baseUrl }: OrgInput) {
  const root = baseUrl.replace(/\/$/, '');
  return {
    '@type': ['Organization', 'TravelAgency'],
    '@id': `${root}/#org`,
    name: 'Guiding Winds Unplug',
    legalName: 'Guiding Winds Unplug, LLC',
    url: `${root}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${root}/og/logo.png`,
      width: 600,
      height: 600,
    },
    description:
      'Off-grid all-inclusive catamaran voyages for up to 12 guests in the British Virgin Islands, Bahamas, Italy, Greece, and Croatia. From $3,550 per guest, per week.',
    sameAs: [
      'https://www.facebook.com/profile.php?id=61588279383433',
      'https://youtube.com/@guidingwinds',
    ],
    founder: [
      { '@type': 'Person', '@id': `${root}/about#clint`, name: 'Clint Kendall' },
      { '@type': 'Person', '@id': `${root}/about#dodie`, name: 'Dodie Kendall' },
    ],
    areaServed: [
      { '@type': 'Place', name: 'British Virgin Islands' },
      { '@type': 'Place', name: 'The Bahamas' },
      { '@type': 'Place', name: 'Italy' },
      { '@type': 'Place', name: 'Greece' },
      { '@type': 'Place', name: 'Croatia' },
    ],
    knowsLanguage: 'en-US',
    priceRange: '$$$$',
    slogan: 'The off-grid catamaran experts.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Reservations',
      email: 'dodie@guidingwinds-unplug.com',
      availableLanguage: ['English'],
    },
  };
}
