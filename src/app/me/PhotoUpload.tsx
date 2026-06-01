'use client';

import { useActionState, useRef } from 'react';
import { uploadPhotoAction } from './actions';
import type { PhotoState } from './actions';

interface Props {
  currentUrl: string | null;
  name: string;
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function PhotoUpload({ currentUrl, name }: Props) {
  const [state, action, pending] = useActionState<PhotoState, FormData>(uploadPhotoAction, null);
  const inputRef = useRef<HTMLInputElement>(null);

  const photoUrl = (state && 'success' in state) ? state.url : currentUrl;

  return (
    <div className="flex items-center gap-6">
      <div
        className="avatar flex-shrink-0"
        style={{ width: 72, height: 72, fontSize: '1.5rem', background: photoUrl ? undefined : 'linear-gradient(135deg, #D4AF37, #3B82F6)' }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="w-full h-full object-cover rounded-full" />
        ) : (
          initials(name)
        )}
      </div>

      <div className="flex-1">
        <form action={action} className="flex flex-col gap-2">
          <input
            ref={inputRef}
            name="photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.form?.requestSubmit()}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="text-sm text-gold hover:underline disabled:opacity-50 text-left"
          >
            {pending ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
          </button>
          <p className="text-text-dim text-xs">JPG, PNG, WebP · max 5MB</p>
          {state && 'error' in state && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}
          {state && 'success' in state && (
            <p className="text-xs text-emerald-400">Photo updated.</p>
          )}
        </form>
      </div>
    </div>
  );
}
