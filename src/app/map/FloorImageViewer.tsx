'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface EdgeLabel {
  edge: 'left' | 'right' | 'bottom' | 'bottom-right';
  label: string;
  color: string;
}

interface FloorImageViewerProps {
  src: string;
  alt: string;
  edgeLabels?: EdgeLabel[];
  placeholderInstructions?: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function FloorImageViewer({ src, alt, edgeLabels = [], placeholderInstructions }: FloorImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampPan = useCallback((x: number, y: number, z: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const maxX = (el.clientWidth * (z - 1)) / 2;
    const maxY = (el.clientHeight * (z - 1)) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev - e.deltaY * 0.001));
      setPan((p) => clampPan(p.x, p.y, next));
      return next;
    });
  }, [clampPan]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [zoom, pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan(clampPan(e.clientX - dragStart.x, e.clientY - dragStart.y, zoom));
  }, [isDragging, dragStart, zoom, clampPan]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  const lastTouches = useRef<React.Touch[]>([]);
  const onTouchStart = useCallback((e: React.TouchEvent) => { lastTouches.current = Array.from(e.touches); }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touches = Array.from(e.touches);
    if (touches.length === 2 && lastTouches.current.length === 2) {
      const prev = Math.hypot(lastTouches.current[0].clientX - lastTouches.current[1].clientX, lastTouches.current[0].clientY - lastTouches.current[1].clientY);
      const curr = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      setZoom((z) => { const n = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * (curr / prev))); setPan((p) => clampPan(p.x, p.y, n)); return n; });
    } else if (touches.length === 1 && lastTouches.current.length === 1 && zoom > 1) {
      setPan((p) => clampPan(p.x + touches[0].clientX - lastTouches.current[0].clientX, p.y + touches[0].clientY - lastTouches.current[0].clientY, zoom));
    }
    lastTouches.current = touches;
  }, [zoom, clampPan]);

  function reset() { setZoom(1); setPan({ x: 0, y: 0 }); }

  const showPlaceholder = imageError || !src;

  // Edge label positioning
  const edgeStyle = (edge: EdgeLabel['edge']): React.CSSProperties => {
    switch (edge) {
      case 'left':         return { left: 0,   top: '50%',  transform: 'translateY(-50%)' };
      case 'right':        return { right: 0,  top: '50%',  transform: 'translateY(-50%)' };
      case 'bottom':       return { bottom: 0, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right': return { bottom: 0, right: 0 };
    }
  };

  const edgeArrow = (edge: EdgeLabel['edge']) => {
    switch (edge) {
      case 'left':         return '←';
      case 'right':        return '→';
      case 'bottom':       return '↓';
      case 'bottom-right': return '↘';
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden select-none" style={{ background: '#07070f', border: '1px solid rgba(212,175,55,0.15)' }}>
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5">
        <button onClick={() => { const n = Math.min(MAX_ZOOM, zoom + 0.5); setZoom(n); setPan(p => clampPan(p.x, p.y, n)); }}
          className="w-8 h-8 rounded flex items-center justify-center text-sm"
          style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}>+</button>
        <button onClick={() => { const n = Math.max(MIN_ZOOM, zoom - 0.5); setZoom(n); setPan(p => clampPan(p.x, p.y, n)); }}
          className="w-8 h-8 rounded flex items-center justify-center text-sm"
          style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}>−</button>
        {zoom !== 1 && (
          <button onClick={reset} className="h-8 px-2 rounded text-xs"
            style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(212,175,55,0.3)', color: 'rgba(212,175,55,0.6)' }}>Reset</button>
        )}
        <div className="h-8 px-2 rounded text-xs flex items-center"
          style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.3)' }}>
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Image + pan layer */}
      <div
        ref={containerRef}
        style={{ height: 520, overflow: 'hidden', cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={() => { lastTouches.current = []; }}
      >
        <div style={{
          width: '100%', height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
        }}>
          {showPlaceholder ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <span className="text-4xl opacity-30">🗺️</span>
              <div>
                <p className="font-display text-gold text-lg mb-2">Screenshot not yet added</p>
                {placeholderInstructions && (
                  <p className="text-text-dim text-sm leading-relaxed max-w-md">{placeholderInstructions}</p>
                )}
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} onError={() => setImageError(true)}
              draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          )}
        </div>
      </div>

      {/* Edge labels — rendered outside the pan/zoom layer so they always stay at the edges */}
      {!showPlaceholder && edgeLabels.map((el) => (
        <div
          key={el.label}
          className="absolute z-10 pointer-events-none"
          style={edgeStyle(el.edge)}
        >
          <div
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
            style={{
              background: el.color + 'dd',
              color: '#000',
              borderRadius: el.edge === 'left' ? '0 6px 6px 0' : el.edge === 'right' ? '6px 0 0 6px' : el.edge === 'bottom-right' ? '6px 0 0 0' : '6px 6px 0 0',
              boxShadow: `0 2px 8px ${el.color}40`,
            }}
          >
            {el.edge === 'right' && <span>{el.label}</span>}
            <span>{edgeArrow(el.edge)}</span>
            {(el.edge !== 'right') && <span>{el.label}</span>}
          </div>
        </div>
      ))}

      {zoom > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.4)' }}>
            drag to pan · scroll or pinch to zoom
          </div>
        </div>
      )}
    </div>
  );
}
