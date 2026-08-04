import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * PhotoCropEditor — Instagram-style circular crop editor.
 *
 * Rendering model (identical to LivePhoto):
 *   - The <img> fills the circle with object-cover (scale=1, no pan = default view)
 *   - transform: translate(x,y) scale(s) is applied on top
 *   - transformOrigin: center center
 *
 * This means the saved {x, y, scale} produces the EXACT same result in
 * LivePhoto as what you see here in the editor.
 *
 * Clamp logic keeps the image covering the circle at all times.
 */

const CIRCLE_SIZE = 288; // px — editor circle diameter

function PhotoCropEditor({ src, initialCrop, onSave, onCancel }) {
  const [crop, setCrop] = useState(() => ({
    x: initialCrop?.x ?? 0,
    y: initialCrop?.y ?? 0,
    scale: initialCrop?.scale ?? 1,
  }));

  // Natural image dimensions — needed for clamp
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  /**
   * Clamp translate so the image (after object-cover + scale) always covers
   * the full CIRCLE_SIZE circle.
   *
   * At scale=1, object-cover makes the image fill CIRCLE_SIZE in both axes
   * (the shorter dimension of the natural image fits exactly, the other overflows).
   * After applying scale(s), the rendered size is CIRCLE_SIZE*s in each axis.
   * The max translate in each axis before an edge enters the circle:
   *   maxT = (CIRCLE_SIZE * s - CIRCLE_SIZE) / 2 = CIRCLE_SIZE * (s - 1) / 2
   */
  const clamp = useCallback((nextCrop) => {
    const s = nextCrop.scale;
    const maxT = (CIRCLE_SIZE * (s - 1)) / 2;
    return {
      ...nextCrop,
      x: Math.min(maxT, Math.max(-maxT, nextCrop.x)),
      y: Math.min(maxT, Math.max(-maxT, nextCrop.y)),
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
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setCrop(prev => clamp({ ...prev, x: dragStart.current.cx + dx, y: dragStart.current.cy + dy }));
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
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;
      setCrop(prev => clamp({ ...prev, x: touchRef.current.cx + dx, y: touchRef.current.cy + dy }));
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

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const handleSave = () => onSave(crop);
  const handleReset = () => setCrop({ x: 0, y: 0, scale: 1 });

  // Image style — MUST match LivePhoto's getCropStyle exactly
  const imgStyle = {
    transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.scale})`,
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

        {/* Circle crop area — uses object-cover, identical to LivePhoto */}
        <div
          ref={containerRef}
          className="relative rounded-full overflow-hidden border-4 border-[var(--color-primary)]/40 shadow-lg select-none"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, background: '#f0f0f0' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Photo — object-cover fills the circle, transform pans/zooms */}
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
