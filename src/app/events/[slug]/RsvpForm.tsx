'use client';

import { useActionState, useState } from 'react';
import { rsvpAction } from './actions';
import type { RsvpState } from './actions';

interface Props {
  eventId: string;
  currentMember?: { id: string; name: string } | null;
  currentStatus?: string | null;
}

const STATUS_OPTIONS = [
  { value: 'attending',     label: "I'm in",       sublabel: 'Count me as attending' },
  { value: 'maybe',         label: 'Maybe',         sublabel: "I'll try to make it" },
  { value: 'not_attending', label: "Can't make it", sublabel: "I'll sit this one out" },
];

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  attending:     { text: 'Attending',     color: '#4ade80' },
  maybe:         { text: 'Maybe',         color: '#facc15' },
  not_attending: { text: 'Not attending', color: '#f87171' },
};

export default function RsvpForm({ eventId, currentMember, currentStatus }: Props) {
  const [state, action, pending] = useActionState<RsvpState, FormData>(rsvpAction, null);
  const [isEditing, setIsEditing] = useState(false);

  // After successful save, show confirmation
  if (state && 'success' in state && state.success) {
    return (
      <div className="event-card event-card-static border border-gold-soft rounded-xl p-6 text-center">
        <p className="text-gold font-display text-2xl mb-2">You&#39;re set.</p>
        <p className="text-text-dim text-sm">
          <span className="text-text">{state.memberName}</span> · {state.status}
        </p>
        <button
          className="text-xs text-text-dim hover:text-gold mt-4 underline"
          onClick={() => window.location.reload()}
        >
          Change your RSVP
        </button>
      </div>
    );
  }

  // Logged-in + has existing status + not editing → show status card
  if (currentMember && currentStatus && !isEditing) {
    const s = STATUS_LABELS[currentStatus] ?? { text: currentStatus, color: 'var(--gold)' };
    return (
      <div className="event-card event-card-static border border-gold-soft rounded-xl p-6 flex flex-col gap-4">
        <div>
          <p className="font-display text-xl text-gold mb-1">Your RSVP</p>
          <p className="text-text-dim text-xs">{currentMember.name}</p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: s.color + '12', border: `1px solid ${s.color}30` }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
          <span className="text-sm font-medium" style={{ color: s.color }}>{s.text}</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-text-dim hover:text-gold transition-colors underline text-left"
        >
          Edit RSVP →
        </button>
      </div>
    );
  }

  // Full form (not logged in, or logged in but no status yet, or editing)
  return (
    <form action={action} className="event-card event-card-static border border-gold-soft rounded-xl p-6 flex flex-col gap-5">
      <input type="hidden" name="event_id" value={eventId} />

      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-xl text-gold mb-1">RSVP</p>
          {currentMember ? (
            <p className="text-text-dim text-xs">RSVPing as <span className="text-text">{currentMember.name}</span></p>
          ) : (
            <p className="text-text-dim text-xs">Enter your email to confirm your spot.</p>
          )}
        </div>
        {isEditing && (
          <button type="button" onClick={() => setIsEditing(false)}
            className="text-xs text-text-dim hover:text-gold transition-colors">
            Cancel
          </button>
        )}
      </div>

      {currentMember ? (
        <input type="hidden" name="member_id" value={currentMember.id} />
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rsvp-email" className="text-xs uppercase tracking-widest text-text-dim">Your email</label>
          <input
            id="rsvp-email" name="email" type="email" required autoComplete="email"
            placeholder="you@example.com"
            className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors text-sm"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Your status</p>
        {STATUS_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio" name="status" value={opt.value}
              defaultChecked={currentStatus ? opt.value === currentStatus : opt.value === 'attending'}
              className="accent-gold"
            />
            <span>
              <span className="text-text text-sm group-hover:text-gold transition-colors">{opt.label}</span>
              <span className="text-text-dim text-xs ml-2">{opt.sublabel}</span>
            </span>
          </label>
        ))}
      </div>

      {state && 'error' in state && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending}
        className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium disabled:opacity-50 disabled:cursor-not-allowed">
        {pending ? 'Saving…' : 'Confirm RSVP →'}
      </button>
    </form>
  );
}
