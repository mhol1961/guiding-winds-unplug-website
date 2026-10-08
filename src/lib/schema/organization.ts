// Single canonical Organization payload used across pages where the
// brand identity is part of the @graph (home, voyages hub, voyage
// detail, about, journal, FAQ). Linked-data callers can reference
// it by its @id rather than re-emitting it.

import { BUSINESS } from '../business';

interface OrgInput {
  baseUrl: string;
}

export function organization({ baseUrl }: OrgInput) {
  const root = baseUrl.replace(/\/$/, '');
  return {
    '@type': ['Organization', 'TravelAgency'],
    '@id': `${root}/#org`,
    name: 'Guiding Winds Unplug',
    legalName: BUSINESS.legalName,
    url: `${root}/`,
    telephone: BUSINESS.phoneTel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: `${BUSINESS.bond.type} (${BUSINESS.bond.jurisdiction})`,
        value: BUSINESS.bond.number,
      },
      { '@type': 'PropertyValue', propertyID: 'Florida Seller of Travel Registration No.', value: BUSINESS.sellerOfTravelRef },
    ],
    logo: {
      '@type': 'ImageObject',
      url: `${root}/img/brand/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      'Off-grid all-inclusive catamaran voyages for up to 12 guests in the British Virgin Islands, Bahamas, Italy, Greece, and Croatia.',
    sameAs: [
      'https://www.facebook.com/profile.php?id=61588279383433',
      'https://www.youtube.com/@GuidingWindsCatamaranCharters',
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
    slogan: 'The off-grid catamaran experts.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Reservations',
      email: BUSINESS.email,
      telephone: BUSINESS.phoneTel,
      availableLanguage: ['English'],
    },
  };
}
