'use client';

import { useState, useTransition } from 'react';
import type { Travel, Member } from '@/lib/types';
import { upsertTravelAction, deleteTravelAction } from './actions';

// Convert a UTC ISO string to a "YYYY-MM-DDTHH:MM" string in Vegas time (PDT)
function toVegasLocal(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('sv', { timeZone: 'America/Los_Angeles' }).slice(0, 16);
}

interface Props {
  myMemberId: string;
  myTravel: Travel | null;
  isAdmin: boolean;
  members: Pick<Member, 'id' | 'name'>[];
  allTravel: Travel[];
}

export default function TravelForm({ myMemberId, myTravel, isAdmin, members, allTravel }: Props) {
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();

  const [targetId, setTargetId] = useState(myMemberId);

  // Derive existing travel for the currently selected member
  const existing = allTravel.find((t) => t.member_id === targetId) ?? null;
  const [mode, setMode] = useState<'flying' | 'driving'>(existing?.travel_mode ?? myTravel?.travel_mode ?? 'flying');

  // When admin switches member, sync mode to their existing data
  function handleMemberChange(id: string) {
    setTargetId(id);
    const t = allTravel.find((t) => t.member_id === id);
    if (t) setMode(t.travel_mode);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => upsertTravelAction(fd));
  }

  function handleDelete() {
    if (!confirm('Remove your travel info?')) return;
    const fd = new FormData();
    fd.set('member_id', targetId);
    startDelete(() => deleteTravelAction(fd));
  }

  const src = existing ?? (targetId === myMemberId ? myTravel : null);
  const hasEntry = !!src;

  const inputClass = 'w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors';
  const inputStyle = {
    border: '1px solid rgba(212,175,55,0.2)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
  };
  const labelClass = 'block text-xs uppercase tracking-widest mb-1.5';
  const labelStyle = { color: 'var(--text-dim)' };

  return (
    <div
      className="rounded-xl p-6 mb-8"
      style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}
    >
      <p className="font-display text-xl text-gold mb-4">
        {hasEntry ? 'Update your plans' : 'Add your travel info'}
      </p>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <input type="hidden" name="member_id" value={targetId} />

        {/* Admin: member picker */}
        {isAdmin && (
          <div>
            <label className={labelClass} style={labelStyle}>Entering for</label>
            <select
              value={targetId}
              onChange={(e) => handleMemberChange(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Travel mode */}
        <div>
          <label className={labelClass} style={labelStyle}>Getting there by</label>
          <input type="hidden" name="travel_mode" value={mode} />
          <div className="flex gap-2">
            {(['flying', 'driving'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  border: `1px solid ${mode === m ? 'var(--gold)' : 'rgba(212,175,55,0.2)'}`,
                  background: mode === m ? 'rgba(212,175,55,0.1)' : 'transparent',
                  color: mode === m ? 'var(--gold)' : 'var(--text-dim)',
                }}
              >
                {m === 'flying' ? '✈️ Flying' : '🚗 Driving'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Arrival ── */}
        <div>
          <p className="font-display text-sm text-gold mb-3">Arrival</p>
          <div className={`grid gap-3 ${mode === 'flying' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
            <div>
              <label className={labelClass} style={labelStyle}>Date &amp; time <span className="normal-case">(Vegas time)</span></label>
              <input
                type="datetime-local"
                name="arrives_at"
                defaultValue={toVegasLocal(src?.arrives_at ?? null)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            {mode === 'flying' && (
              <>
                <div>
                  <label className={labelClass} style={labelStyle}>Airline</label>
                  <input
                    type="text"
                    name="arrival_airline"
                    placeholder="e.g. Southwest"
                    defaultValue={src?.arrival_airline ?? ''}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Flight #</label>
                  <input
                    type="text"
                    name="arrival_flight"
                    placeholder="e.g. WN 1234"
                    defaultValue={src?.arrival_flight ?? ''}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Departure ── */}
        <div>
          <p className="font-display text-sm text-gold mb-3">Departure</p>
          <div className={`grid gap-3 ${mode === 'flying' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
            <div>
              <label className={labelClass} style={labelStyle}>Date &amp; time <span className="normal-case">(Vegas time)</span></label>
              <input
                type="datetime-local"
                name="departs_at"
                defaultValue={toVegasLocal(src?.departs_at ?? null)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            {mode === 'flying' && (
              <>
                <div>
                  <label className={labelClass} style={labelStyle}>Airline</label>
                  <input
                    type="text"
                    name="departure_airline"
                    placeholder="e.g. Delta"
                    defaultValue={src?.departure_airline ?? ''}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Flight #</label>
                  <input
                    type="text"
                    name="departure_flight"
                    placeholder="e.g. DL 5678"
                    defaultValue={src?.departure_flight ?? ''}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass} style={labelStyle}>Notes <span className="normal-case text-text-dim">(optional)</span></label>
          <input
            type="text"
            name="notes"
            placeholder="e.g. Happy to split an Uber from LAS!"
            defaultValue={src?.notes ?? ''}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rsvp-chip px-6 py-2.5 rounded-full text-sm uppercase tracking-widest"
          >
            {pending ? 'Saving…' : hasEntry ? 'Update' : 'Save'}
          </button>
          {hasEntry && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs transition-colors"
              style={{ color: 'rgba(239,68,68,0.5)' }}
            >
              {deleting ? 'Removing…' : 'Remove'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
