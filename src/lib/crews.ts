export const CREWS = {
  'high-school': { label: 'High School Buddies', short: 'High School', color: '#C0C0C0', glow: 'rgba(192,192,192,0.25)' },
  'arizona':     { label: 'Arizona Crew',        short: 'Arizona',     color: '#B91C1C', glow: 'rgba(185,28,28,0.25)'  },
  'nyc':         { label: 'NYC',                 short: 'NYC',         color: '#38BDF8', glow: 'rgba(56,189,248,0.25)'  },
  'dancers':     { label: 'Dancers',             short: 'Dancers',     color: '#A855F7', glow: 'rgba(168,85,247,0.25)' },
  'vegas-vets':  { label: 'Vegas Veterans',      short: 'Vegas Vets',  color: '#D4AF37', glow: 'rgba(212,175,55,0.25)' },
} as const;

export type CrewKey = keyof typeof CREWS;
export const CREW_KEYS = Object.keys(CREWS) as CrewKey[];
