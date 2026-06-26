'use client';

import { useState, useMemo } from 'react';
import type { Travel } from '@/lib/types';

type TravelWithMember = Travel & {
  members: { name: string; photo_url: string | null; slug: string } | null;
};

type SortKey = 'name' | 'arrives_at' | 'departs_at' | 'accommodation';
type SortDir = 'asc' | 'desc';

function vegasTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TravelTable({ entries }: { entries: TravelWithMember[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('arrives_at');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      let av: string | null;
      let bv: string | null;

      if (sortKey === 'name')          { av = a.members?.name ?? null; bv = b.members?.name ?? null; }
      else if (sortKey === 'arrives_at') { av = a.arrives_at;  bv = b.arrives_at; }
      else if (sortKey === 'departs_at') { av = a.departs_at;  bv = b.departs_at; }
      else                               { av = a.accommodation; bv = b.accommodation; }

      // nulls always last regardless of direction
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;

      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [entries, sortKey, sortDir]);

  if (entries.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-dim text-sm">No travel plans shared yet — be the first.</p>
      </div>
    );
  }

  const thBase = 'text-left text-xs uppercase tracking-widest pb-3 pr-4 font-normal';
  const thStyle = { color: 'var(--text-dim)', borderBottom: '1px solid rgba(212,175,55,0.2)' };
  const tdStyle = { borderBottom: '1px solid rgba(255,255,255,0.04)' };

  function ColHeader({ col, label }: { col: SortKey; label: string }) {
    const active = sortKey === col;
    return (
      <th className={thBase} style={thStyle}>
        <button
          type="button"
          onClick={() => toggleSort(col)}
          className="flex items-center gap-1 transition-colors hover:text-gold"
          style={{ color: active ? 'var(--gold)' : 'var(--text-dim)' }}
        >
          {label}
          <span className="text-xs opacity-60">
            {active ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
          </span>
        </button>
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <ColHeader col="name"          label="Guest"     />
            <ColHeader col="arrives_at"    label="Arriving"  />
            <ColHeader col="departs_at"    label="Departing" />
            <ColHeader col="accommodation" label="Staying"   />
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => {
            const name     = entry.members?.name ?? 'Unknown';
            const photo    = entry.members?.photo_url;
            const isFlying = entry.travel_mode === 'flying';

            return (
              <tr key={entry.id}>
                {/* Guest */}
                <td className="py-3 pr-4 align-top" style={tdStyle}>
                  <div className="flex items-center gap-2">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-display"
                        style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}
                      >
                        {name[0]}
                      </div>
                    )}
                    <div className="whitespace-nowrap">
                      <span style={{ color: 'var(--text)' }}>{name}</span>
                      <span className="ml-1.5 text-xs">{isFlying ? '✈️' : '🚗'}</span>
                    </div>
                  </div>
                </td>

                {/* Arriving */}
                <td className="py-3 pr-4 align-top" style={tdStyle}>
                  {entry.arrives_at ? (
                    <div>
                      <p style={{ color: 'var(--text)' }} className="whitespace-nowrap">{vegasTime(entry.arrives_at)}</p>
                      {isFlying && entry.arrival_airline && (
                        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
                          {entry.arrival_airline}{entry.arrival_flight ? ` ${entry.arrival_flight}` : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                </td>

                {/* Departing */}
                <td className="py-3 pr-4 align-top" style={tdStyle}>
                  {entry.departs_at ? (
                    <div>
                      <p style={{ color: 'var(--text)' }} className="whitespace-nowrap">{vegasTime(entry.departs_at)}</p>
                      {isFlying && entry.departure_airline && (
                        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
                          {entry.departure_airline}{entry.departure_flight ? ` ${entry.departure_flight}` : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                </td>

                {/* Staying */}
                <td className="py-3 align-top" style={tdStyle}>
                  {entry.accommodation
                    ? <span style={{ color: 'var(--text)' }}>{entry.accommodation}</span>
                    : <span style={{ color: 'var(--text-dim)' }}>—</span>
                  }
                  {entry.notes && (
                    <p className="text-xs italic mt-0.5" style={{ color: 'var(--text-dim)' }}>&ldquo;{entry.notes}&rdquo;</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
