'use client';

import { useState } from 'react';

type Tab = 'roulette' | 'craps' | 'specialty';

/* ─── Roulette ─────────────────────────────────────────────── */

const ROULETTE_STRATEGIES = [
  {
    name: 'The Wave',
    risk: 'conservative' as const,
    riskLabel: 'Conservative',
    tagline: 'Low stress, long sessions.',
    description:
      'A flowing coverage system that spreads bets across several streets, riding winning streaks and pulling back methodically when the table turns cold. Great for players who want to be in the action for a long time without blowing through a bankroll.',
    howItWorks: [
      'Cover 4–5 streets across two sections of the wheel.',
      'After each win, shift coverage one street in the direction of the hit (follow the "wave").',
      'After two consecutive misses, reduce bet size by one unit.',
      'Reset the wave position when a hot section cools.',
    ],
    bestFor: 'Long sessions · Steady comp earning · Beginners',
    videoUrl: 'https://www.youtube.com/c/CEGDealerSchool',
    videoLabel: 'CEG Dealer School',
  },
  {
    name: 'Golden Entry',
    risk: 'moderate' as const,
    riskLabel: 'Moderate',
    tagline: 'Wait for the signal. Strike with Fibonacci.',
    description:
      'Uses the Fibonacci progression on outside dozen bets. The key is patient entry — you wait for a single dozen to miss at least twice before placing your first bet. Once you\'re in, the Fibonacci sequence keeps your exposure controlled while still giving you room to recover.',
    howItWorks: [
      'Identify a dozen that hasn\'t hit in 3+ spins.',
      'Enter with $15 on that dozen.',
      'If you lose: follow the Fibonacci sequence (15 → 15 → 30 → 45 → 75...).',
      'When you win, drop back two steps in the sequence.',
      'Stop and lock profit after 2 consecutive wins.',
    ],
    bestFor: 'Patient players · Mid-session recovery · Moderate bankroll',
    videoUrl: 'https://www.youtube.com/watch?v=nBFni4iQjlk',
    videoLabel: 'Watch: Golden Entry (Fibonacci Dozen)',
  },
  {
    name: 'Hopscotch',
    risk: 'moderate-aggressive' as const,
    riskLabel: 'Moderate–Aggressive',
    tagline: 'Skip around the board. Stay unpredictable.',
    description:
      'Instead of concentrating bets on one section, Hopscotch jumps across the wheel — mixing a corner bet, a street, and an outside bet in a deliberate skip pattern. The goal is to hit any of three types of bets on each spin, giving multiple ways to score.',
    howItWorks: [
      'Choose 3 non-adjacent streets and one corner connecting them.',
      'Add a single outside bet (column or dozen) as a safety net.',
      'After each win, hop one section clockwise and repeat the pattern.',
      'Flat-bet until you hit 2 wins in a row, then press the outside by 1 unit.',
    ],
    bestFor: 'Action seekers · Medium bankroll · Pub-style fun',
    videoUrl: 'https://www.youtube.com/shorts/pMeSV_2feRI',
    videoLabel: 'Watch: Hopscotch Roulette Strategy',
  },
  {
    name: 'Triple Entry Max Climax',
    risk: 'aggressive' as const,
    riskLabel: 'Aggressive',
    tagline: '$25 → $525 in 3 steps or less.',
    description:
      'The highest-octane CEG system. Three escalating outside bets enter the board simultaneously, each at a different size. If one hits, the profit fuels a press on the others. Designed to snowball a small stake into a big payday fast — but it burns quick if the table runs cold.',
    howItWorks: [
      'Place $25 on a column, $25 on a dozen, and $15 on a high/low bet simultaneously.',
      'If any bet wins, use 50% of profit to press the losing bets.',
      'After 3 winning spins, lock 60% of total profit and reset to base unit.',
      'Stop if you lose 2 full rounds consecutively.',
    ],
    bestFor: 'Thrill seekers · Short sessions · Large swings welcome',
    videoUrl: 'https://www.youtube.com/watch?v=LnywR6mNdJo',
    videoLabel: 'Watch: Triple Entry Max Climax',
  },
];

const RISK_COLORS: Record<string, string> = {
  conservative: '#34D399',
  moderate: '#60A5FA',
  'moderate-aggressive': '#F59E0B',
  aggressive: '#F87171',
};

/* ─── Craps ─────────────────────────────────────────────────── */

const CRAPS_STEPS = [
  {
    step: '1',
    title: 'The Come-Out Roll',
    body: 'Every round starts with a come-out roll. Bet the Pass Line before the shooter rolls. A 7 or 11 wins immediately. A 2, 3, or 12 (craps) loses. Any other number becomes the Point.',
  },
  {
    step: '2',
    title: 'The Point & Odds',
    body: 'Once a point is set (4, 5, 6, 8, 9, or 10), the shooter rolls again. They need to hit the point before rolling a 7. Take Odds behind your Pass Line bet — it\'s the only bet in the casino with zero house edge.',
  },
  {
    step: '3',
    title: 'Place Bets',
    body: 'You can also Place bet directly on 6 or 8 at any time — these pay 7:6. Avoid placing 4, 5, 9, or 10 unless you\'re pressing aggressively. The 6 and 8 hit most often and have the lowest place-bet edge (~1.52%).',
  },
  {
    step: '4',
    title: 'Pressing & Coloring Up',
    body: 'After a Place hit, you can "press" (double the bet) or "same bet." Seasoned players press once or twice then pull down to protect profit. Always say "same bet" or "press" out loud — the dealers work fast.',
  },
];

const CRAPS_STRATEGIES = [
  {
    name: 'Squeeze Play',
    risk: 'conservative' as const,
    riskLabel: 'Conservative',
    tagline: 'The steady daily-paycheck approach.',
    description:
      'Designed for longevity. Start with $44 across (place the 5, 6, 8, and 9 for $10/$12/$12/$10). On each hit, take the profit and press just the winning number by one unit. After 3 hits, pull down the 5 and 9 and ride the 6 & 8 free.',
    videoUrl: 'https://www.youtube.com/watch?v=612l4_vpDkE',
    videoLabel: 'Watch: Squeeze Play (under 1 min)',
  },
  {
    name: 'Triple Lux',
    risk: 'aggressive' as const,
    riskLabel: 'Aggressive',
    tagline: 'Free play in 3 hits. Big stack from nothing.',
    description:
      'Place the 6, 8, and one more (5 or 9). When one hits, press it. When it hits again, press again. On the third hit, you\'re playing with house money — at that point, let it ride and use profit to buy the point. Can turn $66 into $500+ on a hot table.',
    videoUrl: 'https://www.youtube.com/watch?v=5FzRoPa2s2c',
    videoLabel: 'Watch: Triple Lux — Free Play in 3 Hits',
  },
];

/* ─── Specialty Games ───────────────────────────────────────── */

const SPECIALTY_GAMES = [
  {
    name: '3 Card Poker',
    emoji: '♠',
    rtp: 96.63,
    houseEdge: '~3.37%',
    volatility: 'Medium',
    volatilityLevel: 2,
    tagline: 'Three cards. Dealer qualifies with Queen or better.',
    intro:
      'One of the fastest and friendliest table games on the floor. You and the dealer each get 3 cards — no community cards, no drama. Beat the dealer\'s hand to win. Simple enough to play drunk, good enough odds to not feel robbed.',
    howToPlay: [
      { label: 'Ante Bet', text: 'Place an Ante to enter the round.' },
      { label: 'See Your Cards', text: 'Receive 3 face-down cards. Look at them.' },
      { label: 'Play or Fold', text: 'If your hand is Q-6-4 or better, make a Play bet equal to your Ante. Otherwise, fold and lose the Ante.' },
      { label: 'Dealer Qualifies', text: 'Dealer needs at least a Queen to qualify. If they don\'t, your Ante pays 1:1 and Play pushes.' },
      { label: 'Pair Plus', text: 'Side bet that pays regardless of dealer\'s hand: Pair = 1:1, Flush = 4:1, Straight = 6:1, Three of a Kind = 30:1, Straight Flush = 40:1.' },
    ],
    tip: 'The Pair Plus bet has a separate house edge (~7.28%) — only ride it if you\'re feeling it. The core game is your best bet.',
    bestHand: 'Mini Royal (A-K-Q suited)',
  },
  {
    name: 'Ultimate Texas Hold\'em',
    emoji: '♥',
    rtp: 97.82,
    houseEdge: '~2.18% (ante)',
    volatility: 'High',
    volatilityLevel: 3,
    tagline: 'Texas Hold\'em against the house. Big bets, big moments.',
    intro:
      'If you love poker but hate waiting for a table, UTH is your game. You play against the dealer, not other players. The magic is the pre-flop bet — play early and you can bet 3×–4× your Ante before seeing any community cards. Biggest edge comes from knowing when to fire big.',
    howToPlay: [
      { label: 'Ante + Blind', text: 'Post equal Ante and Blind bets (e.g., $10 each).' },
      { label: 'Pre-Flop', text: 'See your 2 hole cards. Option to bet 3× or 4× Ante (the "Play" bet) — or check.' },
      { label: 'The Flop', text: 'See 3 community cards. If you checked pre-flop, you can now bet 2× Ante — or check again.' },
      { label: 'Turn & River', text: 'See the final 2 cards. If you\'ve checked twice, you MUST bet 1× Ante or fold.' },
      { label: 'Showdown', text: 'Best 5-card hand from your 2 + the 5 community cards wins. Dealer must have at least a pair to qualify.' },
      { label: 'Blind Bonus', text: 'Blind bet pays bonus on straights and better, even if you lose to the dealer.' },
    ],
    tip: 'Fire the 4× bet pre-flop with any pair, any Ace, or K-5+. Don\'t slow-play — the advantage of UTH is attacking early.',
    bestHand: 'Royal Flush (pays 500:1 on Blind)',
  },
  {
    name: 'Free Bet Blackjack',
    emoji: '♦',
    rtp: 98.96,
    houseEdge: '~1.04%',
    volatility: 'Low–Medium',
    volatilityLevel: 1,
    tagline: 'The house pays for your doubles and splits.',
    intro:
      'Free Bet Blackjack plays like standard BJ with one stunning twist: the casino gives you free double-downs on 9, 10, and 11, and free splits on all pairs except 10-value cards. You put up nothing extra — if you win, you collect. If you lose, you only lose your original bet. The catch: dealer pushes on 22 instead of busting.',
    howToPlay: [
      { label: 'Place Bet', text: 'Same as regular blackjack — bet your chips.' },
      { label: 'Free Split', text: 'Split any pair except 10-value cards for FREE. The house puts up the second bet. Re-splits allowed.' },
      { label: 'Free Double', text: 'Double down on hard 9, 10, or 11 for FREE. House puts up the extra chip.' },
      { label: 'Dealer 22 = Push', text: 'If the dealer busts with exactly 22, all remaining hands push (tie) instead of winning. This is the house\'s edge recovery.' },
      { label: 'Basic Strategy', text: 'Use nearly the same basic strategy as regular BJ. Always take the free doubles and splits — you have no downside.' },
    ],
    tip: 'Always take free doubles on 9/10/11 — always. Even if the dealer is showing a strong card. It\'s literally free money with upside.',
    bestHand: 'Blackjack pays 3:2 as normal',
  },
];

/* ─── Component ─────────────────────────────────────────────── */

export default function GamblingGuide() {
  const [tab, setTab] = useState<Tab>('roulette');
  const [openStrategy, setOpenStrategy] = useState<string | null>(null);
  const [openCraps, setOpenCraps] = useState<string | null>(null);
  const [openGame, setOpenGame] = useState<string | null>(null);

  return (
    <section className="pb-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl mb-10 mx-auto max-w-sm"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
          {(['roulette', 'craps', 'specialty'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 px-3 rounded-lg text-xs uppercase tracking-widest font-medium transition-all"
              style={{
                background: tab === t ? 'var(--gold)' : 'transparent',
                color: tab === t ? '#07101F' : 'var(--text-dim)',
              }}
            >
              {t === 'specialty' ? 'Specialty' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── ROULETTE ── */}
        {tab === 'roulette' && (
          <div>
            <div className="mb-8 rounded-xl p-6"
              style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>The Basics</p>
              <p className="text-text-dim text-sm leading-relaxed">
                American Roulette has a <strong className="text-text">5.26% house edge</strong> — two green pockets (0 and 00).
                If you can find a European single-zero wheel, the edge drops to <strong className="text-text">2.7%</strong> — always prefer it.
                No strategy changes the math, but the right system makes your money last longer and winning streaks hit harder.
              </p>
              <p className="text-text-dim text-sm leading-relaxed mt-2">
                The four CEG strategies below are arranged from <span style={{ color: '#34D399' }}>conservative</span> to{' '}
                <span style={{ color: '#F87171' }}>aggressive</span>. Pick based on your bankroll and risk appetite.
              </p>
            </div>

            {/* Risk scale legend */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-xs text-text-dim uppercase tracking-widest">Risk scale:</span>
              {[
                { label: 'Conservative', color: '#34D399' },
                { label: 'Moderate', color: '#60A5FA' },
                { label: 'Mod–Agg', color: '#F59E0B' },
                { label: 'Aggressive', color: '#F87171' },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                  <span className="text-text-dim">{label}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {ROULETTE_STRATEGIES.map((s) => {
                const isOpen = openStrategy === s.name;
                const color = RISK_COLORS[s.risk];
                return (
                  <div key={s.name} className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${color}30` }}>
                    <button
                      onClick={() => setOpenStrategy(isOpen ? null : s.name)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                      style={{ background: 'rgba(14,26,46,0.7)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <div>
                          <span className="font-display text-lg text-text">{s.name}</span>
                          <span className="ml-3 text-xs text-text-dim">{s.tagline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="hidden sm:inline text-xs px-2 py-1 rounded-full"
                          style={{ background: `${color}20`, color }}>
                          {s.riskLabel}
                        </span>
                        <svg
                          className="transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1"
                        style={{ background: 'rgba(7,16,31,0.6)', borderTop: `1px solid ${color}20` }}>
                        <p className="text-text-dim text-sm leading-relaxed mb-4">{s.description}</p>

                        <p className="text-xs uppercase tracking-widest mb-2" style={{ color }}>How It Works</p>
                        <ol className="flex flex-col gap-2 mb-4">
                          {s.howItWorks.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: `${color}25`, color }}>
                                {i + 1}
                              </span>
                              <span className="text-text-dim leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>

                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <p className="text-xs uppercase tracking-widest mb-1" style={{ color }}>Best For</p>
                            <p className="text-text-dim text-xs">{s.bestFor}</p>
                          </div>
                          <a href={s.videoUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-opacity hover:opacity-80 flex-shrink-0"
                            style={{ background: '#FF000020', border: '1px solid #FF000040', color: '#FF6B6B' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            {s.videoLabel}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CEG channel link */}
            <div className="mt-6 text-center">
              <a href="https://www.youtube.com/c/CEGDealerSchool" target="_blank" rel="noopener noreferrer"
                className="text-xs text-text-dim hover:text-gold transition-colors">
                More strategies at CEG Dealer School →
              </a>
            </div>
          </div>
        )}

        {/* ── CRAPS ── */}
        {tab === 'craps' && (
          <div>
            {/* Intro */}
            <div className="mb-8 rounded-xl p-6"
              style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Why Craps?</p>
              <p className="text-text-dim text-sm leading-relaxed">
                Craps is the loudest, most social game in the casino — and once you understand it,
                the Pass Line + Odds is one of the{' '}
                <strong className="text-text">best bets in the building (~0.8% combined edge)</strong>.
                It looks complicated. It isn&apos;t. Here&apos;s everything you need to not look lost.
              </p>
            </div>

            {/* Tutorial steps */}
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>How to Play</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {CRAPS_STEPS.map((s) => (
                <div key={s.step} className="rounded-xl p-4"
                  style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}>
                      {s.step}
                    </span>
                    <span className="font-medium text-text text-sm">{s.title}</span>
                  </div>
                  <p className="text-text-dim text-xs leading-relaxed ml-10">{s.body}</p>
                </div>
              ))}
            </div>

            {/* Bets to avoid */}
            <div className="mb-10 rounded-xl p-5"
              style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#F87171' }}>Bets to Avoid</p>
              <p className="text-text-dim text-sm leading-relaxed">
                <strong className="text-text">Proposition bets</strong> (the center of the table — hardways, any 7, yo, craps) look fun but carry{' '}
                <strong className="text-text">9–17% house edges</strong>. The stickman will push them on you hard.
                Smile and say &quot;no thanks.&quot; Same goes for Any 7 — it pays 4:1 but the true odds are 5:1.
                Stick to Pass Line, Odds, and Place 6/8.
              </p>
            </div>

            {/* CEG Strategies */}
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>CEG Strategies</p>
            <div className="flex flex-col gap-4">
              {CRAPS_STRATEGIES.map((s) => {
                const isOpen = openCraps === s.name;
                const color = RISK_COLORS[s.risk];
                return (
                  <div key={s.name} className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${color}30` }}>
                    <button
                      onClick={() => setOpenCraps(isOpen ? null : s.name)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                      style={{ background: 'rgba(14,26,46,0.7)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <div>
                          <span className="font-display text-lg text-text">{s.name}</span>
                          <span className="ml-3 text-xs text-text-dim">{s.tagline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="hidden sm:inline text-xs px-2 py-1 rounded-full"
                          style={{ background: `${color}20`, color }}>
                          {s.riskLabel}
                        </span>
                        <svg
                          className="transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1"
                        style={{ background: 'rgba(7,16,31,0.6)', borderTop: `1px solid ${color}20` }}>
                        <p className="text-text-dim text-sm leading-relaxed mb-4">{s.description}</p>
                        <a href={s.videoUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-opacity hover:opacity-80 w-fit"
                          style={{ background: '#FF000020', border: '1px solid #FF000040', color: '#FF6B6B' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          {s.videoLabel}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <a href="https://www.youtube.com/watch?v=2VUoFcUjrS4" target="_blank" rel="noopener noreferrer"
                className="text-xs text-text-dim hover:text-gold transition-colors">
                Watch: CEG Craps Basics (Day 1 Introduction) →
              </a>
            </div>
          </div>
        )}

        {/* ── SPECIALTY GAMES ── */}
        {tab === 'specialty' && (
          <div>
            <div className="mb-8 rounded-xl p-6"
              style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Why Specialty?</p>
              <p className="text-text-dim text-sm leading-relaxed">
                These three games are some of the best value on the floor — all have lower house edges than
                most slots and many table games, with the bonus of feeling like you&apos;re playing poker.
                Below: RTP (higher is better), volatility, and a full walkthrough.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {SPECIALTY_GAMES.map((g) => {
                const isOpen = openGame === g.name;
                const volColors = ['#34D399', '#60A5FA', '#F59E0B'];
                const accentColor = volColors[g.volatilityLevel - 1];

                return (
                  <div key={g.name} className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(212,175,55,0.2)' }}>

                    {/* Header (always visible) */}
                    <div className="px-6 pt-6 pb-4"
                      style={{ background: 'rgba(14,26,46,0.9)' }}>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl" style={{ color: 'var(--gold)' }}>{g.emoji}</span>
                            <h3 className="font-display text-2xl text-text">{g.name}</h3>
                          </div>
                          <p className="text-text-dim text-sm">{g.tagline}</p>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* RTP */}
                        <div className="rounded-lg p-3"
                          style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <p className="text-xs text-text-dim mb-1">RTP</p>
                          <p className="font-display text-xl" style={{ color: 'var(--gold)' }}>{g.rtp}%</p>
                          <div className="mt-1.5 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-1 rounded-full" style={{ width: `${g.rtp - 90}%`, background: 'var(--gold)', maxWidth: '100%' }} />
                          </div>
                        </div>
                        {/* House Edge */}
                        <div className="rounded-lg p-3"
                          style={{ background: 'rgba(14,26,46,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-xs text-text-dim mb-1">House Edge</p>
                          <p className="font-display text-xl text-text">{g.houseEdge}</p>
                          <p className="text-xs text-text-dim mt-1">w/ optimal play</p>
                        </div>
                        {/* Volatility */}
                        <div className="rounded-lg p-3"
                          style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}30` }}>
                          <p className="text-xs text-text-dim mb-1">Volatility</p>
                          <p className="font-display text-xl" style={{ color: accentColor }}>{g.volatility}</p>
                          <div className="flex gap-1 mt-1.5">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="h-1 flex-1 rounded-full"
                                style={{ background: n <= g.volatilityLevel ? accentColor : 'rgba(255,255,255,0.1)' }} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-text-dim text-sm leading-relaxed">{g.intro}</p>

                      <button
                        onClick={() => setOpenGame(isOpen ? null : g.name)}
                        className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
                        style={{ color: isOpen ? 'var(--text-dim)' : 'var(--gold)' }}
                      >
                        {isOpen ? 'Hide walkthrough' : 'Show full walkthrough'}
                        <svg
                          className="transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expandable walkthrough */}
                    {isOpen && (
                      <div className="px-6 pb-6"
                        style={{ background: 'rgba(7,16,31,0.7)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                        <p className="text-xs uppercase tracking-widest mt-5 mb-3" style={{ color: 'var(--gold)' }}>How to Play</p>
                        <div className="flex flex-col gap-3 mb-5">
                          {g.howToPlay.map((step, i) => (
                            <div key={i} className="flex gap-3">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}>
                                {i + 1}
                              </span>
                              <div>
                                <span className="text-text text-sm font-medium">{step.label}: </span>
                                <span className="text-text-dim text-sm">{step.text}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-lg p-4 flex gap-3"
                          style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <span className="text-gold text-lg flex-shrink-0">★</span>
                          <div>
                            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Pro Tip</p>
                            <p className="text-text-dim text-sm leading-relaxed">{g.tip}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-xs text-text-dim">
                          Best hand: <span className="text-text">{g.bestHand}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparison footer */}
            <div className="mt-8 rounded-xl p-5"
              style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Quick Comparison</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-text-dim mb-1">Best RTP</p>
                  <p className="text-text font-medium">Free Bet BJ</p>
                  <p style={{ color: '#34D399' }}>98.96%</p>
                </div>
                <div>
                  <p className="text-text-dim mb-1">Biggest Swings</p>
                  <p className="text-text font-medium">UTH</p>
                  <p style={{ color: '#F59E0B' }}>High variance</p>
                </div>
                <div>
                  <p className="text-text-dim mb-1">Best for Beginners</p>
                  <p className="text-text font-medium">3 Card Poker</p>
                  <p style={{ color: '#60A5FA' }}>Simple rules</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
