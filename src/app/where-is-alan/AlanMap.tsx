'use client';

import dynamic from 'next/dynamic';

const AlanMapInner = dynamic(() => import('./AlanMapInner'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center h-full"
      style={{ background: 'rgba(212,175,55,0.02)' }}
    >
      <p className="text-text-dim text-sm">Loading map…</p>
    </div>
  ),
});

type Location = { lat: number; lon: number; updated_at: string };

export default function AlanMap({ initial }: { initial: Location }) {
  return <AlanMapInner initial={initial} />;
}
