'use client';

import { useState, useTransition } from 'react';
import { CREWS, CREW_KEYS } from '@/lib/crews';
import { updateMemberGroupAction } from './actions';

interface Props {
  memberId: string;
  currentGroups: string[];
}

export default function CrewAssignForm({ memberId, currentGroups }: Props) {
  const [selected, setSelected] = useState<string[]>(currentGroups);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    setSaved(false);
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function save() {
    startTransition(async () => {
      const fd = new FormData();
      fd.append('id', memberId);
      for (const g of selected) fd.append('group', g);
      await updateMemberGroupAction(fd);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {CREW_KEYS.map((key) => {
          const crew = CREWS[key];
          const active = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
              style={{
                background: active ? crew.color : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? crew.color : 'rgba(255,255,255,0.12)'}`,
                color: active ? '#fff' : 'var(--text-dim)',
                boxShadow: active ? `0 0 14px ${crew.glow}` : 'none',
                fontWeight: active ? 600 : 400,
              }}
            >
              {active && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {crew.label}
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-text-dim italic">No crews assigned — member will have no badge.</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rsvp-chip px-5 py-2.5 rounded-full uppercase text-xs tracking-widest self-start disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save Crews'}
        </button>
        {saved && !pending && (
          <span className="text-xs text-green-400 transition-opacity">Saved!</span>
        )}
      </div>
    </div>
  );
}
