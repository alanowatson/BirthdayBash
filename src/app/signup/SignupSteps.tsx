interface Props {
  current: 2 | 3 | 4;
}

const STEPS = ['RSVP', 'Profile', 'Events', 'Travel'] as const;

export default function SignupSteps({ current }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {STEPS.map((label, i) => {
        const stepNum = (i + 1) as 1 | 2 | 3 | 4;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <span key={label} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-xs mx-1" style={{ color: 'rgba(212,175,55,0.3)' }}>→</span>
            )}
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                color: active ? 'var(--gold)' : done ? 'var(--text-dim)' : 'rgba(255,255,255,0.15)',
                textDecoration: done ? 'line-through' : 'none',
              }}
            >
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
