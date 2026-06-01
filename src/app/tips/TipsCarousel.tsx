'use client';

import { useState } from 'react';
import { TIPS } from '@/lib/tips';

export default function TipsCarousel() {
  const [active, setActive] = useState(0);
  const tip = TIPS[active];

  return (
    <div className="flex flex-col items-center w-full">

      {/* Numbered nav */}
      <div className="flex gap-2 mb-8">
        {TIPS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActive(i)}
            className="w-10 h-10 text-sm transition-all duration-200 font-display"
            style={{
              border: `1px solid ${i === active ? t.accent : 'rgba(255,255,255,0.12)'}`,
              background: i === active ? t.accent + '18' : 'transparent',
              color: i === active ? t.accent : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
            }}
          >
            {t.number}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div
        className="w-full max-w-2xl relative p-8 md:p-10 transition-shadow duration-500"
        style={{
          border: `1px solid ${tip.accent}30`,
          background: 'linear-gradient(145deg, rgba(17,17,24,0.9), rgba(14,14,20,0.9))',
          boxShadow: `0 0 60px ${tip.accent}10, 0 0 120px ${tip.accent}05`,
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-10 h-10" style={{ borderTop: `2px solid ${tip.accent}`, borderLeft: `2px solid ${tip.accent}` }} />
        <div className="absolute bottom-0 right-0 w-10 h-10" style={{ borderBottom: `2px solid ${tip.accent}`, borderRight: `2px solid ${tip.accent}` }} />

        {/* Ghost number */}
        <div
          className="absolute top-3 right-6 font-display text-7xl leading-none select-none pointer-events-none"
          style={{ color: tip.accent + '18', letterSpacing: '-2px' }}
        >
          {tip.number}
        </div>

        {/* Category tag */}
        <div
          className="inline-block text-xs tracking-widest font-display px-3 py-1 mb-5"
          style={{ color: tip.accent, border: `1px solid ${tip.accent}40` }}
        >
          {tip.category}
        </div>

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-2">
          <span className="text-2xl mt-0.5 leading-tight">{tip.icon}</span>
          <h2 className="font-display text-2xl md:text-3xl text-text leading-tight">{tip.title}</h2>
        </div>

        {/* Subtitle */}
        <p className="text-xs uppercase tracking-widest text-text-dim mb-6 ml-9">
          {tip.subtitle}
        </p>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{ background: `linear-gradient(90deg, ${tip.accent}60, transparent)` }}
        />

        {/* Body */}
        <p className="text-text leading-relaxed mb-6" style={{ color: 'rgba(184,176,160,1)' }}>
          {tip.body}
        </p>

        {/* Pro tip */}
        <div
          className="text-sm leading-relaxed italic"
          style={{
            background: tip.accent + '0d',
            borderLeft: `3px solid ${tip.accent}`,
            padding: '12px 16px',
            color: 'rgba(138,128,112,1)',
          }}
        >
          {tip.note}
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex gap-6 mt-8">
        <button
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          disabled={active === 0}
          className="text-xs tracking-widest transition-colors px-5 py-2"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: active === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
            cursor: active === 0 ? 'default' : 'pointer',
          }}
        >
          ← PREV
        </button>
        <button
          onClick={() => setActive((a) => Math.min(TIPS.length - 1, a + 1))}
          disabled={active === TIPS.length - 1}
          className="text-xs tracking-widest transition-colors px-5 py-2"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: active === TIPS.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
            cursor: active === TIPS.length - 1 ? 'default' : 'pointer',
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
