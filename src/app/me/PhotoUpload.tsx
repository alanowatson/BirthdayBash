'use client';

import { useActionState, useRef, useState } from 'react';
import { uploadPhotoAction } from './actions';
import type { PhotoState } from './actions';
import PhotoCropModal from '@/components/PhotoCropModal';

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
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const photoUrl = state && 'success' in state ? state.url : currentUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setCropSrc(URL.createObjectURL(file));
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
    fd.append('photo', file, 'avatar.jpg');
    action(fd);
  }

  return (
    <>
      {cropSrc && (
        <PhotoCropModal imageSrc={cropSrc} onSave={handleCropSave} onCancel={handleCropCancel} />
      )}

      <div className="flex items-center gap-6">
        <div
          className="avatar flex-shrink-0"
          style={{
            width: 72,
            height: 72,
            fontSize: '1.5rem',
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

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="text-sm text-gold hover:underline disabled:opacity-50 text-left"
          >
            {pending ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
          </button>
          <p className="text-text-dim text-xs mt-1">JPG, PNG, WebP · max 5MB</p>
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
