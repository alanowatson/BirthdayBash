'use client';

import { useActionState, useEffect, useState } from 'react';
import { submitRsvpAction } from './actions';
import type { RsvpState } from './actions';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

const INPUT =
  'bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors w-full';

export default function SignupPage() {
  const [state, action, pending] = useActionState<RsvpState, FormData>(submitRsvpAction, null);
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (state && 'signInUrl' in state) {
      setNavigating(true);
      window.location.href = state.signInUrl;
    }
  }, [state]);

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="section-label mb-4">RSVP</p>
            <h1 className="font-display text-5xl gold-gradient mb-3">Alan&apos;s 40th</h1>
            <p className="text-text-dim">Vegas · Oct 22–26, 2026</p>
          </div>

          <form
            action={action}
            className="event-card event-card-static border border-gold-soft rounded-xl p-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-text-dim">
                Full Name <span className="text-gold">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className={INPUT}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-text-dim">
                Email <span className="text-gold">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={INPUT}
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-text-dim mb-3">
                Can you make it to Vegas?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'yes', label: "I'm in! 🎉", sub: 'Count me for Vegas 2026' },
                  { value: 'no', label: "Can't make it", sub: "I'll sit this one out" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAttending(opt.value as 'yes' | 'no')}
                    className="py-4 px-4 rounded-xl border text-left transition-all"
                    style={{
                      borderColor: attending === opt.value ? 'var(--gold)' : 'var(--gold-soft)',
                      background:
                        attending === opt.value ? 'rgba(212,175,55,0.08)' : 'transparent',
                    }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: attending === opt.value ? 'var(--gold)' : 'var(--text)' }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                      {opt.sub}
                    </p>
                  </button>
                ))}
              </div>
              <input type="hidden" name="attending" value={attending} />
            </div>

            {state && 'error' in state && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending || navigating}
              className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {navigating
                ? 'Setting things up…'
                : pending
                ? 'Saving…'
                : attending === 'yes'
                ? 'Count me in →'
                : 'Submit →'}
            </button>
          </form>

          <p className="text-center text-text-dim text-xs mt-6">
            Already signed up?{' '}
            <a href="/me" className="text-gold hover:underline">
              Sign in to your profile →
            </a>
          </p>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
