import type { Event, PricingTier } from '@/lib/types';

const PT = 'America/Los_Angeles';

const DAY_SUBTITLES: Record<string, string> = {
  'Thursday': 'Early Arrivals',
  'Friday': 'Day One',
  'Saturday': 'Day Two',
  'Sunday': 'Recovery Day',
};

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: PT,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getDayLabel(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    timeZone: PT,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function getDayKey(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    timeZone: PT,
    weekday: 'long',
  });
}

function groupByDay(events: Event[]): { dayKey: string; label: string; subtitle: string; events: Event[] }[] {
  const map = new Map<string, { dayKey: string; label: string; subtitle: string; events: Event[] }>();
  for (const event of events) {
    const label = getDayLabel(event.starts_at);
    const dayKey = getDayKey(event.starts_at);
    if (!map.has(label)) {
      map.set(label, { dayKey, label, subtitle: DAY_SUBTITLES[dayKey] ?? '', events: [] });
    }
    map.get(label)!.events.push(event);
  }
  return Array.from(map.values());
}

function computePrice(tiers: PricingTier[] | null, attendeeCount: number): string | null {
  if (!tiers || tiers.length === 0) return null;
  const match = tiers.find((t) => attendeeCount >= t.min && attendeeCount <= t.max);
  return match ? `$${match.perPerson}` : null;
}

const RSVP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  attending:     { label: 'Attending',     color: '#4ade80' },
  maybe:         { label: 'Maybe',         color: '#facc15' },
  not_attending: { label: "Can't make it", color: '#f87171' },
};

function EventCard({ event, attendeeCount, myStatus }: { event: Event; attendeeCount: number; myStatus?: string }) {
  const price = computePrice(event.pricing_tiers, attendeeCount);
  const time = formatTime(event.starts_at);
  const rsvpInfo = myStatus ? RSVP_STATUS_LABELS[myStatus] : null;

  return (
    <a
      href={`/events/${event.slug}`}
      className={`event-card border border-gold-soft rounded-lg p-6 mb-4 block hover:border-gold transition-colors ${event.is_featured ? 'event-card-hero' : ''}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Time */}
        <div className="md:w-32 flex-shrink-0">
          <p className="text-sky font-mono-x text-sm">{time}</p>
          <p className="text-text-dim text-xs">PT</p>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="font-display text-2xl text-gold">{event.title}</h3>
            {event.is_featured && (
              <span
                className="text-xs px-2 py-0.5 rounded-full uppercase tracking-widest border"
                style={{ color: 'var(--blue-bright)', borderColor: 'var(--blue)', background: 'rgba(59,130,246,0.08)' }}
              >
                Centerpiece
              </span>
            )}
          </div>
          {event.location && (
            <p className="text-text-dim text-sm mb-3">{event.location}</p>
          )}
          {event.description && (
            <p className="text-sm text-text leading-relaxed">{event.description}</p>
          )}
        </div>

        {/* Pricing + CTA */}
        <div className="md:w-48 flex flex-col items-end gap-3">
          <div className="text-right">
            {price ? (
              <>
                <p className="text-xs text-text-dim uppercase tracking-wider">Per person est.</p>
                <p className="text-gold font-display text-xl">
                  {price}<span className="text-sm text-text-dim">/ea</span>
                </p>
                <p className="text-xs text-sky">{attendeeCount} attending</p>
              </>
            ) : (
              <p className="text-xs text-text-dim">Pricing TBD</p>
            )}
          </div>
          {rsvpInfo ? (
            <div className="flex flex-col items-end gap-1.5">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: rsvpInfo.color + '18', color: rsvpInfo.color, border: `1px solid ${rsvpInfo.color}40` }}
              >
                {rsvpInfo.label}
              </span>
              <span className="text-xs text-text-dim uppercase tracking-widest">View →</span>
            </div>
          ) : (
            <span className="rsvp-chip px-5 py-2 rounded-full text-xs uppercase tracking-widest">
              View &amp; RSVP
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function AgendaSection({ events, myRsvps = {} }: { events: Event[]; myRsvps?: Record<string, string> }) {
  const days = groupByDay(events);

  return (
    <section id="agenda" className="py-24 px-6 border-t" style={{ borderColor: 'var(--gold-soft)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-4">The Schedule</p>
          <h2 className="font-display text-5xl md:text-6xl gold-gradient mb-3">The Agenda</h2>
          <p className="text-text-dim max-w-md mx-auto">
            Four days. One unforgettable city. Tap any event to see who&#39;s coming and confirm
            your spot.
          </p>
        </div>

        {/* Callout notes */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12 max-w-2xl mx-auto">
          <div
            className="flex-1 flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            <span className="text-base mt-0.5">🍽️</span>
            <p className="text-text-dim leading-snug">
              <span className="text-gold font-semibold">Food is ad hoc.</span>{' '}
              Due to the size of the group, meals aren&#39;t coordinated — grab your crew and eat when it works.
            </p>
          </div>
          <div
            className="flex-1 flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <span className="text-base mt-0.5">🎫</span>
            <p className="text-text-dim leading-snug">
              <span className="text-blue-bright font-semibold">Expect an expense at clubs &amp; dayclubs</span>{' '}
              — tables, daybeds, and entry all cost something.
            </p>
          </div>
        </div>

        {days.length === 0 ? (
          <p className="text-center text-text-dim">Events loading soon.</p>
        ) : (
          days.map((day) => (
            <div key={day.label} className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="day-pill">
                  <span className="text-blue-bright text-xs uppercase tracking-widest">
                    {day.subtitle}
                  </span>
                  <span className="w-px h-4 bg-gold-soft" />
                  <span className="text-gold font-display text-lg">{day.label}</span>
                </div>
              </div>
              {day.events.map((event) => (
                <EventCard key={event.id} event={event} attendeeCount={0} myStatus={myRsvps[event.id]} />
              ))}
            </div>
          ))
        )}

        <p className="text-center text-text-dim text-sm italic mt-6">
          Monday Oct 26 — checkouts, last breakfasts, and tearful goodbyes. Alan &amp; Kate hit the road at noon.
        </p>
      </div>
    </section>
  );
}
