// FAQ content: /faq renders it; the voyage pages link to it with the live count.
import { BUSINESS } from './business';

export const FAQ_GROUPS = [
  {
    title: 'Before booking',
    items: [
      {
        q: 'How do I book?',
        a: 'We speak with every guest before booking. Send the inquiry form or book a quick call. We talk through the open weeks and your questions, and once you decide, we send you a private booking link. No public checkout.',
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
        q: 'Do I have to book a cabin for two?',
        a: BUSINESS.cabinOccupancyNote,
      },
      {
        q: 'Cancellation policy.',
        a: 'We recommend travelers insurance that lets you cancel for any reason and get a full refund: trawickinternational.com/?agent=21057. We talk you through the details on a quick call before you book.',
      },
      {
        q: 'Do you require travel insurance?',
        a: 'Not required, strongly recommended. We have seen guests need it for weather diversions, missed flights, and a few medical situations. A policy usually costs a few hundred dollars; the price depends on how much of the trip cost you insure.',
      },
    ],
  },
  {
    title: 'The boat & cabins',
    items: [
      {
        q: 'What does a cabin look like?',
        a: 'Each cabin has an ensuite head (toilet + separate shower stall) and a hatch over the bed for stars at night. Our catamarans are chosen for cabin volume.',
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
        q: 'How many guests does the boat actually hold?',
        a: 'We host up to 12 guests, plus two crew (Clint and Dodie). Twelve is the comfortable maximum.',
      },
    ],
  },
  {
    title: 'The experience',
    items: [
      {
        q: 'Do I need to know how to sail?',
        a: 'No. Clint handles every helm decision and crew task. If you want to learn - trimming, helming, anchoring - he will teach you under his eye. If you want to read a book on the trampoline, the boat sails itself with him at the helm.',
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
        a: 'Yes. The boat sleeps 12 and kids stack in cabins easily. Two notes: this is an adult-pace trip (long dinners, no kids menu), and there is no formal childcare. If you want a family week, book the whole boat and we will tailor the schedule - earlier dinners, more swim time, fewer long passages.',
      },
      {
        q: 'Are solo travelers welcome?',
        a: 'Yes. Roughly a quarter of our guests come solo. Solo travelers book a cabin to themselves and are responsible for the full cabin price, which Clint and Dodie include in the quote.',
      },
      {
        q: 'Is alcohol included?',
        a: 'We don\'t provide or sell alcohol aboard - Guiding Winds is not a booze cruise, and we don\'t encourage drinking on the boat. If you\'d like a drink, you\'re welcome to enjoy one responsibly while ashore on the islands. If a bar-focused, party-style charter is what you\'re looking for, we\'re honestly probably not the right fit - and we\'d rather say so kindly up front so your week is everything you hoped it would be.',
      },
      {
        q: 'Dietary needs and allergies?',
        a: 'Dodie has run weeks with vegetarian, gluten-free, dairy-free, kosher, halal, low-carb, and serious shellfish allergies on the same boat at the same week. Tell us at inquiry - she shops accordingly.',
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
        a: 'Airport transfers to and from the marina are the guest\'s responsibility and aren\'t included. They\'re straightforward - a short ferry or taxi at each embarkation point - and we\'re glad to point you to the right option, but booking and paying for transfers is on you.',
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
        a: 'Clint runs the boat and Dodie runs the galley. Together they have years of experience sailing the Caribbean chain, and the same team is with you from embarkation to disembarkation.',
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
        a: 'Clint plans every week with three potential routes depending on weather. If a tropical system threatens during a Caribbean or Bahamas week, we will reroute to the safest anchorage or, in the rare worst case, postpone - full refund or rebook. We have never lost a guest day to weather; we have re-routed plenty.',
      },
    ],
  },
];

export const FAQ_COUNT = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);
