'use client';

import { useState, useMemo } from 'react';
import type { Member } from '@/lib/types';
import { CREWS, CREW_KEYS, type CrewKey } from '@/lib/crews';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

/** CSS gradient string built from however many crew colors a member has. */
function crewRing(groups: string[]): string {
  const colors = groups.map((g) => CREWS[g as CrewKey]?.color).filter(Boolean) as string[];
  if (colors.length === 0) return 'rgba(212,175,55,0.3)';
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}, ${colors[0]}80)`;
  return `linear-gradient(135deg, ${colors.join(', ')})`;
}

/** Background fill for the initials avatar. */
function crewAvatarBg(groups: string[]): string {
  const colors = groups.map((g) => CREWS[g as CrewKey]?.color).filter(Boolean) as string[];
  if (colors.length === 0) return 'linear-gradient(135deg, #D4AF37, #3B82F6)';
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}40, ${colors[0]}15)`;
  const stops = colors.map((c, i) => `${c}${i % 2 === 0 ? '40' : '20'}`).join(', ');
  return `linear-gradient(135deg, ${stops})`;
}

type Filter = 'all' | CrewKey;
type Sort = 'default' | 'name' | 'crew';

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
      filter === 'all'
        ? members
        : members.filter((m) => m.group?.includes(filter));

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
        <FilterPill
          active={filter === 'all'}
          color="var(--gold)"
          glow="rgba(212,175,55,0.25)"
          onClick={() => setFilter('all')}
        >
          All
          <Count n={counts.all} active={filter === 'all'} color="var(--gold)" />
        </FilterPill>
        {CREW_KEYS.map((key) => {
          const crew = CREWS[key];
          return (
            <FilterPill
              key={key}
              active={filter === key}
              color={crew.color}
              glow={crew.glow}
              onClick={() => setFilter(key)}
            >
              {crew.short}
              {counts[key] > 0 && (
                <Count n={counts[key]} active={filter === key} color={crew.color} />
              )}
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
          {visible.map((member) => {
            const groups = member.group ?? [];
            const primaryCrew = groups.length ? CREWS[groups[0] as CrewKey] : null;
            return (
              <a
                key={member.id}
                href={`/members/${member.slug}`}
                className="event-card rounded-lg p-5 text-center block transition-all"
                style={{
                  border: `1px solid ${primaryCrew ? primaryCrew.color + '50' : 'rgba(212,175,55,0.2)'}`,
                }}
              >
                {/* Avatar with crew-colored ring (gradient if multiple groups) */}
                <div
                  className="mx-auto mb-3 rounded-full flex-shrink-0"
                  style={{ width: 68, height: 68, padding: 3, background: crewRing(groups) }}
                >
                  <div
                    className="avatar w-full h-full"
                    style={{
                      fontSize: '1.25rem',
                      background: member.photo_url ? undefined : crewAvatarBg(groups),
                    }}
                  >
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      initials(member.name)
                    )}
                  </div>
                </div>

                <p className="font-display text-lg text-gold leading-tight mb-1.5">{member.name}</p>

                {/* One pill per crew */}
                {groups.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mb-1">
                    {groups.map((g) => {
                      const crew = CREWS[g as CrewKey];
                      if (!crew) return null;
                      return (
                        <span
                          key={g}
                          className="inline-block text-xs px-2 py-0.5 rounded-full tracking-wide"
                          style={{
                            color: crew.color,
                            background: crew.color + '18',
                            border: `1px solid ${crew.color}35`,
                          }}
                        >
                          {crew.short}
                        </span>
                      );
                    })}
                  </div>
                )}

                {member.bio && (
                  <p className="text-xs text-text-dim line-clamp-1 mt-1">{member.bio}</p>
                )}
                {member.is_referee && (
                  <p className="text-xs text-sky mt-1">Referee</p>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active, color, glow, onClick, children,
}: {
  active: boolean;
  color: string;
  glow: string;
  onClick: () => void;
  children: React.ReactNode;
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
