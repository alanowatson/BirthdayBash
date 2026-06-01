'use client';

import { useActionState } from 'react';
import { sendMagicLinkAction } from './actions';
import type { MagicLinkState } from './actions';

export default function MagicLinkForm() {
  const [state, action, pending] = useActionState<MagicLinkState, FormData>(sendMagicLinkAction, null);

  if (state && 'success' in state) {
    return (
      <div
        className="event-card event-card-static border border-gold-soft rounded-xl p-8 text-center"
      >
        <p className="font-display text-2xl text-gold mb-2">Check your email</p>
        <p className="text-text-dim text-sm">
          Magic link sent to <span className="text-text">{state.email}</span>. Click the link to
          sign in and access your profile.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="event-card event-card-static border border-gold-soft rounded-xl p-8 flex flex-col gap-5">
      <div>
        <p className="font-display text-2xl text-gold mb-1">Sign in</p>
        <p className="text-text-dim text-sm">Enter your email and we&#39;ll send you a magic link.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signin-email" className="text-xs uppercase tracking-widest text-text-dim">
          Email
        </label>
        <input
          id="signin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors text-sm"
        />
      </div>

      {state && 'error' in state && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send magic link →'}
      </button>

      <p className="text-center text-text-dim text-xs">
        Not on the list yet?{' '}
        <a href="/signup" className="text-gold hover:underline">Sign up here</a>
      </p>
    </form>
  );
}
