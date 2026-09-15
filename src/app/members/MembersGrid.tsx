'use client';

import { useState, useMemo } from 'react';
import type { Member } from '@/lib/types';
import { CREWS, CREW_KEYS, type CrewKey } from '@/lib/crews';

// ─── Avatar ring ────────────────────────────────────────────────────────────
// Renders SVG arcs OUTSIDE the avatar circle, one per crew, equal arc length.
// The avatar itself stays at its original size.

const RING_STROKE = 3;       // ring line width
const RING_GAP = 3;          // gap between segments (px along circumference)
const RING_OFFSET = 3;       // how far outside the avatar the ring sits
const AVATAR_SIZE = 64;
const RING_SVG_SIZE = AVATAR_SIZE + (RING_OFFSET + RING_STROKE) * 2;
const RING_R = RING_SVG_SIZE / 2 - RING_STROKE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

function AvatarRing({ colors }: { colors: string[] }) {
  if (colors.length === 0) return null;

  const totalGap = colors.length > 1 ? RING_GAP * colors.length : 0;
  const segLen = (CIRCUMFERENCE - totalGap) / colors.length;
  const cx = RING_SVG_SIZE / 2;
  const cy = RING_SVG_SIZE / 2;

  return (
    <svg
      width={RING_SVG_SIZE}
      height={RING_SVG_SIZE}
      style={{
        position: 'absolute',
        top: -(RING_OFFSET + RING_STROKE),
        left: -(RING_OFFSET + RING_STROKE),
        transform: 'rotate(-90deg)',
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      {colors.map((color, i) => {
        const start = i * (segLen + (colors.length > 1 ? RING_GAP : 0));
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={RING_R}
            fill="none"
            stroke={color}
            strokeWidth={RING_STROKE}
            strokeDasharray={`${segLen} ${CIRCUMFERENCE - segLen}`}
            strokeDashoffset={-start}
            strokeLinecap={colors.length > 1 ? 'round' : 'butt'}
          />
        );
      })}
    </svg>
  );
}

// ─── Card border ────────────────────────────────────────────────────────────
// Uses CSS conic-gradient through a transparent border.
// Each crew gets an equal slice of the 360° cone.

function cardBorderStyle(colors: string[]): React.CSSProperties {
  const primary = colors[0];
  if (!primary) return { border: '1px solid rgba(212,175,55,0.2)' };
  return { border: `1.5px solid ${primary}60` };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #D4AF37, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #D4AF37)',
  'linear-gradient(135deg, #38BDF8, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #38BDF8)',
  'linear-gradient(135deg, #D4AF37, #38BDF8)',
];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Types ──────────────────────────────────────────────────────────────────

type Filter = 'all' | CrewKey;
type Sort = 'default' | 'name' | 'crew';

// ─── Main component ─────────────────────────────────────────────────────────

export default function MembersGrid({ members }: { members: Member[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('default');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: members.length };
    for (const key of CREW_KEYS) {
      c[key] = members.filter((m) => m.group?.includes(key)).length;
    }
    return c;
  }, [members]);

  const visible = useMemo(() => {
    const filtered =
      filter === 'all' ? members : members.filter((m) => m.group?.includes(filter));
    if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'crew') {
      return [...filtered].sort((a, b) => {
        const ai = a.group?.length ? CREW_KEYS.indexOf(a.group[0] as CrewKey) : 999;
        const bi = b.group?.length ? CREW_KEYS.indexOf(b.group[0] as CrewKey) : 999;
        return ai !== bi ? ai - bi : a.name.localeCompare(b.name);
      });
    }
    return filtered;
  }, [members, filter, sort]);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <FilterPill active={filter === 'all'} color="var(--gold)" glow="rgba(212,175,55,0.25)" onClick={() => setFilter('all')}>
          All <Count n={counts.all} active={filter === 'all'} color="var(--gold)" />
        </FilterPill>
        {CREW_KEYS.map((key) => {
          const crew = CREWS[key];
          return (
            <FilterPill key={key} active={filter === key} color={crew.color} glow={crew.glow} onClick={() => setFilter(key)}>
              {crew.short}
              {counts[key] > 0 && <Count n={counts[key]} active={filter === key} color={crew.color} />}
            </FilterPill>
          );
        })}
      </div>

      {/* Sort */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-dim uppercase tracking-widest">Sort</span>
          {(['default', 'name', 'crew'] as Sort[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="text-xs uppercase tracking-widest px-3 py-1 rounded-full transition-colors"
              style={{
                color: sort === s ? 'var(--gold)' : 'var(--text-dim)',
                background: sort === s ? 'rgba(212,175,55,0.1)' : 'transparent',
                border: `1px solid ${sort === s ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {s === 'default' ? 'Default' : s === 'name' ? 'A–Z' : 'By Crew'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="text-center text-text-dim py-12">No members in this group yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {visible.map((member, i) => {
            const groups = member.group ?? [];
            const colors = groups.map((g) => CREWS[g as CrewKey]?.color).filter(Boolean) as string[];
            const avatarBg = member.photo_url
              ? undefined
              : FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length];

            return (
              <a
                key={member.id}
                href={`/members/${member.slug}`}
                className="event-card rounded-lg p-5 text-center block transition-all"
                style={cardBorderStyle(colors)}
              >
                {/* Avatar — stays at original 64px; ring sits outside via absolute SVG */}
                <div className="relative mx-auto mb-3" style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
                  <AvatarRing colors={colors} />
                  <div
                    className="avatar"
                    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, fontSize: '1.25rem', background: avatarBg }}
                  >
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      initials(member.name)
                    )}
                  </div>
                </div>

                <p className="font-display text-lg text-gold leading-tight mb-1.5">{member.name}</p>

                {/* Crew badge pills */}
                {groups.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mb-1">
                    {groups.map((g) => {
                      const crew = CREWS[g as CrewKey];
                      if (!crew) return null;
                      return (
                        <span
                          key={g}
                          className="inline-block text-xs px-2 py-0.5 rounded-full tracking-wide"
                          style={{ color: crew.color, background: crew.color + '18', border: `1px solid ${crew.color}35` }}
                        >
                          {crew.short}
                        </span>
                      );
                    })}
                  </div>
                )}

                {member.bio && <p className="text-xs text-text-dim line-clamp-1 mt-1">{member.bio}</p>}
                {member.is_referee && <p className="text-xs text-sky mt-1">Referee</p>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterPill({
  active, color, glow, onClick, children,
}: {
  active: boolean; color: string; glow: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full transition-all"
      style={{
        color: active ? (color === 'var(--gold)' ? '#0a0a0f' : '#fff') : 'var(--text-dim)',
        background: active ? color : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
        boxShadow: active ? `0 0 14px ${glow}` : 'none',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

function Count({ n, active, color }: { n: number; active: boolean; color: string }) {
  return (
    <span
      className="text-xs rounded-full px-1.5 py-0.5 leading-none tabular-nums"
      style={{
        background: active ? 'rgba(0,0,0,0.25)' : color + '22',
        color: active ? (color === 'var(--gold)' ? '#0a0a0f' : '#fff') : color,
        minWidth: '1.25rem',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      {n}
    </span>
  );
}
