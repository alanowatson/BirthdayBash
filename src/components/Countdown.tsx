'use client';

import { useEffect, useState } from 'react';

// Oct 22, 2026 — midnight PDT (UTC-7)
const TARGET = new Date('2026-10-22T07:00:00Z').getTime();

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  const diff = Math.max(0, TARGET - Date.now());
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) return null;

  const units = [
    { label: 'Days',    value: time.days },
    { label: 'Hours',   value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 mb-10">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <span
              className="font-display tabular-nums"
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                lineHeight: 1,
                color: 'var(--gold)',
                fontVariantNumeric: 'lining-nums',
                fontFeatureSettings: '"lnum" 1',
              }}
            >
              {label === 'Days' ? time.days : pad(value)}
            </span>
            <span className="text-xs uppercase tracking-widest text-text-dim mt-1">{label}</span>
          </div>
          {i < units.length - 1 && (
            <span
              className="font-display pb-4"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'rgba(212,175,55,0.3)' }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
