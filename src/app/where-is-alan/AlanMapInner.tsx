'use client';

import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Default to Fremont Street area while waiting for a ping
const FREMONT = { longitude: -115.1430, latitude: 36.1703, zoom: 16.5 };

type Location = { lat: number; lon: number; updated_at: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ViewState = { longitude: number; latitude: number; zoom: number; [key: string]: any };

export default function AlanMapInner({ initial }: { initial: Location }) {
  const [location, setLocation] = useState<Location>(initial);
  const [viewport, setViewport] = useState<ViewState>({
    longitude: initial.lat && initial.lon ? initial.lon : FREMONT.longitude,
    latitude:  initial.lat && initial.lon ? initial.lat : FREMONT.latitude,
    zoom:      initial.lat && initial.lon ? 17 : FREMONT.zoom,
  });

  // Re-evaluate staleness every 30 s so the overlay appears automatically when Alan stops
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const STALE_MS = 3 * 60 * 1000; // 3 minutes
  const isLive = (now - new Date(location.updated_at).getTime()) < STALE_MS;

  // Supabase Realtime — fires instantly when the row changes
  useEffect(() => {
    const channel = supabaseBrowser
      .channel('alan-location')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'location' },
        (payload) => {
          const row = payload.new as Location;
          setLocation(row);
          if (row.lat || row.lon) {
            setViewport((v) => ({ ...v, latitude: row.lat, longitude: row.lon }));
          }
        }
      )
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, []);

  // Polling fallback — catches updates if Realtime isn't wired up
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch('/api/location');
        if (!res.ok) return;
        const row: Location = await res.json();
        setLocation((prev) => {
          if (prev.updated_at === row.updated_at) return prev;
          if (row.lat || row.lon) {
            setViewport((v) => ({ ...v, latitude: row.lat, longitude: row.lon }));
          }
          return row;
        });
      } catch { /* silent — don't crash the map on a failed poll */ }
    }, 10_000);
    return () => clearInterval(poll);
  }, []);

  const lastUpdated = isLive
    ? new Date(location.updated_at).toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <p className="text-text-dim text-sm">Mapbox token missing.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(212,175,55,0.15)' }}
      >
        <div className="flex items-center gap-2.5">
          {isLive ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: '#22c55e' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ background: '#22c55e' }}
                />
              </span>
              <span className="text-xs uppercase tracking-widest" style={{ color: '#22c55e' }}>
                Live
              </span>
            </>
          ) : (
            <>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)' }}
              />
              <span className="text-xs uppercase tracking-widest text-text-dim">
                Waiting for Alan…
              </span>
            </>
          )}
        </div>
        {lastUpdated && (
          <p className="text-xs text-text-dim tabular-nums">Last seen {lastUpdated} PT</p>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map
          {...viewport}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMove={(evt: any) => setViewport(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {isLive && (
            <Marker longitude={location.lon} latitude={location.lat} anchor="center">
              {/* Pulsing gold Alan marker */}
              <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
                {/* Outermost slow pulse */}
                <div
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: 56,
                    height: 56,
                    background: 'rgba(212,175,55,0.12)',
                    animationDuration: '2s',
                  }}
                />
                {/* Middle ring */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    background: 'rgba(212,175,55,0.18)',
                    border: '1px solid rgba(212,175,55,0.5)',
                  }}
                />
                {/* Inner gold dot with "A" */}
                <div
                  className="relative z-10 rounded-full flex items-center justify-center"
                  style={{
                    width: 22,
                    height: 22,
                    background: 'var(--gold)',
                    boxShadow: '0 0 14px rgba(212,175,55,0.9), 0 0 28px rgba(212,175,55,0.4)',
                  }}
                >
                  <span className="font-display text-xs font-bold" style={{ color: '#0a0a14', fontSize: 11 }}>
                    A
                  </span>
                </div>
              </div>
            </Marker>
          )}
        </Map>

        {/* "Not live" overlay — shown before Alan starts broadcasting */}
        {!isLive && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.35)' }}
          >
            <div
              className="px-6 py-4 rounded-xl text-center"
              style={{
                background: 'rgba(10,10,20,0.9)',
                border: '1px solid rgba(212,175,55,0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="font-display text-xl text-gold mb-1">Not sharing right now.</p>
              <p className="text-text-dim text-sm">Alan will turn this on when the group is out.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
