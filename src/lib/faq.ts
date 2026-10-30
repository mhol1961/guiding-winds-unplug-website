// FAQ content: /faq renders it; the voyage pages link to it with the live count.
import {
  BUSINESS, BOOKING_TERMS, TRIP_LENGTH_NOTE, BOAT_NOTE, HOSTS_NOTE, MEALS_NOTE,
  ADULTS_NOTE, GROUP_NOTE, CABIN_NOTE, INSURANCE_NOTE, CONDUCT_NOTE, TRAVEL_NOTE,
} from './business';

export const FAQ_GROUPS = [
  {
    title: 'Before booking',
    items: [
      {
        q: 'How do I book?',
        a: 'We speak with every guest before booking. Send the inquiry form or book a 30-minute intro call. We talk through the open weeks and your questions, and once you decide, we send you a private booking link. No public checkout.',
      },
      {
        q: 'Booking terms.',
        a: BOOKING_TERMS,
      },
      {
        q: 'How long is a charter?',
        a: TRIP_LENGTH_NOTE,
      },
      {
        q: "What if my preferred dates aren't listed?",
        a: 'Use the inquire form and tell us. We sometimes hold private-charter weeks back from the public calendar and add them based on group interest. We do not run unscheduled weeks for individual cabins.',
      },
      {
        q: 'Can we book the whole boat?',
        a: 'Yes. Booking the whole boat comes with two perks: a fully tailored itinerary, and one extra shore dinner on us. We need 6+ months notice for a private-charter week; less if the date is already open on the public calendar.',
      },
      {
        q: 'Who can come?',
        a: `${ADULTS_NOTE} Come with a spouse, a friend or an adult child, or come on your own and meet someone new.`,
      },
      {
        q: 'Do I have to book a cabin for two?',
        a: BUSINESS.cabinOccupancyNote,
      },
      {
        q: 'Cancellation policy.',
        a: `${BOOKING_TERMS} ${INSURANCE_NOTE} One option is trawickinternational.com/?agent=21057. We talk you through the details on a 30-minute intro call before you book.`,
      },
      {
        q: 'Do you require travel insurance?',
        a: 'Yes. Buy a cancel for any reason policy when you book. It is your refund protection if plans change, and we have seen guests need it for weather diversions, missed flights and a few medical situations. The price depends on how much of the trip cost you insure.',
      },
    ],
  },
  {
    title: 'The boat & cabins',
    items: [
      {
        q: 'What does a cabin look like?',
        a: `${CABIN_NOTE} ${BOAT_NOTE}`,
      },
      {
        q: 'Is there air conditioning?',
        a: 'Yes. AC runs cabin-by-cabin on shore power overnight and from generators or shore-tied power most evenings underway. We run fans during open-anchor nights.',
      },
      {
        q: 'Is there Wi-Fi?',
        a: 'We don\'t provide onboard internet. Guests can purchase Wi-Fi for an additional charge, and even then the connection can be unreliable at times - patchy or slow in many anchorages. Unplugging is part of the point.',
      },
      {
        q: 'How many people are aboard?',
        a: `${GROUP_NOTE} ${HOSTS_NOTE}`,
      },
    ],
  },
  {
    title: 'The experience',
    items: [
      {
        q: 'Do I need to know how to sail?',
        a: 'No. Clint handles every helm decision and runs the boat. If you want to learn - trimming, helming, anchoring - he will teach you under his eye. If you want to read a book on the trampoline, the boat sails itself with him at the helm.',
      },
      {
        q: 'How flexible is the itinerary?',
        a: 'Very. The day-by-day on each voyage page is a sample; weather and the group\'s energy get a vote. Most weeks deviate from the published route in small ways - adding an extra anchorage, skipping a shore stop, sleeping in. Major route changes (regional swap) happen rarely and always with reason.',
      },
      {
        q: 'What if I get seasick?',
        a: 'Catamarans are dramatically more stable than monohulls - most people who get seasick on cruise ships are fine on this boat. Guests should purchase seasickness remedies such as scopolamine patches, Bonine, or ginger on their own and bring them along. The BVI and Bahamas are also among the most protected sailing grounds on earth - you are almost never out of sight of an island.',
      },
      {
        q: 'Can we bring kids?',
        a: 'No. Every guest must be 18 or older, including on whole-boat charters. Adult children are welcome to come with you.',
      },
      {
        q: 'Are solo travelers welcome?',
        a: 'Yes. Roughly a quarter of our guests come solo. One guest may book a cabin alone and is responsible for the full cabin price, which Clint and Dodie include in the quote. Come on your own and meet someone new.',
      },
      {
        q: 'Is alcohol included?',
        a: `We don\'t provide or sell alcohol aboard. ${CONDUCT_NOTE} If a bar-focused, party-style charter is what you\'re looking for, we\'re honestly probably not the right fit, and we\'d rather say so kindly up front so your week is everything you hoped it would be.`,
      },
      {
        q: 'Dietary needs and allergies?',
        a: `${MEALS_NOTE} We have planned weeks around vegetarian, gluten-free, dairy-free, kosher, halal, low-carb, and serious shellfish allergies on the same boat at the same week. Tell us at inquiry and we provision accordingly.`,
      },
    ],
  },
  {
    title: 'Logistics',
    items: [
      {
        q: 'Where do I fly into?',
        a: 'BVI: fly into Beef Island (EIS), or fly into St. Thomas (STT) and take the ferry across to Tortola. Bahamas: Marsh Harbour (MHH). Italy: Naples (NAP) on the Amalfi week - fly out of Catania (CTA). Greece: Athens (ATH) - fly out of Santorini (JTR). Croatia: Split (SPU) - fly out of Dubrovnik (DBV).',
      },
      {
        q: 'How do transfers work?',
        a: `${TRAVEL_NOTE} That includes flights and the airport transfer to the marina. Transfers are straightforward, usually a short ferry or taxi at each embarkation point, and we\'re glad to point you to the right option.`,
      },
      {
        q: 'What should I pack?',
        a: 'Less than you think. Two swimsuits, a quick-dry sarong or wrap, a hat with a chin strap, reef-safe sunscreen, a small dry bag, water shoes, and one nicer outfit for the shore dinners. We provide all linens, towels, snorkel gear, and rain gear. We send a full packing list before your trip.',
      },
      {
        q: 'What is the currency situation?',
        a: 'Caribbean and Bahamas: USD widely accepted. Italy/Greece/Croatia: Euros (Croatia is now on the Euro as of 2023). Bring a small amount of cash for tips and incidentals; credit cards are accepted nearly everywhere we go.',
      },
    ],
  },
  {
    title: 'Safety',
    items: [
      {
        q: 'Who runs the boat?',
        a: `${HOSTS_NOTE} Clint runs the boat and has years of experience sailing the Caribbean chain, and he is with you from embarkation to disembarkation.`,
      },
      {
        q: 'Emergency procedures?',
        a: 'Standard offshore safety brief at embarkation: life jackets, throwable PFDs, EPIRB, life raft, fire extinguishers, ditch bag, AED, first aid kit, and a registered satellite communicator. Coast guard radio coverage in every cruising ground we visit.',
      },
      {
        q: 'Are you bonded?',
        a: 'Yes. Guiding Winds Unplug LLC holds a License & Permit Bond with the State of Florida, bond number LSM1283545. Our registered business address is 4736 SE Manatee Terrace, Stuart, FL 34997.',
      },
      {
        q: 'Weather contingency?',
        a: 'Clint plans every week with three potential routes depending on weather. If a tropical system threatens during a Caribbean or Bahamas week, we will reroute to the safest anchorage or, in the rare worst case, postpone. Refund protection comes through your cancel for any reason travel insurance. We have never lost a guest day to weather; we have re-routed plenty.',
      },
    ],
  },
];

export const FAQ_COUNT = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);
