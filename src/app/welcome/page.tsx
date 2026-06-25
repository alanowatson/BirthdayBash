'use client';

import { useActionState } from 'react';
import { welcomeStep1Action } from './actions';
import type { WelcomeStep1State } from './actions';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

function StepIndicator() {
  const steps = [
    { n: 1, label: 'Your info' },
    { n: 2, label: 'The schedule' },
    { n: 3, label: 'Your profile' },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center">
          {i > 0 && <div className="w-12 h-px mx-1" style={{ background: 'var(--gold-soft)' }} />}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono-x transition-all"
              style={{
                background: n === 1 ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                color: n === 1 ? '#07101F' : 'var(--text-dim)',
                border: n !== 1 ? '1px solid var(--gold-soft)' : 'none',
              }}
            >
              {n}
            </div>
            <span className="text-xs" style={{ color: n === 1 ? 'var(--gold)' : 'var(--text-dim)' }}>
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export { StepIndicator };

export default function WelcomePage() {
  const [state, action, pending] = useActionState<WelcomeStep1State, FormData>(
    welcomeStep1Action,
    null
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="section-label section-label-blue mb-4">You&#39;re invited</p>
            <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-3">
              Vegas 2026
            </h1>
            <p className="text-text-dim">
              Alan&#39;s 40th. October 22–26. Let&#39;s get you on the list.
            </p>
          </div>

          <StepIndicator />

          <form
            action={action}
            className="event-card event-card-static border border-gold-soft rounded-xl p-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="w-name" className="text-xs uppercase tracking-widest text-text-dim">
                Full name <span className="text-gold">*</span>
              </label>
              <input
                id="w-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="field-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="w-email" className="text-xs uppercase tracking-widest text-text-dim">
                Email <span className="text-gold">*</span>
              </label>
              <input
                id="w-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="field-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="w-bio" className="text-xs uppercase tracking-widest text-text-dim">
                How do you know Alan?{' '}
                <span className="text-text-dim text-xs normal-case">(optional)</span>
              </label>
              <input
                id="w-bio"
                name="bio"
                type="text"
                maxLength={120}
                placeholder="College, work, fantasy football nemesis…"
                className="field-input"
              />
            </div>

            {state && 'error' in state && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
                {state.error}
              </p>
            )}
            {state && 'sent' in state && (
              <p className="text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-lg px-4 py-3">
                You&apos;re already on the list! We sent a sign-in link to <strong>{state.sent}</strong> — click it to continue.
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? 'One sec…' : 'Next — see the schedule →'}
            </button>
          </form>

          <p className="text-center text-text-dim text-xs mt-5">
            Already signed up?{' '}
            <a href="/me" className="text-gold hover:underline">Sign in here</a>
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
