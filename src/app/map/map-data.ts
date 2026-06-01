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
    coords: [-115.1389, 36.1691],
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
    id: 'circa',
    name: 'Circa Resort & Casino',
    short: 'Circa',
    coords: [-115.1447, 36.1713],
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
