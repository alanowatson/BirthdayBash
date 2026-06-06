'use client';

import dynamic from 'next/dynamic';

const StripMap = dynamic(() => import('@/app/map/StripMap'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{ height: 420, border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.02)' }}
    >
      <p className="text-text-dim text-sm">Loading map…</p>
    </div>
  ),
});

export default function EventMap({ initialView }: { initialView: 'strip' | 'downtown' }) {
  return <StripMap initialView={initialView} />;
}
