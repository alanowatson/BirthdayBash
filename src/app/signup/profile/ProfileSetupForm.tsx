'use client';

import { useActionState } from 'react';
import { saveSignupProfileAction } from './actions';
import type { ProfileSetupState } from './actions';

interface Props {
  bio: string | null;
  obsession: string | null;
  tshirt_size: string | null;
}

export default function ProfileSetupForm({ bio, obsession, tshirt_size }: Props) {
  const [state, action, pending] = useActionState<ProfileSetupState, FormData>(
    saveSignupProfileAction,
    null
  );

  return (
    <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
      <form action={action} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-text-dim">
            How do you know Alan?{' '}
            <span className="normal-case text-text-dim">(optional)</span>
          </label>
          <input
            name="bio"
            type="text"
            defaultValue={bio ?? ''}
            maxLength={120}
            placeholder="College roommate, coworker, his dad…"
            className="field-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-text-dim">
            I&apos;ll talk your ear off about…{' '}
            <span className="normal-case text-text-dim">(optional)</span>
          </label>
          <input
            name="obsession"
            type="text"
            defaultValue={obsession ?? ''}
            maxLength={120}
            placeholder="Fantasy football, hot sauces, true crime…"
            className="field-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-text-dim">
            T-Shirt Size{' '}
            <span className="normal-case text-text-dim">(optional)</span>
          </label>
          <select name="tshirt_size" defaultValue={tshirt_size ?? ''} className="field-input">
            <option value="">— Select a size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        {state?.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}

        <div className="flex gap-4 items-center">
          <button
            type="submit"
            disabled={pending}
            className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'Saving…' : 'Continue →'}
          </button>
          <a
            href="/signup/events"
            className="text-text-dim text-sm hover:text-gold transition-colors"
          >
            Skip for now
          </a>
        </div>
      </form>
    </div>
  );
}
