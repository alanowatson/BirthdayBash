'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

const LINKS = [
  { href: '/#agenda',          label: 'Deets' },
  { href: '/scavenger-hunt',   label: 'Scavenger Hunt' },
  { href: '/#members',         label: "Who's Coming" },
  { href: '/map',              label: 'Maps' },
  { href: '/tips',             label: 'Insider Tips' },
  { href: '/#links',           label: 'Links' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  // null = unknown (loading), true = signed in, false = signed out
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
    });
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'var(--gold-soft)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 relative flex items-center justify-between md:justify-center">

        {/* Logo — left */}
        <a href="/" className="flex items-center gap-2 md:absolute md:left-6" onClick={() => setOpen(false)}>
          <span className="text-gold text-2xl">◆</span>
          <span className="font-display text-xl tracking-widest text-text">ALAN&#39;S 40TH</span>
        </a>

        {/* Desktop links — centered */}
        <div className="hidden md:flex items-center gap-8 text-sm text-text-dim">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold transition-colors">{l.label}</a>
          ))}
        </div>

        {/* Right slot — Profile (signed in) or Get on the list (signed out). Hidden until auth known to prevent flash. */}
        <div className="hidden md:flex md:absolute md:right-6">
          {signedIn === true && (
            <a href="/me" className="text-sm text-text-dim hover:text-gold transition-colors">
              Profile
            </a>
          )}
          {signedIn === false && (
            <a href="/welcome" className="rsvp-chip px-4 py-2 rounded-full text-xs">
              Get on the list
            </a>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-text-dim hover:text-gold transition-colors p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t flex flex-col"
          style={{ background: 'rgba(0,0,0,0.95)', borderColor: 'var(--gold-soft)' }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-6 py-4 text-sm text-text-dim hover:text-gold hover:bg-white/5 transition-colors border-b"
              style={{ borderColor: 'rgba(212,175,55,0.08)' }}
            >
              {l.label}
            </a>
          ))}
          {signedIn === true && (
            <a href="/me" onClick={() => setOpen(false)}
              className="px-6 py-4 text-sm text-text-dim hover:text-gold hover:bg-white/5 transition-colors border-b"
              style={{ borderColor: 'rgba(212,175,55,0.08)' }}>
              Profile
            </a>
          )}
          {signedIn === false && (
            <div className="px-6 py-4">
              <a href="/welcome" onClick={() => setOpen(false)}
                className="rsvp-chip px-5 py-2.5 rounded-full text-xs inline-block">
                Get on the list
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
