'use client';

import { useActionState } from 'react';
import { signupAction } from './actions';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, null);

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="section-label mb-4">Join the List</p>
            <h1 className="font-display text-5xl gold-gradient mb-3">Get on the List</h1>
            <p className="text-text-dim">
              Lock in your spot for Vegas 2026. Alan&#39;s 40th is not to be missed.
            </p>
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
                className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
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
                placeholder="Fantasy football, true crime, hot sauces, whatever…"
                className="bg-transparent border border-gold-soft rounded-lg px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Are you in for the weekend?</p>
              {[
                { value: 'yes', label: "I'm in!", sublabel: 'Count me for Vegas 2026' },
                { value: 'no',  label: "Can't make it", sublabel: "I'll sit this one out" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="trip_rsvp"
                    value={opt.value}
                    defaultChecked={opt.value === 'yes'}
                    className="accent-gold"
                  />
                  <span>
                    <span className="text-text text-sm group-hover:text-gold transition-colors">{opt.label}</span>
                    <span className="text-text-dim text-xs ml-2">{opt.sublabel}</span>
                  </span>
                </label>
              ))}
            </div>

            {state?.error && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? 'Saving…' : 'Submit →'}
            </button>
          </form>

          <p className="text-center text-text-dim text-xs mt-6">
            Already signed up?{' '}
            <a href="/members" className="text-gold hover:underline">
              Find yourself on the guest list
            </a>
          </p>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
