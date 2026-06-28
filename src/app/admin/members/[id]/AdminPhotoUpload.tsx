'use client';

import { useActionState, useRef, useState } from 'react';
import { adminUploadPhotoAction } from './actions';
import type { AdminPhotoState } from './actions';
import PhotoCropModal from '@/components/PhotoCropModal';

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
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const photoUrl = (state && 'success' in state) ? state.url : currentUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected after cancel
    e.target.value = '';
    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  function handleCropSave(blob: Blob) {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);

    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
    const fd = new FormData();
    fd.append('member_id', memberId);
    fd.append('photo', file, 'avatar.jpg');
    action(fd);
  }

  return (
    <>
      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}

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
          <input
            ref={inputRef}
            name="photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="rsvp-chip px-4 py-2 rounded-full text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {pending ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
          </button>
          <p className="text-text-dim text-xs mt-2">JPG, PNG, WebP · max 5MB · crop before saving</p>
          {state && 'error' in state && (
            <p className="text-xs text-red-400 mt-1">{state.error}</p>
          )}
          {state && 'success' in state && (
            <p className="text-xs text-emerald-400 mt-1">Photo updated.</p>
          )}
        </div>
      </div>
    </>
  );
}
