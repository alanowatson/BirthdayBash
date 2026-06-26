'use client';

import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  // Draw the full image first at its natural size
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = image.naturalWidth;
  fullCanvas.height = image.naturalHeight;
  const fullCtx = fullCanvas.getContext('2d')!;
  fullCtx.drawImage(image, 0, 0);

  // Extract the cropped region as pixel data
  const cropData = fullCtx.getImageData(
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height),
  );

  // Paste into an intermediate canvas at crop size
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = Math.round(pixelCrop.width);
  cropCanvas.height = Math.round(pixelCrop.height);
  cropCanvas.getContext('2d')!.putImageData(cropData, 0, 0);

  // Scale down to 400×400 output
  const out = document.createElement('canvas');
  out.width = 400;
  out.height = 400;
  out.getContext('2d')!.drawImage(cropCanvas, 0, 0, 400, 400);

  return new Promise<Blob>((resolve, reject) => {
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      0.92,
    );
  });
}

interface Props {
  imageSrc: string;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
}

export default function PhotoCropModal({ imageSrc, onSave, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  // Use a ref so handleSave always sees the latest value without stale closure issues
  const croppedAreaPixelsRef = useRef<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    croppedAreaPixelsRef.current = pixels;
  }, []);

  async function handleSave() {
    const pixels = croppedAreaPixelsRef.current;
    if (!pixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, pixels);
      onSave(blob);
    } catch (err) {
      console.error('Crop failed:', err);
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <div className="w-full max-w-sm">
        <p className="font-display text-gold text-center text-lg mb-4">Drag &amp; zoom to frame the shot</p>

        {/* Crop area */}
        <div className="relative rounded-xl overflow-hidden" style={{ height: 320, background: '#111' }}>
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'var(--text-dim)' }}>
              <span className="text-sm">Loading…</span>
            </div>
          )}
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={() => setReady(true)}
            style={{
              containerStyle: { borderRadius: 12 },
              cropAreaStyle: {
                border: '2px solid rgba(212,175,55,0.85)',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
              },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="mt-4 px-1 flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--text-dim)' }}>−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-gold"
            style={{ accentColor: 'var(--gold)' }}
          />
          <span className="text-sm" style={{ color: 'var(--text-dim)' }}>+</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-dim)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !ready}
            className="flex-1 rsvp-chip py-3 rounded-xl text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {saving ? 'Saving…' : !ready ? 'Loading…' : 'Use this crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
