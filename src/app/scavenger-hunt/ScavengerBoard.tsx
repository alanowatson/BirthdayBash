'use client';

import { useState, useMemo } from 'react';
import type { ScavengerTask, ScavengerSuit } from '@/lib/types';
import ClaimButton from './ClaimButton';

// ── Shared suit data ──────────────────────────────────────────────────────────
export const SUIT_SYMBOL: Record<ScavengerSuit, string> = {
  diamonds: '♦',
  clubs: '♣',
  hearts: '♥',
  spades: '♠',
};

export const SUIT_COLOR: Record<ScavengerSuit, string> = {
  diamonds: '#ef4444',
  clubs: '#D4AF37',
  hearts: '#ef4444',
  spades: '#38BDF8',
};

const SUIT_ORDER: ScavengerSuit[] = ['diamonds', 'clubs', 'hearts', 'spades'];
const RANK_ORDER = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

// ── Desktop grid card ─────────────────────────────────────────────────────────
function TaskCard({ task, isAdmin }: { task: ScavengerTask; isAdmin: boolean }) {
  const symbol = SUIT_SYMBOL[task.suit];
  const color = SUIT_COLOR[task.suit];
  const claimed = task.is_claimed;

  return (
    <div
      className="flex flex-col h-full rounded-xl border p-4"
      style={{
        borderColor: claimed ? 'rgba(255,255,255,0.08)' : color + '40',
        background: claimed ? 'rgba(255,255,255,0.02)' : color + '08',
        opacity: claimed ? 0.55 : 1,
      }}
    >
      {/* Rank + suit on one line */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1 leading-none">
          <span
            className="font-display text-2xl"
            style={{ color: claimed ? 'rgba(255,255,255,0.25)' : color }}
          >
            {task.rank}
          </span>
          <span
            className="text-lg"
            style={{ color: claimed ? 'rgba(255,255,255,0.25)' : color }}
          >
            {symbol}
          </span>
        </div>
        {claimed ? (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              color: 'rgba(239,68,68,0.7)',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            CLAIMED
          </span>
        ) : (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ color, background: color + '18', border: `1px solid ${color}30` }}
          >
            {task.points} pts
          </span>
        )}
      </div>

      <p
        className="font-display text-base leading-tight mb-2"
        style={{
          color: claimed ? 'rgba(255,255,255,0.3)' : 'var(--gold)',
          textDecoration: claimed ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </p>

      <p
        className="text-xs leading-relaxed flex-1"
        style={{ color: claimed ? 'rgba(255,255,255,0.2)' : 'var(--text-dim)' }}
      >
        {task.description}
      </p>

      {claimed && task.claimed_by && (
        <p className="text-xs mt-2" style={{ color: 'rgba(239,68,68,0.5)' }}>
          Claimed
        </p>
      )}

      {isAdmin && (
        <ClaimButton id={task.id} isClaimed={claimed} claimedBy={task.claimed_by} />
      )}
    </div>
  );
}

// ── Mobile expandable row ─────────────────────────────────────────────────────
function MobileTaskRow({ task, isAdmin }: { task: ScavengerTask; isAdmin: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const symbol = SUIT_SYMBOL[task.suit];
  const color = SUIT_COLOR[task.suit];
  const claimed = task.is_claimed;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: claimed ? 'rgba(255,255,255,0.07)' : color + '30',
        background: claimed ? 'rgba(255,255,255,0.02)' : color + '06',
        opacity: claimed ? 0.6 : 1,
      }}
    >
      {/* Collapsed row — tap to expand */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Rank + suit on same line */}
        <span
          className="font-display text-lg flex-shrink-0 flex items-center gap-0.5 w-11"
          style={{ color: claimed ? 'rgba(255,255,255,0.25)' : color }}
        >
          {task.rank}
          <span className="text-base">{symbol}</span>
        </span>

        {/* Title */}
        <p
          className="flex-1 text-sm font-display leading-tight truncate"
          style={{
            color: claimed ? 'rgba(255,255,255,0.3)' : 'var(--gold)',
            textDecoration: claimed ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </p>

        {/* Points / claimed + chevron */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {claimed ? (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                color: 'rgba(239,68,68,0.7)',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              ✕
            </span>
          ) : (
            <span className="text-xs tabular-nums" style={{ color }}>
              {task.points}pt
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            style={{ color: 'rgba(255,255,255,0.25)' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded description */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-2 border-t"
          style={{ borderColor: color + '18' }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: claimed ? 'rgba(255,255,255,0.2)' : 'var(--text-dim)' }}
          >
            {task.description}
          </p>
          {claimed && (
            <p className="text-xs mt-2" style={{ color: 'rgba(239,68,68,0.5)' }}>
              ● Claimed
            </p>
          )}
          {isAdmin && (
            <ClaimButton id={task.id} isClaimed={claimed} claimedBy={task.claimed_by} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main board component ──────────────────────────────────────────────────────
interface Props {
  tasks: ScavengerTask[];
  isAdmin: boolean;
  isAdminPreview: boolean;
}

export default function ScavengerBoard({ tasks, isAdmin, isAdminPreview }: Props) {
  const [search, setSearch] = useState('');
  const [activeSuit, setActiveSuit] = useState<ScavengerSuit | null>(null);
  const [unclaimedOnly, setUnclaimedOnly] = useState(false);

  const claimedCount = tasks.filter((t) => t.is_claimed).length;
  const availablePoints = tasks
    .filter((t) => !t.is_claimed)
    .reduce((s, t) => s + t.points, 0);

  const filtered = useMemo(() => {
    let result = tasks;
    if (unclaimedOnly) result = result.filter((t) => !t.is_claimed);
    if (activeSuit) result = result.filter((t) => t.suit === activeSuit);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, unclaimedOnly, activeSuit, search]);

  // For desktop suit-column layout
  const bySuit = useMemo(
    () =>
      SUIT_ORDER.reduce<Record<ScavengerSuit, ScavengerTask[]>>(
        (acc, suit) => {
          acc[suit] = RANK_ORDER.map((rank) =>
            filtered.find((t) => t.suit === suit && t.rank === rank)
          ).filter(Boolean) as ScavengerTask[];
          return acc;
        },
        { diamonds: [], clubs: [], hearts: [], spades: [] }
      ),
    [filtered]
  );

  const isFiltered = !!search.trim() || !!activeSuit || unclaimedOnly;

  return (
    <section className="py-8 px-4 border-t" style={{ borderColor: 'var(--gold-soft)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-display text-4xl md:text-5xl gold-gradient mb-2">The Board</h2>
          {isAdminPreview && (
            <p className="text-xs text-gold border border-gold-soft rounded-full px-3 py-1 inline-block mb-2">
              🔒 Admin preview — not yet visible to guests
            </p>
          )}
          <p className="text-text-dim text-sm">
            {tasks.length} tasks
            {claimedCount > 0 && (
              <>
                {' · '}
                <span style={{ color: 'rgba(239,68,68,0.7)' }}>{claimedCount} claimed</span>
              </>
            )}
            {' · '}{availablePoints} pts available
          </p>
        </div>

        {/* ── Sticky filter bar ── */}
        <div
          className="sticky top-[64px] z-30 -mx-4 px-4 pt-3 pb-2.5 mb-5"
          style={{
            background: 'rgba(5,5,18,0.96)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(212,175,55,0.1)',
          }}
        >
          {/* Search input */}
          <div className="relative mb-2.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none" style={{ color: 'var(--text-dim)' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none transition-colors"
              style={{
                border: '1px solid rgba(212,175,55,0.2)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text)',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors"
                style={{ color: 'var(--text-dim)' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Suit pills + unclaimed toggle — horizontally scrollable */}
          <div
            className="flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {([null, ...SUIT_ORDER] as (ScavengerSuit | null)[]).map((suit) => {
              const isActive = activeSuit === suit;
              const c = suit ? SUIT_COLOR[suit] : '#D4AF37';
              const label = suit
                ? `${SUIT_SYMBOL[suit]} ${suit.charAt(0).toUpperCase() + suit.slice(1)}`
                : 'All';
              return (
                <button
                  key={suit ?? 'all'}
                  onClick={() => setActiveSuit(suit)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                  style={{
                    border: `1px solid ${isActive ? c : c + '40'}`,
                    background: isActive ? c + '22' : 'transparent',
                    color: isActive ? c : 'rgba(255,255,255,0.4)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              );
            })}

            {/* Divider */}
            <div
              className="w-px h-4 flex-shrink-0"
              style={{ background: 'rgba(212,175,55,0.2)' }}
            />

            {/* Unclaimed toggle */}
            <button
              onClick={() => setUnclaimedOnly((v) => !v)}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full transition-all flex-shrink-0"
              style={{
                border: `1px solid ${unclaimedOnly ? '#22c55e' : 'rgba(34,197,94,0.3)'}`,
                background: unclaimedOnly ? 'rgba(34,197,94,0.15)' : 'transparent',
                color: unclaimedOnly ? '#22c55e' : 'rgba(255,255,255,0.4)',
                fontWeight: unclaimedOnly ? 600 : 400,
              }}
            >
              {unclaimedOnly ? '✓ Unclaimed' : 'Unclaimed only'}
            </button>
          </div>
        </div>

        {/* Filter summary */}
        {isFiltered && (
          <p className="text-xs mb-4 px-1" style={{ color: 'var(--text-dim)' }}>
            {filtered.length} of {tasks.length} cards
            {' · '}
            <button
              onClick={() => { setSearch(''); setActiveSuit(null); setUnclaimedOnly(false); }}
              className="underline underline-offset-2"
              style={{ color: 'var(--gold)' }}
            >
              Clear all
            </button>
          </p>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text-dim)' }}>
            <p className="text-5xl mb-4">🃏</p>
            <p className="text-sm">No cards match your filters.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <>
            {/* ── Mobile: compact expandable list ── */}
            <div className="md:hidden space-y-1.5">
              {filtered.map((task) => (
                <MobileTaskRow key={task.id} task={task} isAdmin={isAdmin} />
              ))}
            </div>

            {/* ── Desktop: suit grid ── */}
            <div className="hidden md:block">
              {isFiltered ? (
                /* Flat grid when filtering */
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {filtered.map((task) => (
                    <TaskCard key={task.id} task={task} isAdmin={isAdmin} />
                  ))}
                </div>
              ) : (
                /* Default suit-column layout */
                <div className="grid grid-cols-4 gap-3">
                  {/* Suit column headers */}
                  {SUIT_ORDER.map((suit) => {
                    const c = SUIT_COLOR[suit];
                    const pts = bySuit[suit]
                      .filter((t) => !t.is_claimed)
                      .reduce((s, t) => s + t.points, 0);
                    const suitClaimed = bySuit[suit].filter((t) => t.is_claimed).length;
                    return (
                      <div
                        key={suit}
                        className="text-center py-3 rounded-xl mb-1"
                        style={{ background: c + '10', border: `1px solid ${c}30` }}
                      >
                        <span className="font-display text-3xl block" style={{ color: c }}>
                          {SUIT_SYMBOL[suit]}
                        </span>
                        <span
                          className="text-xs uppercase tracking-widest capitalize block mt-0.5"
                          style={{ color: c }}
                        >
                          {suit}
                        </span>
                        <span className="text-xs block" style={{ color: 'var(--text-dim)' }}>
                          {pts} pts
                          {suitClaimed > 0 && (
                            <span style={{ color: 'rgba(239,68,68,0.6)' }}>
                              {' · '}{suitClaimed} claimed
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}

                  {/* Cards: rank rows × suit columns */}
                  {RANK_ORDER.flatMap((rank) =>
                    SUIT_ORDER.map((suit) => {
                      const task = bySuit[suit].find((t) => t.rank === rank);
                      return task ? (
                        <TaskCard key={task.id} task={task} isAdmin={isAdmin} />
                      ) : (
                        <div key={`${rank}-${suit}`} />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
