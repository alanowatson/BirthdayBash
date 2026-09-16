'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import IndoorGuide from './IndoorGuide';

// Mapbox must be dynamically imported — it uses browser APIs not available in SSR
const StripMap = dynamic(() => import('./StripMap'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{ height: 520, border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.02)' }}
    >
      <p className="text-text-dim text-sm">Loading map…</p>
    </div>
  ),
});

type MapTab = 'strip' | 'downtown' | 'indoor';

const TABS: { id: MapTab; label: string; desc: string }[] = [
  { id: 'strip',    label: '◆ Strip · CityCenter',  desc: 'Cosmopolitan · Aria · Planet Hollywood · walking routes' },
  { id: 'downtown', label: '✦ Downtown · Fremont',   desc: 'El Cortez · Circa · Fremont St Crawl · better odds' },
  { id: 'indoor',   label: '⬡ Indoor Guide',         desc: 'Cosmopolitan floor-by-floor · Chandelier Bar · Secret Pizza' },
];

export default function TabSwitcher() {
  const [activeTab, setActiveTab] = useState<MapTab>('strip');

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-start px-5 py-3 rounded-xl transition-all text-left"
            style={{
              border: `1px solid ${activeTab === tab.id ? 'var(--gold)' : 'rgba(212,175,55,0.15)'}`,
              background: activeTab === tab.id ? 'rgba(212,175,55,0.07)' : 'transparent',
            }}
          >
            <span
              className="font-display text-base"
              style={{ color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-dim)' }}
            >
              {tab.label}
            </span>
            <span className="text-xs text-text-dim mt-0.5">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: 520 }}>
        {activeTab === 'indoor' ? (
          <IndoorGuide />
        ) : (
          <StripMap key={activeTab} initialView={activeTab} hideToggle />
        )}
      </div>
    </div>
  );
}
