// All coordinates are [longitude, latitude]

export interface MapLocation {
  id: string;
  name: string;
  short: string;
  coords: [number, number];
  type: 'hotel' | 'event' | 'landmark';
  color: string;
  description: string;
  routes?: Route[];
}

export interface Route {
  from: string;
  label: string;
  minutes: number;
  steps: string[];
}

export const LOCATIONS: MapLocation[] = [
  {
    id: 'vdara',
    name: 'Vdara Hotel & Spa',
    short: 'Vdara',
    coords: [-115.1781, 36.1094],
    type: 'hotel',
    color: '#D4AF37',
    description: 'Home base. 57-story all-suite hotel in the heart of CityCenter.',
    routes: [{ from: 'vdara', label: 'You are here', minutes: 0, steps: [] }],
  },
  {
    id: 'cosmopolitan',
    name: 'The Cosmopolitan',
    short: 'Cosmo',
    coords: [-115.1753, 36.1095],
    type: 'hotel',
    color: '#D4AF37',
    description: 'Our main Strip venue. Chandelier Bar, Marquee, Secret Pizza, Beauty & Essex — all here.',
    routes: [
      {
        from: 'vdara',
        label: 'From Vdara',
        minutes: 8,
        steps: [
          'Exit Vdara lobby and take the indoor walkway toward Bellagio',
          'Walk through Bellagio — follow signs toward the Cosmopolitan',
          'Take the pedestrian walkway connecting Bellagio directly to the Cosmopolitan',
          'Fully indoors the whole way — no going outside',
        ],
      },
      {
        from: 'aria',
        label: 'From Aria',
        minutes: 8,
        steps: [
          'Aria is deceptively shaped — find the Alibi bar. The exit nearest to it points you toward the Cosmopolitan.',
          'Take the free Aria Express tram (signs from casino floor)',
          'One stop north to The Cosmopolitan station',
          'Exit into the Boulevard Tower — you\'re on Level 1',
        ],
      },
      {
        from: 'planet-hollywood',
        label: 'From Planet Hollywood',
        minutes: 5,
        steps: [
          'Walk toward Las Vegas Blvd on the north side of Planet Hollywood',
          'Take the pedestrian bridge over Las Vegas Blvd — it drops you directly into Level 2 of the Cosmopolitan',
        ],
      },
    ],
  },
  {
    id: 'aria',
    name: 'Aria Resort & Casino',
    short: 'Aria',
    coords: [-115.1772, 36.1072],
    type: 'hotel',
    color: '#38BDF8',
    description: 'Adjacent to Vdara. Deceptively shaped inside — use the exit nearest the Alibi bar to navigate to and from the Cosmopolitan. Aria Express tram also runs to Cosmo and Bellagio.',
    routes: [
      {
        from: 'vdara',
        label: 'From Vdara',
        minutes: 3,
        steps: [
          'Walk out of Vdara\'s main lobby heading east',
          '2-minute walk — follow signs to Aria',
          'Tip: Aria is deceptively shaped. Find the Alibi bar inside — the exit nearest to it is your reference point for getting to and from the Cosmopolitan.',
        ],
      },
    ],
  },
  {
    id: 'planet-hollywood',
    name: 'Planet Hollywood',
    short: 'Planet Hollywood',
    coords: [-115.1709, 36.1098],
    type: 'hotel',
    color: '#38BDF8',
    description: 'Across the Strip from the CityCenter area. Connected to the Cosmopolitan via pedestrian bridge.',
    routes: [
      {
        from: 'vdara',
        label: 'From Vdara',
        minutes: 18,
        steps: [
          'Walk through Aria → Crystals → Cosmopolitan (~12 min)',
          'Cross the pedestrian bridge at Level 2 of the Cosmo over Las Vegas Blvd',
        ],
      },
    ],
  },
  {
    id: 'el-cortez',
    name: 'El Cortez Hotel & Casino',
    short: 'El Cortez',
    coords: [-115.1389, 36.1686],
    type: 'landmark',
    color: '#FFD700',
    description: 'Downtown legend. Boarding pass deal: free slot play + $25 blackjack match + free drink. First stop on the Fremont Crawl.',
    routes: [
      {
        from: 'vdara',
        label: 'From Vdara',
        minutes: 15,
        steps: [
          'Rideshare recommended (~10 min, ~$12)',
          'Drop off at 600 E Fremont St',
          'Players Club desk is just inside the main entrance',
        ],
      },
    ],
  },
  {
    id: 'fremont',
    name: 'Fremont Street Experience',
    short: 'Fremont St',
    coords: [-115.1408, 36.1691],
    type: 'event',
    color: '#22D3EE',
    description: 'Friday Night Crawl. The canopy, the bars, the zip line. Free light shows every hour 6 PM–2 AM.',
    routes: [
      {
        from: 'vdara',
        label: 'From Vdara',
        minutes: 15,
        steps: [
          'Rideshare (~10 min, ~$12 from CityCenter)',
          'Meet at the main canopy entrance near Casino Center Blvd',
        ],
      },
    ],
  },
  {
    id: 'the-d',
    name: 'The D Casino',
    short: 'The D',
    coords: [-115.1425, 36.1694],
    type: 'landmark',
    color: '#FFD700',
    description: 'Fremont Crawl congregation spot. Head straight to the escalators just inside the main entrance and ride up to the 2nd floor — open bar area, good views down onto the canopy, easy to find the group.',
    routes: [
      {
        from: 'fremont',
        label: 'From Fremont St Experience',
        minutes: 2,
        steps: [
          'Walk west along the Fremont canopy',
          'The D is on the south side, roughly mid-canopy at 301 Fremont St',
          'Enter main doors → take escalators up → 2nd floor bar area on your right',
        ],
      },
    ],
  },
  {
    id: 'first-street-stage',
    name: '1st Street Stage',
    short: '1st St Stage',
    coords: [-115.1449, 36.1712],
    type: 'event',
    color: '#22D3EE',
    description: 'Live music stage at the west end of the Fremont canopy near 1st Street. Free acts most nights — check the FSE schedule. Good landmark for meet-ups since it\'s easy to spot.',
    routes: [
      {
        from: 'fremont',
        label: 'From Fremont St Experience',
        minutes: 3,
        steps: [
          'Walk west along the canopy from the main entrance',
          'Stage is on your left just before 1st Street — you\'ll hear it before you see it',
        ],
      },
    ],
  },
  // ── Fremont East Entertainment District ──────────────────────
  {
    id: 'we-all-scream',
    name: 'We All Scream',
    short: 'We All Scream',
    coords: [-115.1399245, 36.1687906],
    type: 'event',
    color: '#C084FC',
    description: 'The best club energy in Fremont East. Packed dancefloor, great DJs, crowd that\'s actually there to party. This is the move when you want to go hard.',
    routes: [
      {
        from: 'fremont',
        label: 'From Fremont St',
        minutes: 5,
        steps: [
          'Head east on Fremont past El Cortez',
          'Fremont East District starts around 7th St — keep walking east',
          'We All Scream is roughly at 8th & Fremont',
        ],
      },
    ],
  },
  {
    id: 'disco-pussy',
    name: 'Disco Pussy',
    short: 'Disco Pussy',
    coords: [-115.139891, 36.1690396],
    type: 'event',
    color: '#F472B6',
    description: 'Loud, dark, absurdly fun. Dive bar meets disco — no pretense, cheap drinks, exactly the kind of place that makes Fremont East worth the detour.',
    routes: [
      {
        from: 'fremont',
        label: 'From Fremont St',
        minutes: 6,
        steps: [
          'Head east past El Cortez into the Fremont East district',
          'Disco Pussy is near 9th & Fremont — easy to spot',
        ],
      },
    ],
  },
  {
    id: 'lucky-day',
    name: 'Lucky Day',
    short: 'Lucky Day',
    coords: [-115.1398434, 36.169045],
    type: 'landmark',
    color: '#22D3EE',
    description: 'A more laid-back cocktail bar for a drink between stops. Good vibes without the full club energy — a solid spot to regroup.',
    routes: [
      {
        from: 'fremont',
        label: 'From Fremont St',
        minutes: 4,
        steps: [
          'Walk east past El Cortez on Fremont',
          'Lucky Day is just past 6th St in the Fremont East stretch',
        ],
      },
    ],
  },
  {
    id: 'circa',
    name: 'Circa Resort & Casino',
    short: 'Circa',
    coords: [-115.1457, 36.1713],
    type: 'hotel',
    color: '#C084FC',
    description: 'Sunday Stadium Swim. Six pools, 143-ft screen. Meetup at noon. Rideshare from CityCenter ~10 min.',
    routes: [
      {
        from: 'vdara',
        label: 'From Vdara',
        minutes: 15,
        steps: [
          'Rideshare from CityCenter (~10 min, ~$12)',
          'Stadium Swim entrance is on the west side of the casino',
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// Indoor venue definitions
// ─────────────────────────────────────────────────────────────────

export interface VenueFloor {
  id: string;
  label: string;       // "Level 1"
  title: string;       // "Casino Floor"
  subtitle: string;
  svgKey: string;      // maps to a hand-crafted SVG component
}

export interface Venue {
  id: string;
  name: string;
  floors: VenueFloor[];
}

export const INDOOR_VENUES: Venue[] = [
  {
    id: 'cosmopolitan',
    name: 'The Cosmopolitan',
    floors: [
      { id: 'cosmo-l1',   label: 'Level 1',   title: 'Casino Floor',          subtitle: 'Strip entrance · Chandelier Bar · Vesper Bar · Casino', svgKey: 'cosmo-l1' },
      { id: 'cosmo-l15',  label: 'Level 1.5', title: 'Chandelier Bar — Middle',subtitle: 'The Verbena · Black light UV menu', svgKey: 'cosmo-l15' },
      { id: 'cosmo-l2',   label: 'Level 2',   title: 'Marquee + Dining',       subtitle: 'Marquee nightclub · Wicked Spoon · PH bridge · Crystals link', svgKey: 'cosmo-l2' },
      { id: 'cosmo-l3',   label: 'Level 3',   title: 'Restaurant Row',         subtitle: 'Secret Pizza (hidden!) · Beauty & Essex · Jaleo · Blue Ribbon', svgKey: 'cosmo-l3' },
    ],
  },
  {
    id: 'aria',
    name: 'Aria',
    floors: [
      { id: 'aria-casino', label: 'Casino', title: 'Casino Floor', subtitle: 'Main entrance · Table games · Poker room · Shops at Crystals exit · Tram', svgKey: 'aria-casino' },
    ],
  },
  {
    id: 'vdara',
    name: 'Vdara',
    floors: [
      { id: 'vdara-lobby', label: 'Lobby', title: 'Lobby Level', subtitle: 'Check-in · Café Vdara · Pool deck access · Aria walkway', svgKey: 'vdara-lobby' },
    ],
  },
];
