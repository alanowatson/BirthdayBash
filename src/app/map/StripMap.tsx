'use client';

import { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LOCATIONS, type MapLocation } from './map-data';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Two map views: Strip (CityCenter) and Downtown (Fremont)
const VIEWS = {
  strip: { longitude: -115.1748, latitude: 36.1088, zoom: 15.2 },
  downtown: { longitude: -115.1430, latitude: 36.1703, zoom: 15.5 },
};

const STRIP_IDS = ['vdara', 'cosmopolitan', 'aria', 'planet-hollywood'];
const DOWNTOWN_IDS = ['el-cortez', 'fremont', 'circa'];

export default function StripMap({ initialView = 'strip' }: { initialView?: 'strip' | 'downtown' }) {
  const [activeView, setActiveView] = useState<'strip' | 'downtown'>(initialView);
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [activeRouteFrom, setActiveRouteFrom] = useState<string>('vdara');
  const [viewport, setViewport] = useState(VIEWS[initialView]);

  const switchView = useCallback((view: 'strip' | 'downtown') => {
    setActiveView(view);
    setSelected(null);
    setViewport(VIEWS[view]);
  }, []);

  const visibleIds = activeView === 'strip' ? STRIP_IDS : DOWNTOWN_IDS;
  const visibleLocations = LOCATIONS.filter((l) => visibleIds.includes(l.id));

  const activeRoute = selected?.routes?.find((r) => r.from === activeRouteFrom);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="flex items-center justify-center h-full rounded-xl text-center p-8"
        style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.04)' }}
      >
        <div>
          <p className="text-gold font-display text-xl mb-2">Map token missing</p>
          <p className="text-text-dim text-sm">
            Add <code className="text-gold bg-black/30 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...</code> to{' '}
            <code className="text-gold bg-black/30 px-1 rounded">.env.local</code>
          </p>
          <p className="text-text-dim text-xs mt-2">
            Get a free token at <a href="https://mapbox.com" className="text-gold underline" target="_blank" rel="noreferrer">mapbox.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* View toggle */}
      <div className="flex gap-2">
        {(['strip', 'downtown'] as const).map((v) => (
          <button
            key={v}
            onClick={() => switchView(v)}
            className="px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all"
            style={{
              border: `1px solid ${activeView === v ? 'var(--gold)' : 'rgba(212,175,55,0.2)'}`,
              background: activeView === v ? 'rgba(212,175,55,0.1)' : 'transparent',
              color: activeView === v ? 'var(--gold)' : 'var(--text-dim)',
            }}
          >
            {v === 'strip' ? '◆ Strip · CityCenter' : '✦ Downtown · Fremont'}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {/* Map */}
        <div className="h-[420px] lg:h-auto lg:flex-1 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
          <Map
            {...viewport}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMove={(evt: any) => setViewport(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <NavigationControl position="top-right" showCompass={false} />
            <ScaleControl position="bottom-left" />

            {visibleLocations.map((loc) => (
              <Marker
                key={loc.id}
                longitude={loc.coords[0]}
                latitude={loc.coords[1]}
                anchor="bottom"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(e: any) => {
                  e.originalEvent.stopPropagation();
                  setSelected(loc);
                  setActiveRouteFrom('vdara');
                }}
              >
                <div
                  className="cursor-pointer transition-transform hover:scale-110"
                  style={{ filter: selected?.id === loc.id ? 'drop-shadow(0 0 8px ' + loc.color + ')' : undefined }}
                >
                  <div
                    className="w-4 h-4 rotate-45 border-2"
                    style={{
                      background: selected?.id === loc.id ? loc.color : loc.color + '60',
                      borderColor: loc.color,
                    }}
                  />
                  <div
                    className="text-xs font-display mt-1 text-center whitespace-nowrap"
                    style={{ color: loc.color, textShadow: '0 1px 3px rgba(0,0,0,0.9)', fontSize: 10 }}
                  >
                    {loc.short}
                  </div>
                </div>
              </Marker>
            ))}

            {selected && (
              <Popup
                longitude={selected.coords[0]}
                latitude={selected.coords[1]}
                onClose={() => setSelected(null)}
                closeButton={true}
                closeOnClick={false}
                maxWidth="240px"
                offset={16}
                style={{ maxWidth: 'min(240px, calc(100vw - 64px))' }}
              >
                <div style={{ background: '#0a0a14', padding: '12px', borderRadius: 8 }}>
                  <p style={{ color: selected.color, fontFamily: 'serif', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    {selected.name}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>
                    {selected.description}
                  </p>
                  {selected.routes && selected.routes.length > 1 && (
                    <p style={{ color: '#6b7280', fontSize: 11, fontStyle: 'italic' }}>
                      Select a starting point on the right →
                    </p>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>

        {/* Sidebar: location list + route directions */}
        <div className="lg:w-72 flex flex-col gap-3" style={{ minHeight: 0 }}>
          {/* Location list */}
          <div className="flex flex-col gap-2">
            {visibleLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => { setSelected(loc); setActiveRouteFrom('vdara'); setViewport((v) => ({ ...v, longitude: loc.coords[0], latitude: loc.coords[1] })); }}
                className="text-left px-4 py-3 rounded-xl transition-all"
                style={{
                  border: `1px solid ${selected?.id === loc.id ? loc.color + '60' : 'rgba(255,255,255,0.06)'}`,
                  background: selected?.id === loc.id ? loc.color + '0a' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: loc.color }} />
                  <span className="text-sm font-display" style={{ color: selected?.id === loc.id ? loc.color : 'var(--text)' }}>
                    {loc.short}
                  </span>
                </div>
                <p className="text-xs text-text-dim mt-0.5 ml-4 line-clamp-2">{loc.description}</p>
              </button>
            ))}
          </div>

          {/* Route directions panel */}
          {selected && selected.routes && selected.routes.length > 0 && (
            <div
              className="rounded-xl p-4 flex flex-col gap-3 mt-1"
              style={{ border: `1px solid ${selected.color}25`, background: selected.color + '06' }}
            >
              <p className="text-xs uppercase tracking-widest" style={{ color: selected.color }}>
                Getting to {selected.short}
              </p>

              {/* Route from selectors */}
              {selected.routes.length > 1 && (
                <div className="flex flex-wrap gap-1">
                  {selected.routes.map((r) => (
                    <button
                      key={r.from}
                      onClick={() => setActiveRouteFrom(r.from)}
                      className="text-xs px-2 py-1 rounded-full transition-all"
                      style={{
                        border: `1px solid ${activeRouteFrom === r.from ? selected.color + '80' : 'rgba(255,255,255,0.1)'}`,
                        background: activeRouteFrom === r.from ? selected.color + '15' : 'transparent',
                        color: activeRouteFrom === r.from ? selected.color : 'var(--text-dim)',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Steps */}
              {activeRoute && (
                <div>
                  {activeRoute.minutes > 0 && (
                    <p className="text-xs font-display mb-2" style={{ color: selected.color }}>
                      ~{activeRoute.minutes} min walk
                    </p>
                  )}
                  {activeRoute.steps.length > 0 ? (
                    <ol className="flex flex-col gap-2">
                      {activeRoute.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-xs text-text-dim leading-snug">
                          <span
                            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-display mt-0.5"
                            style={{ background: selected.color + '20', color: selected.color, fontSize: 9 }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs text-text-dim italic">You are here.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
