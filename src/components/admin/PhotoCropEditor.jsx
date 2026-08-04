import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * PhotoCropEditor — Instagram-style circular crop editor.
 *
 * Crop values stored as PERCENTAGES of container size (0–100), not pixels.
 * This makes the crop render identically at any container size (editor=288px, invitation=128px).
 *
 *   x, y  : translate as % of container size  (e.g. 10 means shift by 10% of container width/height)
 *   scale : zoom multiplier (1 = fit, 4 = max)
 *
 * At render time:  translatePx = (x / 100) * containerSizePx
 */

const CIRCLE_SIZE = 288; // px — editor circle diameter

function PhotoCropEditor({ src, initialCrop, onSave, onCancel }) {
  const [crop, setCrop] = useState(() => ({
    x: initialCrop?.x ?? 0,   // % of container
    y: initialCrop?.y ?? 0,   // % of container
    scale: initialCrop?.scale ?? 1,
  }));

  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });
  const containerRef = useRef(null);

  /**
   * Clamp: after object-cover+scale, how far can we translate before an edge shows?
   * At scale s, rendered size = CIRCLE_SIZE * s.
   * Max pixel shift = (CIRCLE_SIZE * s - CIRCLE_SIZE) / 2 = CIRCLE_SIZE * (s-1) / 2
   * As percentage of CIRCLE_SIZE: maxPct = (s - 1) / 2 * 100
   */
  const clamp = useCallback((nextCrop) => {
    const s = nextCrop.scale;
    const maxPct = ((s - 1) / 2) * 100;
    return {
      ...nextCrop,
      x: Math.min(maxPct, Math.max(-maxPct, nextCrop.x)),
      y: Math.min(maxPct, Math.max(-maxPct, nextCrop.y)),
    };
  }, []);

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y };
  };

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    // Convert pixel delta → percentage of circle size
    const dxPct = ((e.clientX - dragStart.current.mx) / CIRCLE_SIZE) * 100;
    const dyPct = ((e.clientY - dragStart.current.my) / CIRCLE_SIZE) * 100;
    setCrop(prev => clamp({ ...prev, x: dragStart.current.cx + dxPct, y: dragStart.current.cy + dyPct }));
  }, [dragging, clamp]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── Touch drag / pinch zoom ─────────────────────────────────────────────────
  const touchRef = useRef({ x: 0, y: 0, dist: 0, cx: 0, cy: 0, cs: 1 });

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchRef.current = {
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        cx: crop.x, cy: crop.y, cs: crop.scale, dist: 0,
      };
      setDragging(true);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current = { ...touchRef.current, dist: Math.hypot(dx, dy), cs: crop.scale };
      setDragging(false);
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      const dxPct = ((e.touches[0].clientX - touchRef.current.x) / CIRCLE_SIZE) * 100;
      const dyPct = ((e.touches[0].clientY - touchRef.current.y) / CIRCLE_SIZE) * 100;
      setCrop(prev => clamp({ ...prev, x: touchRef.current.cx + dxPct, y: touchRef.current.cy + dyPct }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / (touchRef.current.dist || dist);
      const newScale = Math.min(4, Math.max(1, touchRef.current.cs * ratio));
      setCrop(prev => clamp({ ...prev, scale: newScale }));
    }
  };

  const onTouchEnd = () => setDragging(false);

  // ── Scroll to zoom ──────────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setCrop(prev => clamp({ ...prev, scale: Math.min(4, Math.max(1, prev.scale + delta)) }));
  }, [clamp]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const handleSave = () => onSave(crop);
  const handleReset = () => setCrop({ x: 0, y: 0, scale: 1 });

  // Render: convert % back to px for this editor's CIRCLE_SIZE
  const txPx = (crop.x / 100) * CIRCLE_SIZE;
  const tyPx = (crop.y / 100) * CIRCLE_SIZE;

  const imgStyle = {
    transform: `translate(${txPx}px, ${tyPx}px) scale(${crop.scale})`,
    transformOrigin: 'center center',
    cursor: dragging ? 'grabbing' : 'grab',
    userSelect: 'none',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-6 gap-5 w-[360px] max-w-[95vw]">

        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-800">Batal</button>
          <span className="text-sm font-medium text-gray-800">Sesuaikan foto</span>
          <button
            onClick={handleSave}
            className="text-sm font-semibold text-[var(--color-primary)] hover:opacity-80"
          >
            Simpan
          </button>
        </div>

        {/* Circle crop area */}
        <div
          ref={containerRef}
          className="relative select-none"
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: '50%',
            overflow: 'hidden',
            isolation: 'isolate',
            background: '#f0f0f0',
            border: '4px solid rgba(var(--color-primary-rgb, 180,60,100), 0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={src}
            alt="Crop"
            className="absolute inset-0 w-full h-full object-cover"
            style={imgStyle}
            draggable={false}
          />

          {/* Rule-of-thirds grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), ' +
                'linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '33.33% 33.33%',
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="w-full px-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">🔍</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              value={crop.scale}
              onChange={(e) => setCrop(prev => clamp({ ...prev, scale: parseFloat(e.target.value) }))}
              className="flex-1 h-1.5 accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8 text-right">{crop.scale.toFixed(1)}×</span>
          </div>
        </div>

        {/* Hint & reset */}
        <div className="w-full flex items-center justify-between px-1">
          <p className="text-[10px] text-gray-400">Drag untuk geser · Scroll/pinch untuk zoom</p>
          <button onClick={handleReset} className="text-[10px] text-gray-400 hover:text-gray-600 underline">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhotoCropEditor;
