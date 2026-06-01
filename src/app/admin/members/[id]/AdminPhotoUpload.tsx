'use client';

import { useActionState, useRef } from 'react';
import { adminUploadPhotoAction } from './actions';
import type { AdminPhotoState } from './actions';

interface Props {
  memberId: string;
  currentUrl: string | null;
  name: string;
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function AdminPhotoUpload({ memberId, currentUrl, name }: Props) {
  const [state, action, pending] = useActionState<AdminPhotoState, FormData>(adminUploadPhotoAction, null);
  const inputRef = useRef<HTMLInputElement>(null);

  const photoUrl = (state && 'success' in state) ? state.url : currentUrl;

  return (
    <div className="flex items-center gap-5">
      {/* Avatar preview */}
      <div
        className="avatar flex-shrink-0"
        style={{
          width: 80,
          height: 80,
          fontSize: '1.6rem',
          background: photoUrl ? undefined : 'linear-gradient(135deg, #D4AF37, #3B82F6)',
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="w-full h-full object-cover rounded-full" />
        ) : (
          initials(name)
        )}
      </div>

      {/* Upload trigger */}
      <div className="flex-1">
        <form action={action}>
          <input type="hidden" name="member_id" value={memberId} />
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
            className="rsvp-chip px-4 py-2 rounded-full text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {pending ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
          </button>
          <p className="text-text-dim text-xs mt-2">JPG, PNG, WebP · max 5MB · auto-saves</p>
          {state && 'error' in state && (
            <p className="text-xs text-red-400 mt-1">{state.error}</p>
          )}
          {state && 'success' in state && (
            <p className="text-xs text-emerald-400 mt-1">Photo updated.</p>
          )}
        </form>
      </div>
    </div>
  );
}
