'use client';

import { useState } from 'react';
import FloorImageViewer, { type EdgeLabel } from './FloorImageViewer';

interface Floor {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  src: string;
  placeholderInstructions: string;
  edgeLabels: EdgeLabel[];
  highlights: string[];
}

const COSMO_FLOORS: Floor[] = [
  {
    id: 'l1',
    label: 'Level 1',
    title: 'Casino Floor',
    subtitle: 'Strip entrance · Chandelier Bar · Vesper Bar · Taxi / Rideshare (west side)',
    src: '/maps/cosmo-l1.png',
    placeholderInstructions: 'Open Google Maps → search "The Cosmopolitan Las Vegas" → zoom in until indoor map appears → select "Level 1" → screenshot and save as /public/maps/cosmo-l1.png',
    edgeLabels: [
      { edge: 'left', label: 'Taxi · Rideshare', color: '#4ade80' },
    ],
    highlights: [
      'Strip entrance on the east side (Las Vegas Blvd)',
      'Chandelier Bar — center of the casino. Take the stairs inside it up to the mezzanine (Level 1.5) for The Verbena and the UV menu',
      'Vesper Bar — west side of the casino, near the check-in lobby',
      'Taxi & rideshare pickup — west side exit near check-in, not the Strip entrance',
    ],
  },
  {
    id: 'l2',
    label: 'Level 2',
    title: 'Marquee + Connections',
    subtitle: 'Marquee nightclub · Vdara / Aria walkway · Planet Hollywood bridge',
    src: '/maps/cosmo-l2.png',
    placeholderInstructions: 'Select "Level 2" from the Google Maps floor picker → screenshot and save as /public/maps/cosmo-l2.png',
    edgeLabels: [
      { edge: 'left',         label: 'Vdara · Aria · Bellagio', color: '#c084fc' },
      { edge: 'bottom-right', label: 'Planet Hollywood bridge', color: '#c084fc' },
    ],
    highlights: [
      'Marquee nightclub entrance — Saturday Night meetup at 10:15 PM outside the doors',
      'Left exit (west): walkway connects through Bellagio to Vdara and Aria',
      'Right exit (east): pedestrian bridge over Las Vegas Blvd directly into Planet Hollywood',
      'Wicked Spoon buffet — good pre-night fuel on this level',
    ],
  },
  {
    id: 'l3',
    label: 'Level 3',
    title: 'Restaurant Row',
    subtitle: 'Secret Pizza (hidden) · Beauty & Essex · Jaleo · Blue Ribbon Sushi',
    src: '/maps/cosmo-l3.png',
    placeholderInstructions: 'Select "Level 3" from the Google Maps floor picker → screenshot and save as /public/maps/cosmo-l3.png',
    edgeLabels: [],
    highlights: [
      'Secret Pizza — no signage. Find the unmarked hallway lined with vinyl records near Jaleo and Blue Ribbon Sushi. Follow it to the back. Open 11am–4am. Slices $6–7.',
      'Beauty & Essex — enter via the pawn shop. Social Hour Sun–Thu 5–7 PM: every dish and cocktail $10.',
      'Jaleo (José Andrés Spanish) and Blue Ribbon Sushi flank the Secret Pizza hallway',
    ],
  },
];

export default function IndoorGuide() {
  const [activeFloorId, setActiveFloorId] = useState('l1');
  const floor = COSMO_FLOORS.find((f) => f.id === activeFloorId)!;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-dim mb-0.5">The Cosmopolitan of Las Vegas</p>
        <p className="text-text-dim text-sm">Scroll or pinch to zoom · drag to pan</p>
      </div>

      {/* Floor tabs */}
      <div className="flex gap-2 flex-wrap">
        {COSMO_FLOORS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFloorId(f.id)}
            className="px-4 py-2 rounded-full text-xs tracking-wide transition-all"
            style={{
              border: `1px solid ${activeFloorId === f.id ? 'var(--gold)' : 'rgba(212,175,55,0.2)'}`,
              background: activeFloorId === f.id ? 'rgba(212,175,55,0.1)' : 'transparent',
              color: activeFloorId === f.id ? 'var(--gold)' : 'var(--text-dim)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Floor title */}
      <div
        className="px-5 py-3 rounded-xl"
        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}
      >
        <p className="font-display text-gold text-lg leading-tight">{floor.title}</p>
        <p className="text-text-dim text-xs mt-0.5">{floor.subtitle}</p>
      </div>

      {/* Image + side panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <FloorImageViewer
            key={floor.id}
            src={floor.src}
            alt={`Cosmopolitan ${floor.label} floor plan`}
            edgeLabels={floor.edgeLabels}
            placeholderInstructions={floor.placeholderInstructions}
          />
        </div>

        {/* Key spots */}
        <div className="lg:w-64 flex flex-col gap-3">
          <div
            className="rounded-xl p-4"
            style={{ border: '1px solid rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.07)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(251,191,36,0.7)' }}>
              ⚠️ Google Maps pins here are unreliable
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(251,191,36,0.9)' }}>Level 1 — Casino Floor</p>
                <p className="text-xs leading-relaxed text-text-dim">The Chandelier bar. The Henry.</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(251,191,36,0.9)' }}>Level 2 — Dining &amp; Nightlife</p>
                <p className="text-xs leading-relaxed text-text-dim">Momofuku, China Poblano, Beauty &amp; Essex (near escalators), Ghost Donkey, Block 16 Urban Food Hall (Lardo, District Donuts, and more).</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(251,191,36,0.9)' }}>Level 3 — Fine Dining</p>
                <p className="text-xs leading-relaxed text-text-dim">STK, Scarpetta, Jaleo, Wicked Spoon Buffet. And the hidden Secret Pizza — down a hallway plastered with vintage records.</p>
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.04)' }}
          >
            <p className="text-xs uppercase tracking-widest text-text-dim mb-3">Key spots</p>
            <ul className="flex flex-col gap-2.5">
              {floor.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-dim leading-snug">
                  <span className="text-gold mt-0.5 flex-shrink-0">◆</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div
            className="rounded-xl p-4"
            style={{ border: '1px solid rgba(56,189,248,0.15)', background: 'rgba(56,189,248,0.04)' }}
          >
            <p className="text-xs uppercase tracking-widest text-text-dim mb-2">From Vdara</p>
            <p className="text-xs text-text-dim leading-relaxed">
              Take the indoor walkway from Vdara to Bellagio, then follow the pedestrian walkway from Bellagio into the Cosmopolitan. Fully indoors — no going outside.
            </p>
            <p className="text-xs uppercase tracking-widest text-text-dim mt-3 mb-2">From Planet Hollywood</p>
            <p className="text-xs text-text-dim leading-relaxed">
              Use the pedestrian bridge on Level 2 across Las Vegas Blvd. Drops you directly into the Cosmopolitan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
