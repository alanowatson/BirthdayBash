import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { ScavengerTask, ScavengerSuit } from '@/lib/types';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import ScavengerBoard, { SUIT_SYMBOL, SUIT_COLOR } from './ScavengerBoard';

export const revalidate = 0;

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

// Minimal static card used only for the locked-state teaser (no interactivity)
function TeaserCard({ task }: { task: ScavengerTask }) {
  const symbol = SUIT_SYMBOL[task.suit];
  const color = SUIT_COLOR[task.suit];
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: color + '40', background: color + '08' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <span className="font-display text-2xl" style={{ color }}>{task.rank}</span>
          <span className="text-lg" style={{ color }}>{symbol}</span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ color, background: color + '18', border: `1px solid ${color}30` }}
        >
          {task.points} pts
        </span>
      </div>
      <p className="font-display text-base text-gold leading-tight mb-2">{task.title}</p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
        {task.description}
      </p>
    </div>
  );
}

export default async function ScavengerHuntPage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [settingRes, tasksRes, memberRes] = await Promise.all([
    supabaseAdmin
      .from('site_settings')
      .select('value_timestamptz')
      .eq('key', 'scavenger_reveal_at')
      .maybeSingle(),
    supabaseAdmin
      .from('scavenger_tasks')
      .select('*')
      .order('display_order', { ascending: true }),
    user?.email
      ? supabaseAdmin.from('members').select('is_admin').eq('email', user.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const isAdmin = memberRes.data?.is_admin === true;
  const revealAt = settingRes.data?.value_timestamptz ?? '2026-10-15T07:00:00+00:00';
  const isRevealed = isAdmin || Date.now() >= new Date(revealAt).getTime();
  const days = daysUntil(revealAt);
  const tasks = (tasksRes.data ?? []) as ScavengerTask[];

  const TEASERS: { rank: string; suit: ScavengerSuit }[] = [
    { rank: 'A', suit: 'spades' },
    { rank: '9', suit: 'clubs' },
    { rank: '7', suit: 'diamonds' },
    { rank: '2', suit: 'hearts' },
  ];
  const teaserCards = TEASERS
    .map(({ rank, suit }) => tasks.find((t) => t.rank === rank && t.suit === suit))
    .filter(Boolean) as ScavengerTask[];

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <p className="section-label section-label-blue mb-4">The Side Quest</p>
        <h1 className="font-display text-5xl md:text-7xl gold-gradient mb-4">
          The Great T-Rex<br />Scavenger Hunt 2.0
        </h1>
        <p className="text-text-dim text-lg max-w-xl mx-auto">
          52 tasks. Four suits. One wild weekend. Prizes, bragging rights, and a silver &amp; gold
          foil deck of poker cards as souvenirs.
        </p>
      </section>

      {!isRevealed ? (
        /* ── LOCKED STATE ── */
        <>
          <section className="py-16 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div
                className="inline-flex flex-col items-center gap-4 px-10 py-8 rounded-2xl border mb-8"
                style={{ borderColor: 'var(--gold-soft)', background: 'rgba(212,175,55,0.04)' }}
              >
                <span className="text-4xl">🔒</span>
                <div>
                  <p className="font-display text-3xl text-gold mb-1">Board Locked</p>
                  <p className="text-text-dim">
                    Reveals <span className="text-blue-bright font-semibold">October 15, 2026</span>
                  </p>
                </div>
                {days > 0 && (
                  <div
                    className="px-6 py-3 rounded-full border text-sm font-mono-x"
                    style={{
                      borderColor: 'var(--blue)',
                      color: 'var(--blue-bright)',
                      background: 'rgba(59,130,246,0.08)',
                    }}
                  >
                    {days} days to go
                  </div>
                )}
              </div>
              <p className="text-text-dim max-w-md mx-auto text-sm leading-relaxed">
                The full task list drops October 15th — one week before the trip. Study the rules
                below. Coordinate with your team. Come prepared.
              </p>
            </div>
          </section>

          {teaserCards.length > 0 && (
            <section className="pb-16 px-6">
              <div className="max-w-3xl mx-auto">
                <p className="text-center text-xs uppercase tracking-widest text-text-dim mb-6">
                  A taste of what&apos;s coming
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {teaserCards.map((task) => (
                    <TeaserCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </section>
          )}

          <Rules />
        </>
      ) : (
        /* ── REVEALED STATE ── */
        <>
          <ScavengerBoard
            tasks={tasks}
            isAdmin={isAdmin}
            isAdminPreview={isAdmin && !(Date.now() >= new Date(revealAt).getTime())}
          />
          <Rules />
        </>
      )}

      <SiteFooter />
    </main>
  );
}

// ── Rules ─────────────────────────────────────────────────────────────────────

function RuleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="event-card event-card-static border border-gold-soft rounded-xl p-5">
      <p className="text-gold font-display text-lg mb-2">{title}</p>
      <p className="text-text-dim text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function Rules() {
  return (
    <section
      className="py-16 px-6 border-t border-b"
      style={{ borderColor: 'var(--gold-soft)', background: 'rgba(10,26,62,0.4)' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl text-gold mb-8 text-center">Rules of the Hunt</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {GENERAL_RULES.map((rule) => (
            <RuleCard key={rule.title} title={rule.title} body={rule.body} />
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: 'var(--gold-soft)' }} />
          <p className="font-display text-xl text-gold tracking-widest whitespace-nowrap">Prizes</p>
          <div className="flex-1 h-px" style={{ background: 'var(--gold-soft)' }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { place: '1st', amount: '$300', tagline: 'Bragging rights & eternal glory.', color: '#D4AF37', bg: 'rgba(212,175,55,0.10)', border: 'rgba(212,175,55,0.35)' },
            { place: '2nd', amount: '$150', tagline: null,                               color: '#C0C0C0', bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.3)' },
            { place: '3rd', amount: '$75',  tagline: null,                               color: '#CD7F32', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.3)' },
          ].map((p) => (
            <div
              key={p.place}
              className="rounded-xl p-5 text-center flex flex-col gap-2"
              style={{ background: p.bg, border: `1px solid ${p.border}` }}
            >
              <p className="font-display text-4xl" style={{ color: p.color }}>{p.place} Place</p>
              {p.tagline && (
                <p className="text-xs leading-snug" style={{ color: p.color }}>{p.tagline}</p>
              )}
              <p className="text-text-dim text-sm">{p.amount} off your bill</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: 'var(--gold-soft)' }} />
          <p className="font-display text-xl text-gold tracking-widest whitespace-nowrap">Points &amp; Scoring</p>
          <div className="flex-1 h-px" style={{ background: 'var(--gold-soft)' }} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {SCORING_RULES.map((rule) => (
            <RuleCard key={rule.title} title={rule.title} body={rule.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

const GENERAL_RULES = [
  {
    title: 'Game Start',
    body: "The game begins Friday morning. Study the board and strategize beforehand — but tasks completed before the official start don't count.",
  },
  {
    title: 'Strangers Only',
    body: "Many tasks involve finding a type of person. That person must be a stranger. Others in our group don't qualify.",
  },
  {
    title: 'No Spoilers',
    body: "You cannot tell anyone outside the group about the game while attempting to complete a task. Loose lips sink ships and forfeit cards.",
  },
  {
    title: 'Cards Can Move',
    body: "Points follow the cards, not the player. Once claimed, a card can be traded, wagered, or outright stolen from another player. Mini-games, degenerate gambling, subterfuge, and other chicanery are encouraged.",
  },
];

const SCORING_RULES = [
  {
    title: 'The Referees',
    body: "Alan and Kate are referees. They cannot play. Their word is final.",
  },
  {
    title: 'The Deck',
    body: "The 52 tasks are represented by a special silver & gold foil poker deck — which are also your souvenirs. Complete a task, claim the card and its points. Each task can only be claimed once.",
  },
  {
    title: 'Evidence',
    body: "Tasks must be completed while observed by a referee or fellow player, or with photo/video proof. No evidence, no card.",
  },
  {
    title: 'Tiebreaker',
    body: "In the event of a tie at the end of the game, the player holding the highest individual card wins.",
  },
];
