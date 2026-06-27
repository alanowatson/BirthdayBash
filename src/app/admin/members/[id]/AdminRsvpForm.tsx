'use client';

import { useActionState, useEffect, useState } from 'react';
import { bulkUpdateRsvpsAction } from './actions';
import type { RsvpSaveState } from './actions';
import type { Event, Rsvp } from '@/lib/types';

const PT = 'America/Los_Angeles';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT, weekday: 'short', month: 'short', day: 'numeric',
  });
}

interface Props {
  memberId: string;
  events: Pick<Event, 'id' | 'title' | 'slug' | 'starts_at'>[];
  rsvpMap: Record<string, Rsvp['status']>;
}

export default function AdminRsvpForm({ memberId, events, rsvpMap }: Props) {
  const [state, action, pending] = useActionState<RsvpSaveState, FormData>(bulkUpdateRsvpsAction, null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (state && 'success' in state) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <>
      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm shadow-xl"
          style={{
            background: 'rgba(10,12,8,0.97)',
            border: '1px solid rgba(212,175,55,0.45)',
            color: 'var(--gold)',
          }}
        >
          <span>✓</span>
          <span>RSVPs saved</span>
        </div>
      )}

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
                <p className="text-xs text-text-dim whitespace-nowrap">{formatDate(event.starts_at)}</p>
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

        <div className="flex items-center gap-4 mt-5">
          <button
            type="submit"
            disabled={pending}
            className="rsvp-chip px-5 py-2.5 rounded-full uppercase text-xs tracking-widest disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Save RSVPs'}
          </button>
          {state && 'error' in state && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}
        </div>
      </form>
    </>
  );
}
