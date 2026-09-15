export const CREWS = {
  'high-school': { label: 'High School Buddies', short: 'High School', color: '#9CA3AF', glow: 'rgba(156,163,175,0.2)' },
  'arizona':     { label: 'Arizona Crew',        short: 'Arizona',     color: '#C07350', glow: 'rgba(192,115,80,0.2)'  },
  'nyc':         { label: 'NYC',                 short: 'NYC',         color: '#6B8FA3', glow: 'rgba(107,143,163,0.2)' },
  'dancers':     { label: 'Dancers',             short: 'Dancers',     color: '#C27BA0', glow: 'rgba(194,123,160,0.2)' },
  'vegas-vets':  { label: 'Vegas Veterans',      short: 'Vegas Vets',  color: '#D4AF37', glow: 'rgba(212,175,55,0.25)' },
} as const;

export type CrewKey = keyof typeof CREWS;
export const CREW_KEYS = Object.keys(CREWS) as CrewKey[];
