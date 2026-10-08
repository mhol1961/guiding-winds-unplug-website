// Single source of truth for the legal entity, mailing address, and
// bond details. Every place on the site that prints the business
// identity (footer, About, Terms, FAQ, schema, llms.txt) reads from
// here so a change lands everywhere at once.
//
// Bond/policy details supplied by Clint Kendall, September 2026.

export const BUSINESS = {
  name: 'Guiding Winds Unplug',
  legalName: 'Guiding Winds Unplug LLC',
  email: 'guidingwindsunplug@gmail.com',
  // Public phone stays the AI voice line already used site-wide.
  phoneTel: '+17723103777',
  phoneDisplay: '(772) 310-3777',
  address: {
    street: '4736 SE Manatee Terrace',
    city: 'Stuart',
    region: 'FL',
    postalCode: '34997',
    country: 'US',
  },
  bond: {
    number: 'LSM1283545',
    type: 'License & Permit Bond',
    jurisdiction: 'State of Florida',
    principal: 'Guiding Winds Unplug LLC',
  },
  // Mandatory two-person cabin occupancy. Printed verbatim wherever a
  // cabin price or booking commitment appears.
  cabinOccupancyNote:
    'Cabins require an occupancy of two people. If you do not have two people, you will still be responsible for the full cabin price.',
  // Florida Seller of Travel registration number, issued by FDACS.
  sellerOfTravelRef: 'ST150174',
} as const;

/** The disclosure Fla. Stat. 559.928(5) requires, word for word. Used in the
 *  footer of every page, /terms, /inquire, the ad pages and llms.txt. */
export const SELLER_OF_TRAVEL_DISCLOSURE = `${BUSINESS.legalName} is registered with the State of Florida as a Seller of Travel. Registration No. ${BUSINESS.sellerOfTravelRef}.`;

export const ADDRESS_ONE_LINE = `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`;

export const BOND_ONE_LINE = `${BUSINESS.bond.type} No. ${BUSINESS.bond.number}, ${BUSINESS.bond.jurisdiction}`;

export const BONDED_SHORT = `Bonded in the ${BUSINESS.bond.jurisdiction}`;

/** Party-size choices, shared by every inquiry form so GHL gets one set of values. */
export const PARTY_SIZES = ['Just me', '2 (couple)', '3-4', '5-6', '7-8', '9-12', 'Whole boat / not sure yet'];

/** Intro-call booking on the thank-you page (CRO-3). Built but OFF until Clint
 *  and Dodie confirm the call length and hours; while off, /api/intro-call
 *  answers 404 and the thank-you page shows nothing. Calendar: "Guiding Winds
 *  Charters and Bookings" in the GWU GHL subaccount. */
export const INTRO_CALL = {
  enabled: false,
  calendarId: 'BAz1az3m9cIFhFCBQHjt',
  minutes: 30,
  timezone: 'America/New_York',
  daysAhead: 14,
};

/** Shown wherever a voyage price used to appear (owner request, Oct 2026: no prices for now). */
export const PRICE_NOTE = 'Price depends on duration and season.';
