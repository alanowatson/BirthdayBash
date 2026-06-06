import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Event, Member, PricingTier, Rsvp } from '@/lib/types';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import RsvpForm from './RsvpForm';
import { TIPS, type Tip } from '@/lib/tips';
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

// Events that have an embedded map and which view to use
const EVENT_MAP_VIEW: Record<string, 'strip' | 'downtown'> = {
  'fremont-street-crawl': 'downtown',
};

export const revalidate = 0;

const PT = 'America/Los_Angeles';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: PT,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function computePrice(tiers: PricingTier[] | null, count: number): string | null {
  if (!tiers || tiers.length === 0) return null;
  const match = tiers.find((t) => count >= t.min && count <= t.max);
  return match ? `$${match.perPerson}` : null;
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #D4AF37, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #D4AF37)',
  'linear-gradient(135deg, #38BDF8, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #38BDF8)',
  'linear-gradient(135deg, #D4AF37, #38BDF8)',
];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

type RsvpWithMember = {
  status: Rsvp['status'];
  members: Pick<Member, 'id' | 'name' | 'slug' | 'photo_url' | 'is_referee'> | null;
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;

  const [{ data: eventData }, { data: allEventsData }] = await Promise.all([
    supabaseAdmin.from('events').select('*').eq('slug', slug).maybeSingle(),
    supabaseAdmin.from('events').select('id, title, slug, starts_at').order('starts_at', { ascending: true }),
  ]);

  if (!eventData) notFound();
  const event = eventData as Event;

  const allEvents = (allEventsData ?? []) as Pick<Event, 'id' | 'title' | 'slug' | 'starts_at'>[];
  const currentIdx = allEvents.findIndex((e) => e.slug === slug);
  const prevEvent = currentIdx > 0 ? allEvents[currentIdx - 1] : null;
  const nextEvent = currentIdx < allEvents.length - 1 ? allEvents[currentIdx + 1] : null;

  // Resolve logged-in user and their existing RSVP for this event in parallel
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();

  const [rsvpRes, currentMemberRes] = await Promise.all([
    supabaseAdmin
      .from('rsvps')
      .select('status, members(id, name, slug, photo_url, is_referee)')
      .eq('event_id', event.id)
      .in('status', ['attending', 'maybe'])
      .order('created_at', { ascending: true }),
    user?.email
      ? supabaseAdmin.from('members').select('id, name').eq('email', user.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const rsvps = (rsvpRes.data ?? []) as unknown as RsvpWithMember[];
  const attendingCount = rsvps.filter((r) => r.status === 'attending').length;
  const price = computePrice(event.pricing_tiers, attendingCount);
  const eventTips = TIPS.filter((t) => t.eventSlugs?.includes(slug));

  const currentMember = currentMemberRes.data as { id: string; name: string } | null;

  // Dedicated lookup for this user's own RSVP on this specific event
  const myRsvpRes = currentMember
    ? await supabaseAdmin
        .from('rsvps')
        .select('status')
        .eq('member_id', currentMember.id)
        .eq('event_id', event.id)
        .maybeSingle()
    : { data: null };

  const myRsvp = (myRsvpRes.data?.status as string) ?? null;

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Event header */}
      <section
        className="py-20 px-6 border-b"
        style={{ borderColor: 'var(--gold-soft)', background: event.is_featured ? 'rgba(10, 26, 62, 0.6)' : undefined }}
      >
        <div className="max-w-5xl mx-auto">
          <a href="/#agenda" className="text-text-dim text-sm hover:text-gold transition-colors mb-8 inline-block">
            ← Back to agenda
          </a>

          <div className="flex flex-col md:flex-row md:items-start gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {event.is_featured && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full uppercase tracking-widest border"
                    style={{ color: 'var(--blue-bright)', borderColor: 'var(--blue)', background: 'rgba(59,130,246,0.08)' }}
                  >
                    Centerpiece
                  </span>
                )}
              </div>

              <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-4">{event.title}</h1>

              <div className="flex flex-col gap-2 mb-6">
                <p className="text-sky font-mono-x text-sm">
                  {formatDateTime(event.starts_at)} PT
                </p>
                {event.location && (
                  <p className="text-text-dim">{event.location}</p>
                )}
              </div>

              {event.description && (
                <p className="text-text leading-relaxed max-w-xl">{event.description}</p>
              )}
            </div>

            {/* Pricing + RSVP */}
            <div className="md:w-80 flex-shrink-0 flex flex-col gap-4">
              <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
                <p className="text-xs uppercase tracking-widest text-text-dim mb-3">Cost</p>
                {price ? (
                  <>
                    <p className="font-display text-3xl text-gold">
                      {price}<span className="text-lg text-text-dim"> /person</span>
                    </p>
                    <p className="text-sky text-sm mt-1">
                      Based on {attendingCount} {attendingCount === 1 ? 'person' : 'people'} attending
                    </p>
                    <p className="text-text-dim text-xs mt-1 italic">Price updates as headcount changes</p>
                  </>
                ) : (
                  <p className="text-text-dim">Pricing TBD</p>
                )}
              </div>

              <RsvpForm
                eventId={event.id}
                currentMember={currentMember}
                currentStatus={myRsvp}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional info — dress code, bag policy, etc. */}
      {event.additional_info && (
        <section
          className="py-10 px-6 border-t"
          style={{ borderColor: 'var(--gold-soft)', background: 'rgba(212,175,55,0.03)' }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">Need to Know</p>
            <div
              className="rounded-xl p-6 max-w-2xl"
              style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.04)' }}
            >
              <p className="text-sm text-text leading-relaxed whitespace-pre-line">{event.additional_info}</p>
            </div>
          </div>
        </section>
      )}

      {/* Embedded map — shown for events that have a map view configured */}
      {EVENT_MAP_VIEW[slug] && (
        <section
          className="py-10 px-6 border-t"
          style={{ borderColor: 'var(--gold-soft)' }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">The Route</p>
            <div style={{ height: 520 }}>
              <StripMap initialView={EVENT_MAP_VIEW[slug]} />
            </div>
          </div>
        </section>
      )}

      {/* Insider tips for this event */}
      {eventTips.length > 0 && (
        <section
          className="py-12 px-6 border-t"
          style={{ borderColor: 'var(--gold-soft)', background: 'rgba(10,26,62,0.3)' }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-text-dim mb-6">Insider Tips</p>
            <div className="grid md:grid-cols-2 gap-4">
              {eventTips.map((tip: Tip) => (
                <div
                  key={tip.id}
                  className="rounded-xl p-5 relative overflow-hidden"
                  style={{ border: `1px solid ${tip.accent}25`, background: tip.accent + '06' }}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-6 h-6" style={{ borderTop: `2px solid ${tip.accent}60`, borderLeft: `2px solid ${tip.accent}60` }} />

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{tip.icon}</span>
                    <span
                      className="text-xs tracking-widest"
                      style={{ color: tip.accent }}
                    >
                      {tip.category}
                    </span>
                  </div>

                  <h3 className="font-display text-lg mb-0.5" style={{ color: tip.accent }}>
                    {tip.title}
                  </h3>
                  <p className="text-xs text-text-dim mb-3 uppercase tracking-wider">{tip.subtitle}</p>
                  <p className="text-sm text-text leading-relaxed mb-3">{tip.body}</p>
                  <div
                    className="text-xs italic leading-relaxed"
                    style={{
                      borderLeft: `2px solid ${tip.accent}50`,
                      paddingLeft: '10px',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {tip.note}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-dim mt-4">
              More tips on the <a href="/tips" className="text-gold hover:underline">Insider Tips page →</a>
            </p>
          </div>
        </section>
      )}

      {/* Attendee list */}
      <section className="py-16 px-6 flex-1">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-gold mb-2">
            {rsvps.length === 0 ? "No RSVPs yet" : `${rsvps.length} ${rsvps.length === 1 ? 'person' : 'people'} in`}
          </h2>
          <p className="text-text-dim text-sm mb-10">
            {attendingCount > 0 && `${attendingCount} attending`}
            {attendingCount > 0 && rsvps.length - attendingCount > 0 && ' · '}
            {rsvps.length - attendingCount > 0 && `${rsvps.length - attendingCount} maybe`}
          </p>

          {rsvps.length === 0 ? (
            <p className="text-text-dim">Be the first to RSVP above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {rsvps.map((rsvp, i) => {
                const m = rsvp.members;
                if (!m) return null;
                return (
                  <a
                    key={m.id}
                    href={`/members/${m.slug}`}
                    className="flex flex-col items-center text-center group"
                  >
                    <div
                      className="avatar mb-2 group-hover:ring-2 ring-gold transition-all"
                      style={{
                        width: 56,
                        height: 56,
                        fontSize: '1rem',
                        background: m.photo_url
                          ? undefined
                          : AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                      }}
                    >
                      {m.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        initials(m.name)
                      )}
                    </div>
                    <p className="text-xs text-text group-hover:text-gold transition-colors leading-tight">{m.name}</p>
                    {rsvp.status === 'maybe' && (
                      <p className="text-xs text-text-dim italic">maybe</p>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Prev / Next event navigation */}
      {(prevEvent || nextEvent) && (
        <section className="py-8 px-6 border-t" style={{ borderColor: 'var(--gold-soft)' }}>
          <div className="max-w-5xl mx-auto flex justify-between gap-4">
            {prevEvent ? (
              <a href={`/events/${prevEvent.slug}`}
                className="flex flex-col gap-0.5 group max-w-xs"
              >
                <span className="text-xs text-text-dim uppercase tracking-widest group-hover:text-gold transition-colors">← Previous</span>
                <span className="text-sm text-text group-hover:text-gold transition-colors">{prevEvent.title}</span>
              </a>
            ) : <div />}
            {nextEvent && (
              <a href={`/events/${nextEvent.slug}`}
                className="flex flex-col gap-0.5 items-end text-right group max-w-xs"
              >
                <span className="text-xs text-text-dim uppercase tracking-widest group-hover:text-gold transition-colors">Next →</span>
                <span className="text-sm text-text group-hover:text-gold transition-colors">{nextEvent.title}</span>
              </a>
            )}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
