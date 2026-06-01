'use client';

import { useState, useTransition } from 'react';
import { batchRsvpAction } from './actions';
import type { Event } from '@/lib/types';

const PT = 'America/Los_Angeles';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: PT, hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function getDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT, weekday: 'long', month: 'long', day: 'numeric',
  });
}

function groupByDay(events: Event[]) {
  const map = new Map<string, Event[]>();
  for (const e of events) {
    const label = getDayLabel(e.starts_at);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(e);
  }
  return Array.from(map.entries());
}

type Status = 'attending' | 'maybe' | null;

interface Props {
  events: Event[];
  memberId: string;
  slug: string;
  memberName: string;
}

export default function EventsForm({ events, memberId, slug, memberName }: Props) {
  const [selections, setSelections] = useState<Record<string, Status>>({});
  const [isPending, startTransition] = useTransition();

  function toggle(eventId: string, status: 'attending' | 'maybe') {
    setSelections((prev) => ({
      ...prev,
      [eventId]: prev[eventId] === status ? null : status,
    }));
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.set('member_id', memberId);
    fd.set('slug', slug);
    fd.set('selections', JSON.stringify(selections));
    startTransition(() => { batchRsvpAction(fd); });
  }

  const days = groupByDay(events);
  const anySelected = Object.values(selections).some((s) => s !== null);

  return (
    <div>
      <div className="flex flex-col gap-8 mb-10">
        {days.map(([dayLabel, dayEvents]) => (
          <div key={dayLabel}>
            <p className="text-xs uppercase tracking-widest text-gold mb-3">{dayLabel}</p>
            <div className="flex flex-col gap-3">
              {dayEvents.map((event) => {
                const sel = selections[event.id] ?? null;
                return (
                  <div
                    key={event.id}
                    className="event-card border rounded-xl px-5 py-4 transition-colors"
                    style={{
                      borderColor: sel ? 'var(--gold)' : 'var(--gold-soft)',
                      background: sel === 'attending'
                        ? 'rgba(212,175,55,0.06)'
                        : sel === 'maybe'
                        ? 'rgba(59,130,246,0.06)'
                        : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-lg text-gold leading-tight mb-0.5">
                          {event.title}
                        </p>
                        <p className="text-sky font-mono-x text-xs">
                          {formatTime(event.starts_at)} PT
                        </p>
                        {event.location && (
                          <p className="text-text-dim text-xs mt-0.5">{event.location}</p>
                        )}
                      </div>

                      {/* Toggle buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => toggle(event.id, 'attending')}
                          className="text-xs px-3 py-1.5 rounded-full border transition-all"
                          style={{
                            borderColor: sel === 'attending' ? 'var(--gold)' : 'var(--gold-soft)',
                            background: sel === 'attending' ? 'var(--gold)' : 'transparent',
                            color: sel === 'attending' ? '#07101F' : 'var(--text-dim)',
                            fontWeight: sel === 'attending' ? 600 : 400,
                          }}
                        >
                          I&#39;m in
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(event.id, 'maybe')}
                          className="text-xs px-3 py-1.5 rounded-full border transition-all"
                          style={{
                            borderColor: sel === 'maybe' ? 'var(--blue)' : 'var(--gold-soft)',
                            background: sel === 'maybe' ? 'rgba(59,130,246,0.2)' : 'transparent',
                            color: sel === 'maybe' ? 'var(--blue-bright)' : 'var(--text-dim)',
                            fontWeight: sel === 'maybe' ? 600 : 400,
                          }}
                        >
                          Maybe
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rsvp-chip px-8 py-3 rounded-full uppercase text-sm tracking-widest font-medium disabled:opacity-50 w-full text-center"
        >
          {isPending
            ? 'Saving…'
            : anySelected
            ? `Save my picks →`
            : 'Continue →'}
        </button>

        <a
          href={`/members/${slug}`}
          className="text-text-dim text-sm hover:text-gold transition-colors"
        >
          Skip for now — I&#39;ll RSVP to events later
        </a>
      </div>

      <p className="text-center text-text-dim text-xs mt-6">
        Hey {memberName.split(' ')[0]} — check your email for a magic link to edit your profile and RSVPs anytime.
      </p>
    </div>
  );
}
