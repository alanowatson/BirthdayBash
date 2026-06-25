'use client';

import { useState, useTransition, useRef, useActionState } from 'react';
import { uploadPhotoBySlugAction, submitProfileAction } from './actions';
import type { PhotoState } from './actions';
import type { Travel } from '@/lib/types';

function toVegasLocal(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('sv', { timeZone: 'America/Los_Angeles' }).slice(0, 16);
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

interface Props {
  slug: string;
  name: string;
  currentPhotoUrl: string | null;
  obsession: string | null;
  fun_fact: string | null;
  tshirt_size: string | null;
  travel: Travel | null;
}

const inputClass = 'w-full bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors text-sm';
const labelClass = 'block text-xs uppercase tracking-widest text-text-dim mb-1.5';

export default function ProfileStep({ slug, name, currentPhotoUrl, obsession, fun_fact, tshirt_size, travel }: Props) {
  const [photoState, photoAction, photoPending] = useActionState<PhotoState, FormData>(uploadPhotoBySlugAction, null);
  const [submitPending, startSubmit] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'flying' | 'driving'>(travel?.travel_mode ?? 'flying');

  const photoUrl = (photoState && 'success' in photoState) ? photoState.url : currentPhotoUrl;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startSubmit(() => submitProfileAction(fd));
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Photo ── */}
      <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
        <h2 className="font-display text-lg text-gold mb-5">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div
            className="avatar flex-shrink-0"
            style={{ width: 72, height: 72, fontSize: '1.5rem', background: photoUrl ? undefined : 'linear-gradient(135deg, #D4AF37, #3B82F6)' }}
          >
            {photoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photoUrl} alt={name} className="w-full h-full object-cover rounded-full" />
              : initials(name)
            }
          </div>
          <form action={photoAction} className="flex flex-col gap-1">
            <input type="hidden" name="slug" value={slug} />
            <input
              ref={fileRef}
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.form?.requestSubmit()}
            />
            <button
              type="button"
              disabled={photoPending}
              onClick={() => fileRef.current?.click()}
              className="text-sm text-gold hover:underline disabled:opacity-50 text-left"
            >
              {photoPending ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
            </button>
            <p className="text-text-dim text-xs">JPG, PNG, WebP · max 5MB</p>
            {photoState && 'error' in photoState && (
              <p className="text-xs text-red-400">{photoState.error}</p>
            )}
            {photoState && 'success' in photoState && (
              <p className="text-xs text-emerald-400">Photo saved.</p>
            )}
          </form>
        </div>
      </div>

      {/* ── Main form: profile + travel ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input type="hidden" name="slug" value={slug} />

        {/* About you */}
        <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
          <h2 className="font-display text-lg text-gold mb-5">About You</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>I&rsquo;ll talk your ear off about&hellip; <span className="normal-case text-text-dim">(optional)</span></label>
              <input
                type="text"
                name="obsession"
                maxLength={120}
                defaultValue={obsession ?? ''}
                placeholder="Fantasy football, true crime, hot sauces…"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fun fact <span className="normal-case text-text-dim">(optional)</span></label>
              <input
                type="text"
                name="fun_fact"
                maxLength={160}
                defaultValue={fun_fact ?? ''}
                placeholder="Something the crew might not know about you"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>T-shirt size <span className="normal-case text-text-dim">(optional)</span></label>
              <select name="tshirt_size" defaultValue={tshirt_size ?? ''} className={inputClass}>
                <option value="">— Select a size</option>
                {['XS','S','M','L','XL','XXL'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Travel */}
        <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
          <h2 className="font-display text-lg text-gold mb-1">Getting There</h2>
          <p className="text-text-dim text-xs mb-5">Optional — helps the crew coordinate rides and find each other.</p>

          <div className="flex flex-col gap-4">
            {/* Mode toggle */}
            <div>
              <label className={labelClass}>How are you getting there?</label>
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

            {/* Arrival */}
            <div>
              <p className="font-display text-sm text-gold mb-2">Arrival <span className="font-sans text-xs text-text-dim normal-case">(Vegas time)</span></p>
              <div className="grid gap-3">
                <div>
                  <label className={labelClass}>Date &amp; time</label>
                  <input type="datetime-local" name="arrives_at" defaultValue={toVegasLocal(travel?.arrives_at ?? null)} className={inputClass} />
                </div>
                {mode === 'flying' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Airline</label>
                      <input type="text" name="arrival_airline" placeholder="e.g. Southwest" defaultValue={travel?.arrival_airline ?? ''} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Flight #</label>
                      <input type="text" name="arrival_flight" placeholder="e.g. WN 1234" defaultValue={travel?.arrival_flight ?? ''} className={inputClass} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Departure */}
            <div>
              <p className="font-display text-sm text-gold mb-2">Departure <span className="font-sans text-xs text-text-dim normal-case">(Vegas time)</span></p>
              <div className="grid gap-3">
                <div>
                  <label className={labelClass}>Date &amp; time</label>
                  <input type="datetime-local" name="departs_at" defaultValue={toVegasLocal(travel?.departs_at ?? null)} className={inputClass} />
                </div>
                {mode === 'flying' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Airline</label>
                      <input type="text" name="departure_airline" placeholder="e.g. Delta" defaultValue={travel?.departure_airline ?? ''} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Flight #</label>
                      <input type="text" name="departure_flight" placeholder="e.g. DL 5678" defaultValue={travel?.departure_flight ?? ''} className={inputClass} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accommodation + notes */}
            <div>
              <label className={labelClass}>Staying at <span className="normal-case text-text-dim">(optional)</span></label>
              <input type="text" name="accommodation" placeholder="e.g. Cosmopolitan, Airbnb…" defaultValue={travel?.accommodation ?? ''} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Notes <span className="normal-case text-text-dim">(optional)</span></label>
              <input type="text" name="notes" placeholder="e.g. Happy to split an Uber from LAS!" defaultValue={travel?.notes ?? ''} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 items-center">
          <button
            type="submit"
            disabled={submitPending}
            className="rsvp-chip px-8 py-3 rounded-full uppercase text-sm tracking-widest font-medium disabled:opacity-50 w-full text-center"
          >
            {submitPending ? 'Saving…' : "All done — see my profile →"}
          </button>
          <a href={`/members/${slug}`} className="text-text-dim text-sm hover:text-gold transition-colors">
            Skip for now
          </a>
        </div>
      </form>

    </div>
  );
}
