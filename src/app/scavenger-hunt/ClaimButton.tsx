'use client';

import { useTransition } from 'react';
import { toggleClaimAction } from './actions';

interface Props {
  id: string;
  isClaimed: boolean;
  claimedBy: string | null;
}

export default function ClaimButton({ id, isClaimed, claimedBy }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const msg = isClaimed
      ? `Unmark this card as claimed${claimedBy ? ` (currently claimed by ${claimedBy})` : ''}?`
      : 'Mark this card as CLAIMED? It will be visibly crossed off for all guests.';
    if (!confirm(msg)) return;

    const fd = new FormData();
    fd.set('id', id);
    fd.set('is_claimed', (!isClaimed).toString());
    startTransition(() => { toggleClaimAction(fd); });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="mt-3 pt-3 w-full text-xs transition-colors border-t"
      style={{
        borderColor: isClaimed ? 'rgba(239,68,68,0.2)' : 'rgba(212,175,55,0.15)',
        color: isClaimed ? 'rgba(239,68,68,0.6)' : 'rgba(212,175,55,0.5)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = isClaimed ? '#ef4444' : '#D4AF37';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = isClaimed
          ? 'rgba(239,68,68,0.6)'
          : 'rgba(212,175,55,0.5)';
      }}
    >
      {isPending ? '...' : isClaimed ? '↩ Unmark claimed' : '✓ Mark as claimed'}
    </button>
  );
}
