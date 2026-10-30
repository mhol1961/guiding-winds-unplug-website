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
  // Cabin occupancy (owners, 29 Oct 2026). Printed verbatim wherever a
  // cabin price or booking commitment appears.
  cabinOccupancyNote:
    'Cabins are for two guests. One guest may book a cabin alone and is responsible for the full cabin price.',
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

/** Intro-call booking on the thank-you page (CRO-3). On since owners confirmed
 *  30 minutes (Oct 2026). Set enabled: false to hide it; /api/intro-call then
 *  answers 404. Calendar: "Guiding Winds Charters and Bookings" in the GWU GHL
 *  subaccount; hours come from that calendar's availability in GHL. */
export const INTRO_CALL = {
  enabled: true,
  calendarId: 'BAz1az3m9cIFhFCBQHjt',
  minutes: 30,
  timezone: 'America/New_York',
  daysAhead: 14,
};

/** Shown wherever a voyage price used to appear (owner request, Oct 2026: no prices for now). */
export const PRICE_NOTE = 'Price depends on duration and season.';

// Owner answers, 21 Oct 2026. One wording each, printed wherever the topic comes up.
export const TRIP_LENGTH = 'Typically 7 days';
export const TRIP_LENGTH_NOTE = 'Charters typically run 7 days. Shorter charters are available.';
export const BOOKING_TERMS =
  'A $500 non-refundable deposit is due at booking. The balance is due one month before the charter.';
export const BOAT_NOTE = 'A boat is chartered for each trip, so the exact catamaran is confirmed closer to departure.';
export const HOSTS_NOTE = 'Clint hosts every charter, and Dodie joins many of them.';
export const MEALS_NOTE = 'Guests help prepare meals together aboard.';

// Owners' booking terms, 29 Oct 2026. Never write "full refund" or "refund
// guaranteed": refunds come only through the guest's travel insurance.
export const ADULTS_NOTE = 'Adults only: every guest must be 18 or older.';
export const GROUP_NOTE = 'Groups are usually 8 to 12 people aboard, hosts included.';
export const CABIN_NOTE =
  'Each cabin has a bed for two, a private bathroom with shower and toilet, storage, and its own lighting and outlets. Sheets, linens and towels are provided. Depending on the boat, some cabins have bunk beds.';
export const INSURANCE_NOTE =
  'Cancel for any reason travel insurance is required when you book. Guiding Winds does not give refunds after booking; refund protection comes through your travel insurance.';
export const CONDUCT_NOTE =
  'Every charter is drug free and smoke free. This is not a booze cruise: any drinking, aboard or ashore, is done responsibly.';
export const TRAVEL_NOTE = 'Guests arrange and pay for their own travel to and from the boat.';
