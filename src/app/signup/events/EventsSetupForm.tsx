'use client';

import { useActionState } from 'react';
import { batchSignupRsvpsAction } from './actions';
import type { Event, Rsvp } from '@/lib/types';

const PT = 'America/Los_Angeles';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

interface Props {
  memberId: string;
  events: Pick<Event, 'id' | 'title' | 'slug' | 'starts_at'>[];
  rsvpMap: Record<string, Rsvp['status']>;
}

export default function EventsSetupForm({ memberId, events, rsvpMap }: Props) {
  const [, action, pending] = useActionState<null, FormData>(batchSignupRsvpsAction, null);

  return (
    <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
      <form action={action} className="flex flex-col gap-0">
        <input type="hidden" name="member_id" value={memberId} />

        {events.map((event) => {
          const currentStatus = rsvpMap[event.id] ?? 'none';
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 py-3 border-b last:border-0"
              style={{ borderColor: 'var(--gold-soft)' }}
            >
              <input type="hidden" name="event_ids" value={event.id} />

              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm text-text truncate">{event.title}</p>
                <p className="text-xs text-text-dim">{formatDate(event.starts_at)}</p>
              </div>

              <select
                name={`rsvp_${event.id}`}
                defaultValue={currentStatus}
                className="field-input flex-shrink-0 text-xs py-1.5 px-2"
                style={{ width: 130 }}
              >
                <option value="none">— No RSVP</option>
                <option value="attending">Attending</option>
                <option value="maybe">Maybe</option>
                <option value="not_attending">Not attending</option>
              </select>
            </div>
          );
        })}

        <div className="flex gap-4 items-center mt-5">
          <button
            type="submit"
            disabled={pending}
            className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'Saving…' : 'Continue →'}
          </button>
          <a
            href="/signup/travel"
            className="text-text-dim text-sm hover:text-gold transition-colors"
          >
            Skip for now
          </a>
        </div>
      </form>
    </div>
  );
}
