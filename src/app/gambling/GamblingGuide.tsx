'use client';

import { useState } from 'react';

type Tab = 'roulette' | 'craps' | 'specialty';

/* ─── Roulette ─────────────────────────────────────────────── */

const BET_TYPES = [
  { name: 'Double Street', numbers: '6 numbers', payout: '5:1', desc: 'Two adjacent rows of 3. Good coverage, moderate payout.' },
  { name: 'Single Street', numbers: '3 numbers', payout: '11:1', desc: 'One row of 3 numbers.' },
  { name: 'Corner', numbers: '4 numbers', payout: '8:1', desc: 'Four numbers sharing a corner. The chip goes in the center of the intersection.' },
  { name: 'Split', numbers: '2 numbers', payout: '17:1', desc: 'Two adjacent numbers. Chip on the line between them.' },
  { name: 'Straight Up', numbers: '1 number', payout: '35:1', desc: 'One number. Highest payout, lowest probability.' },
  { name: 'Dozen / Column', numbers: '12 numbers', payout: '2:1', desc: 'Covers 1/3 of the wheel. Most strategies use these as base bets.' },
  { name: 'Even Money', numbers: '18 numbers', payout: '1:1', desc: 'Red/Black, Odd/Even, High/Low. Half the wheel (minus zeros).' },
];

const ROULETTE_STRATEGIES = [
  {
    name: 'Triple Entry Progression',
    risk: 'conservative' as const,
    riskLabel: 'Most Conservative',
    tagline: 'Use the casino\'s money to take over the table.',
    description:
      'The safest system on this list. Start with three even-money bets and work your way toward full table coverage — using only profit. You\'re never chasing losses, only pressing when you\'re already ahead.',
    howItWorks: [
      { label: 'Round 1', text: 'Place 3 equal bets on different even-money spots (e.g., Red, Odd, and 1–18). You\'re trying to win at least 2 of 3.' },
      { label: 'Win 0/3', text: 'Rebet the same amounts. Don\'t chase.' },
      { label: 'Win 1/3', text: 'You\'re down. Bet your remaining chips on 2 different dozens to get back to even.' },
      { label: 'Win 2/3', text: 'You\'re slightly up. Bet the extra profit on a single dozen to try for a double-up.' },
      { label: 'Win 3/3', text: 'You won everything. Now spread the winnings across the table — half on an even-money bet, the rest split across columns or dozens. Let the casino pay for your coverage.' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=C0xFd7jDefA',
    videoLabel: 'Watch: The Safest Money Printer (Triple Entry Progression)',
  },
  {
    name: 'The Wave',
    risk: 'moderate' as const,
    riskLabel: 'Moderate',
    tagline: 'Ride it, press it, walk away clean.',
    description:
      'A two-round dozen system that locks in profit before risking more. Round 1 is your anchor bet on a dozen. Win Round 1 and your winnings move to corner bets — a big leap in payout potential. Lose either round and you just add $10 and reset back to Round 1.',
    howItWorks: [
      { label: 'Start', text: 'Bet $20 on any dozen (1–12, 13–24, or 25–36).' },
      { label: 'Lose', text: 'Add $10 to your bet ($30 total) and stay in Round 1 on the same dozen. Repeat if you keep losing — you\'re chasing round 1 until it hits.' },
      { label: 'Win Round 1', text: 'You collect ~$40 profit. Now spread those winnings across 4 corner bets on numbers you like. Don\'t add any of your original money.' },
      { label: 'Win Round 2', text: 'Big win on a corner. Reset completely back to your $20 dozen bet and start over.' },
      { label: 'Lose Round 2', text: 'The corners didn\'t hit. Add $10 to your dozen bet and restart at Round 1.' },
    ],
    videoUrl: 'https://www.youtube.com/c/CEGDealerSchool',
    videoLabel: 'CEG Dealer School Channel',
  },
  {
    name: 'Hopscotch',
    risk: 'moderate' as const,
    riskLabel: 'Moderate',
    tagline: 'Start outside, jump to dozens, step up your bankroll.',
    description:
      'A three-stage system that uses even-money bets as a launching pad into dozen bets. The magic is in using winnings to fund the next level — you\'re never pressing with your own money, only escalating when ahead.',
    howItWorks: [
      { label: 'Stage 1', text: 'Place a flat even-money bet (Red/Black, Odd/Even, etc.). This is your anchor.' },
      { label: 'Win Stage 1', text: 'Take the winnings (not your original bet) and split it across 2 different dozens. Your original bet comes back off the table.' },
      { label: 'Win Stage 2', text: 'You hit a dozen. Reset to Stage 1 but increase your even-money bet slightly — use a small portion of the dozen profit to bump it up. The rest of the dozen profit is pocketed.' },
      { label: 'Lose Stage 2', text: 'Dozens missed. Go back to Stage 1 at the same flat bet. You only lost the winnings from Stage 1, not your original stake.' },
    ],
    videoUrl: 'https://www.youtube.com/shorts/pMeSV_2feRI',
    videoLabel: 'Watch: Hopscotch Roulette Strategy',
  },
  {
    name: 'Golden Entry (Fibonacci Dozens)',
    risk: 'moderate-aggressive' as const,
    riskLabel: 'Moderate–Aggressive',
    tagline: 'Wait 8 spins. Then strike with Fibonacci.',
    description:
      'Patience is the whole strategy. You watch the board and wait for a single dozen to go missing for at least 8 consecutive spins. Once your entry condition is met, you ride a Fibonacci progression — walk away if the 7th step (13 units) fails.',
    howItWorks: [
      { label: 'Wait', text: 'Watch the scoreboard. Wait for one dozen to miss 8+ consecutive spins before placing a single chip.' },
      { label: 'Enter', text: 'Bet 1 unit on that cold dozen. Follow the Fibonacci sequence if it keeps missing: 1 → 1 → 2 → 3 → 5 → 8 → 13.' },
      { label: 'Win', text: 'When the dozen hits, a Fibonacci win typically covers all previous losses plus profit. Drop back two steps in the sequence and continue.' },
      { label: 'Walk Away', text: 'If the 7th step (13 units) loses, stop. The progression has failed. Do not extend further. Reset and find a new cold dozen to stalk.' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=nBFni4iQjlk',
    videoLabel: 'Watch: Golden Entry (Fibonacci Dozen)',
  },
  {
    name: 'Triple Entry Max Climax',
    risk: 'aggressive' as const,
    riskLabel: 'Aggressive',
    tagline: 'Win 3-for-3, then go nuclear.',
    description:
      'The most exciting system on the list. Bet three even-money bets simultaneously and use the results to dictate your next move. The goal is a perfect 3/3 round — that\'s when you go big and put the winnings on individual numbers for a 35:1 shot.',
    howItWorks: [
      { label: 'Round 1', text: 'Place equal bets on 3 different even-money spots (Red, Odd, 1–18 — all must be different categories).' },
      { label: 'Win 0/3', text: 'Rebet the same amounts. Neutral result.' },
      { label: 'Win 1/3', text: 'You\'re down slightly. Bet on a single dozen to try to recover.' },
      { label: 'Win 2/3', text: 'You\'re up. Bet the profit across 2 different dozens to press.' },
      { label: 'Win 3/3 — The Climax', text: 'Sweep your winnings and spread them equally across 10 individual numbers (straight up, 35:1). If you\'re feeling lazy, drop them on a dozen instead. One hit pays massive.' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=9A9Nxk15E4U',
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
    body: 'Every round starts with a come-out roll. Bet the Pass Line before the shooter rolls. A 7 or 11 wins immediately. A 2, 3, or 12 (craps) loses. Any other number (4, 5, 6, 8, 9, 10) becomes the Point.',
  },
  {
    step: '2',
    title: 'The Point & Odds',
    body: 'Once a point is set, the shooter rolls to hit that number before rolling a 7. Back your Pass Line bet with an Odds bet — it\'s the only bet in the casino with zero house edge. Take the maximum odds the table allows.',
  },
  {
    step: '3',
    title: 'Place Bets & the Weird Math',
    body: 'You can Place bet on 6 or 8 anytime — they pay 7:6 (not even money). That means bet in $6 increments: $12 wins $14, $30 wins $35. The 5 and 9 pay 7:5 ($10 increments). The 4 and 10 pay 9:5. These payouts look odd because they\'re approximating true odds without the Odds bet.',
  },
  {
    step: '4',
    title: 'Pressing vs. Same Bet',
    body: '"Press" means double your bet after a win (using the profit). "Same bet" means take the profit and leave the original bet untouched. Early in a roll, pressing builds your position fast. On a hot table, press twice then switch to "same bet" to protect your stack. Always say it out loud — dealers move fast.',
  },
];

const CRAPS_STRATEGIES = [
  {
    name: '3 Point Molly',
    risk: 'conservative' as const,
    riskLabel: 'Conservative',
    tagline: 'The tried-and-true. Three numbers working, always.',
    description:
      'The gold standard beginner strategy. The goal is to always have exactly three numbers working — the Pass Line point, and two Come bets — each backed with maximum Odds. With full odds, the combined house edge drops below 0.5%. This is as mathematically sound as craps gets.',
    howItWorks: [
      { label: 'Start', text: 'Place a Pass Line bet and wait for the point to be established.' },
      { label: 'Come Bet 1', text: 'Once the point is set, place a Come bet. The next roll moves it to a number — back it with full Odds.' },
      { label: 'Come Bet 2', text: 'Place a second Come bet. The next roll moves it to another number — back it with full Odds.' },
      { label: 'Now you have 3 numbers working', text: 'You\'re done betting. Every time one of your numbers hits, collect the win and immediately place a new Come bet to replace it. Always keep 3 numbers live.' },
      { label: 'Seven Out', text: 'You lose all three bets. Start over with a new Pass Line bet.' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=6W3cfz2RoDQ',
    videoLabel: 'Watch: 3 Point Molly & 3 Point Dolly (Color Up)',
    channel: 'Color Up',
  },
  {
    name: 'Squeeze Play',
    risk: 'moderate' as const,
    riskLabel: 'Moderate',
    tagline: 'Cover the inside, lock profit, come down to free.',
    description:
      'Designed to get you to "free play" status — where the house has paid for your bets. Start by covering all four inside numbers, take your first two hits as profit, then on the third hit come down to a smaller across position and ride it for free.',
    howItWorks: [
      { label: '$220 Inside (standard)', text: 'Place $44 on 5, $66 on 6, $66 on 8, $44 on 9 = $220 total. Adjust proportionally for smaller tables (e.g., $44 inside at a $10 table: $8 on 5, $12 on 6, $12 on 8, $8 on 9 = $40 inside or similar).' },
      { label: 'Hit 1', text: 'Take the profit. Leave all bets up. Do not press yet.' },
      { label: 'Hit 2 — Grab 4 & 10', text: 'Place $50 on the 4 and $50 on the 10 (or scaled down: $25 each). You\'re now across the board.' },
      { label: 'Hit 3 — Come Down', text: 'With the next hit, come down to $160 across: drop to smaller amounts on each number. You\'ve collected more than you have on the table — you\'re playing with house money.' },
      { label: 'Ride it', text: 'Keep collecting and let the reduced position run for free until a seven-out.' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=612l4_vpDkE',
    videoLabel: 'Watch: CEG Squeeze Play',
    channel: 'CEG Dealer School',
  },
  {
    name: 'Triple Lux',
    risk: 'aggressive' as const,
    riskLabel: 'Aggressive',
    tagline: 'Free play in 3 hits. Big stack from nothing.',
    description:
      'Place the 6 and 8, plus one more (5 or 9). When one hits, press it. When it hits again, press again. On the third hit you\'re playing with house money — at that point let it ride and use profit to buy the 4 and 10. Can turn $66 into $500+ on a hot table.',
    howItWorks: [
      { label: 'Start', text: 'Place $30 on 6, $30 on 8, $25 on 5 (or 9) = ~$85.' },
      { label: 'Hit 1', text: 'Press the winning number (double it).' },
      { label: 'Hit 2', text: 'Press it again. You\'re now up on that number.' },
      { label: 'Hit 3 — Free Play', text: 'Pull the original bet on that number. You\'re now playing with pure profit. Add the 4 and 10 with your winnings.' },
      { label: 'Let It Ride', text: 'Stop pressing. Collect and let positions run. Color up when the shooter sevens out.' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=5FzRoPa2s2c',
    videoLabel: 'Watch: Triple Lux — Free Play in 3 Hits',
    channel: 'CEG Dealer School',
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
    tip: 'The Pair Plus bet has a separate house edge (~7.28%) — only ride it if you\'re feeling it. The core Ante/Play game is your best bet.',
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
  const [showBetTypes, setShowBetTypes] = useState(false);

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
            {/* Basics */}
            <div className="mb-4 rounded-xl p-6"
              style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>The Basics</p>
              <p className="text-text-dim text-sm leading-relaxed mb-3">
                American Roulette has a <strong className="text-text">5.26% house edge</strong> (0 and 00).
                European single-zero drops to <strong className="text-text">2.7%</strong> — always prefer it when you can find it.
                Single-zero wheels are usually tucked in <strong className="text-text">high-limit rooms only</strong>.
              </p>

              {/* Triple-zero warning */}
              <div className="rounded-lg px-4 py-3 mb-3"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#F87171' }}>
                  Avoid Triple-Zero Wheels Completely
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(248,113,113,0.85)' }}>
                  Some Strip casinos now run triple-zero (0, 00, 000) wheels — pushing the house edge to 7.69%.
                  If you see a three-green-pocket wheel, walk away. It&apos;s not worth your time.
                </p>
              </div>

              <p className="text-text-dim text-sm leading-relaxed">
                The four strategies below are arranged from <span style={{ color: '#34D399' }}>most conservative</span> to{' '}
                <span style={{ color: '#F87171' }}>most aggressive</span>.
              </p>
            </div>

            {/* Bet types — collapsible */}
            <div className="mb-6 rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(212,175,55,0.12)' }}>
              <button
                onClick={() => setShowBetTypes((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
                style={{ background: 'rgba(14,26,46,0.5)' }}
              >
                <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                  Bet Types Reference
                </span>
                <svg className="transition-transform duration-200"
                  style={{ transform: showBetTypes ? 'rotate(180deg)' : 'none', color: 'var(--text-dim)' }}
                  width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showBetTypes && (
                <div className="px-5 pb-4 pt-2" style={{ background: 'rgba(7,16,31,0.5)' }}>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {BET_TYPES.map((b) => (
                      <div key={b.name} className="rounded-lg px-3 py-2"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-text">{b.name}</span>
                          <span className="text-xs" style={{ color: 'var(--gold)' }}>{b.payout}</span>
                          <span className="text-xs text-text-dim ml-auto">{b.numbers}</span>
                        </div>
                        <p className="text-xs text-text-dim">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Risk scale legend */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-xs text-text-dim uppercase tracking-widest">Risk:</span>
              {[
                { label: 'Most Conservative', color: '#34D399' },
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
                          <span className="ml-3 text-xs text-text-dim hidden sm:inline">{s.tagline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="hidden sm:inline text-xs px-2 py-1 rounded-full"
                          style={{ background: `${color}20`, color }}>
                          {s.riskLabel}
                        </span>
                        <svg className="transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2"
                        style={{ background: 'rgba(7,16,31,0.6)', borderTop: `1px solid ${color}20` }}>
                        <p className="text-text-dim text-sm leading-relaxed mb-4">{s.description}</p>

                        <p className="text-xs uppercase tracking-widest mb-2" style={{ color }}>How It Works</p>
                        <div className="flex flex-col gap-2 mb-4">
                          {s.howItWorks.map((step, i) => (
                            <div key={i} className="flex gap-3">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                style={{ background: `${color}25`, color }}>
                                {i + 1}
                              </span>
                              <div className="text-sm">
                                <span className="text-text font-medium">{step.label}: </span>
                                <span className="text-text-dim">{step.text}</span>
                              </div>
                            </div>
                          ))}
                        </div>

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
                the Pass Line + full Odds is one of the{' '}
                <strong className="text-text">best bets in the building (~0.8% combined edge)</strong>.
                It looks complicated. It isn&apos;t. Here&apos;s everything you need.
              </p>
            </div>

            {/* Tutorial steps */}
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>How to Play</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
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
                <strong className="text-text">Proposition bets</strong> (center of the table — hardways, any 7, yo, craps) carry{' '}
                <strong className="text-text">9–17% house edges</strong>. The stickman will push them. Smile and say &quot;no thanks.&quot;
                Any 7 pays 4:1 but true odds are 5:1. Stick to Pass Line, Odds, and Place 6/8.
              </p>
            </div>

            {/* Strategies */}
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>Strategies</p>
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
                          <span className="ml-3 text-xs text-text-dim hidden sm:inline">{s.tagline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="hidden sm:inline text-xs px-2 py-1 rounded-full"
                          style={{ background: `${color}20`, color }}>
                          {s.riskLabel}
                        </span>
                        <svg className="transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2"
                        style={{ background: 'rgba(7,16,31,0.6)', borderTop: `1px solid ${color}20` }}>
                        <p className="text-text-dim text-sm leading-relaxed mb-4">{s.description}</p>

                        {'howItWorks' in s && (
                          <>
                            <p className="text-xs uppercase tracking-widest mb-2" style={{ color }}>How It Works</p>
                            <div className="flex flex-col gap-2 mb-4">
                              {(s as typeof CRAPS_STRATEGIES[0]).howItWorks.map((step, i) => (
                                <div key={i} className="flex gap-3">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                    style={{ background: `${color}25`, color }}>
                                    {i + 1}
                                  </span>
                                  <div className="text-sm">
                                    <span className="text-text font-medium">{step.label}: </span>
                                    <span className="text-text-dim">{step.text}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div className="flex items-center gap-3">
                          <a href={s.videoUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                            style={{ background: '#FF000020', border: '1px solid #FF000040', color: '#FF6B6B' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            {s.videoLabel}
                          </a>
                          <span className="text-xs text-text-dim">{s.channel}</span>
                        </div>
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
                These three games have lower house edges than most slots and many table games, and they all feel
                like poker. Below: RTP (higher is better), volatility, and a full walkthrough for each.
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

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="rounded-lg p-3"
                          style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <p className="text-xs text-text-dim mb-1">RTP</p>
                          <p className="font-display text-xl" style={{ color: 'var(--gold)' }}>{g.rtp}%</p>
                          <div className="mt-1.5 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-1 rounded-full" style={{ width: `${g.rtp - 90}%`, background: 'var(--gold)', maxWidth: '100%' }} />
                          </div>
                        </div>
                        <div className="rounded-lg p-3"
                          style={{ background: 'rgba(14,26,46,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-xs text-text-dim mb-1">House Edge</p>
                          <p className="font-display text-xl text-text">{g.houseEdge}</p>
                          <p className="text-xs text-text-dim mt-1">w/ optimal play</p>
                        </div>
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
                        <svg className="transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

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
