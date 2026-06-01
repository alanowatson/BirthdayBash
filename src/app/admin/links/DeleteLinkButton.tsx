'use client';

import { useTransition } from 'react';
import { deleteLinkAction } from './actions';

export default function DeleteLinkButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${title}"?`)) return;
    const fd = new FormData();
    fd.set('id', id);
    startTransition(() => { deleteLinkAction(fd); });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-text-dim hover:text-red-400 transition-colors uppercase tracking-widest disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
