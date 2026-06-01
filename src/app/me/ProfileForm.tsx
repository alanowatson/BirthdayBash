'use client';

import { useActionState } from 'react';
import { updateProfileAction } from './actions';
import type { ProfileState } from './actions';

interface Props {
  name: string;
  bio: string | null;
  obsession: string | null;
}

export default function ProfileForm({ name, bio, obsession }: Props) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfileAction, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs uppercase tracking-widest text-text-dim">
          Name <span className="text-gold">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={name}
          className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-xs uppercase tracking-widest text-text-dim">
          One-liner <span className="text-text-dim text-xs normal-case">(optional)</span>
        </label>
        <input
          id="bio"
          name="bio"
          type="text"
          maxLength={120}
          defaultValue={bio ?? ''}
          placeholder="How you know Alan, your vibe, etc."
          className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="obsession" className="text-xs uppercase tracking-widest text-text-dim">
          I will talk your ear off about… <span className="text-text-dim text-xs normal-case">(optional)</span>
        </label>
        <input
          id="obsession"
          name="obsession"
          type="text"
          maxLength={120}
          defaultValue={obsession ?? ''}
          placeholder="Fantasy football, true crime, hot sauces, whatever…"
          className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {state && 'error' in state && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      {state && 'success' in state && (
        <p className="text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-lg px-4 py-3">
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
