'use client';

import { useTransition } from 'react';
import { deleteMemberAction } from './actions';

export default function DeleteMemberButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Remove ${name}?`)) return;
    const fd = new FormData();
    fd.set('id', id);
    startTransition(() => { deleteMemberAction(fd); });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-text-dim hover:text-red-400 transition-colors px-2 py-1.5 disabled:opacity-50"
    >
      {isPending ? 'Removing…' : 'Remove'}
    </button>
  );
}
