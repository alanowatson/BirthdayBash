export interface Tip {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  body: string;
  note: string;
  accent: string;
  icon: string;
  /** Event slugs this tip should surface on */
  eventSlugs?: string[];
}

export const TIPS: Tip[] = [
  {
    id: 'el-cortez',
    number: '01',
    category: 'DOWNTOWN FREEBIE',
    title: 'El Cortez Boarding Pass Deal',
    subtitle: 'The single best free offer in Las Vegas',
    body: 'Show your airline boarding pass at the Club Cortez Players Club desk within 72 hours of landing. Join the free rewards program on the spot and walk out with $10–$1,000 in free slot play (via a wheel spin), $25 blackjack match play, and a free drink at any El Cortez bar.',
    note: 'PRO TIP: Save your boarding pass to Google Wallet or screenshot it — airline apps delete them. With 20 people each redeeming, you\'re looking at $800+ in collective gambling stake for the cost of an Uber.',
    accent: '#FFD700',
    icon: '✈',
    eventSlugs: ['fremont-street-crawl'],
  },
  {
    id: 'secret-pizza',
    number: '02',
    category: 'COSMOPOLITAN',
    title: 'Secret Pizza',
    subtitle: 'Level 3 · Open until 4 AM',
    body: 'Ride any elevator to the 3rd floor of the Boulevard Tower and follow the unmarked hallway lined with vinyl album covers. No signage. Most people walk right past it. NY-style slices for $6–7, whole pies $25–30. The best late-night food on the Strip by a wide margin.',
    note: 'PRO TIP: Order whole pies for a group — much better value than individual slices. Go white pie or meatball-ricotta.',
    accent: '#FF4444',
    icon: '🍕',
  },
  {
    id: 'verbena',
    number: '03',
    category: 'COSMOPOLITAN',
    title: 'The Verbena at Chandelier Bar',
    subtitle: 'Level 1.5 · The non-negotiable first drink',
    body: 'Order the Verbena on Level 1.5 of the Chandelier Bar — tequila, yuzu, kalamansi, ginger, served with a live Szechuan button edible flower. Take a few sips, then chew the flower. The spilanthol creates a mouth-numbing, tingling sensation that completely transforms how the citrus tastes. Unlike anything else on the Strip.',
    note: 'PRO TIP: Ask the bartender about the black light menu — there\'s a secret menu only visible under UV, available on Level 1.5.',
    accent: '#C084FC',
    icon: '🍸',
  },
  {
    id: 'beauty-essex',
    number: '04',
    category: 'COSMOPOLITAN',
    title: 'Beauty & Essex Social Hour',
    subtitle: 'Sun–Thu · 5–7 PM · Pearl Lounge',
    body: 'Walk through the pawn shop entrance on Level 3. During Social Hour, 10 signature dishes and 10 signature cocktails are all $10 each. This is the best value happy hour in the building and the ideal pre-night-out gathering spot for a large group. Outside of these hours it\'s a full $$$ restaurant.',
    note: 'PRO TIP: Reserve the lounge for groups of 10+ by calling 702-737-0707. Closed Mondays and Tuesdays — plan around it.',
    accent: '#F97316',
    icon: '💎',
  },
  {
    id: 'viva-vision',
    number: '05',
    category: 'FREMONT STREET',
    title: 'Free Viva Vision Light Shows',
    subtitle: 'Every hour · 6 PM – 2 AM · Under the canopy',
    body: 'The world\'s largest single video screen — 1,375 feet long, 90 feet wide, 90 feet overhead, 49.3 million LED lamps. Free shows run at the top of every hour from 6 PM to 2 AM. Stand directly under the canopy and look straight up. Shows feature Imagine Dragons, Katy Perry, Stone Temple Pilots, Red Hot Chili Peppers, Shakira, Steve Aoki, and more.',
    note: 'PRO TIP: Check the Vegas2Go app (free, official FSE app) for Halloween-week concert schedules — late October usually adds themed performances and costume contests on the free stages.',
    accent: '#22D3EE',
    icon: '✨',
    eventSlugs: ['fremont-street-crawl'],
  },
];
