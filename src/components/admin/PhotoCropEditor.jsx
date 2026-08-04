import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * PhotoCropEditor — Instagram-style circular crop editor.
 *
 * Stores crop as: { posX, posY, scale }
 *   posX, posY : CSS object-position percentage, 0–100
 *                (50,50 = center, 0,0 = top-left, 100,100 = bottom-right)
 *   scale      : zoom multiplier applied via transform:scale() on a wrapper div
 *
 * Rendering in the editor and in LivePhoto is identical:
 *   <div style="overflow:hidden; border-radius:50%">
 *     <div style="width:100%; height:100%; transform:scale(s); transform-origin: posX% posY%">
 *       <img style="width:100%; height:100%; object-cover; object-position: posX% posY%" />
 *     </div>
 *   </div>
 *
 * Panning works by adjusting posX/posY (which shifts object-position focus point).
 * Zooming works by adjusting scale (which enlarges around the focus point).
 */

const CIRCLE_SIZE = 288; // px — editor circle display size

function PhotoCropEditor({ src, initialCrop, onSave, onCancel }) {
  const [crop, setCrop] = useState(() => ({
    posX: initialCrop?.posX ?? 50,
    posY: initialCrop?.posY ?? 50,
    scale: initialCrop?.scale ?? 1,
  }));

  const [dragging, setDragging] = useState(false);
  const [imgNatural, setImgNatural] = useState({ w: 1, h: 1 });
  const dragStart = useRef({ mx: 0, my: 0, px: 50, py: 50 });
  const containerRef = useRef(null);

  // Get natural image dimensions to compute correct pan sensitivity
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  /**
   * How much does object-position need to change per pixel of drag?
   *
   * At scale=1, object-cover renders the image so the shorter dimension fills
   * the container exactly, and the longer dimension overflows.
   * The "pannable" range in the overflow dimension:
   *   renderedW = CIRCLE_SIZE * (imgW / imgH)  if landscape
   *   renderedH = CIRCLE_SIZE * (imgH / imgW)  if portrait
   * pannable pixels in X = max(0, renderedW - CIRCLE_SIZE) * scale
   * 100% of object-position maps to that pannable range.
   * So: pct per pixel = 100 / pannable_pixels
   */
  const getPanSensitivity = useCallback((s) => {
    const { w, h } = imgNatural;
    if (w === 0 || h === 0) return { x: 0.3, y: 0.3 };
    const aspectRatio = w / h;
    let renderedW, renderedH;
    if (aspectRatio >= 1) {
      // Landscape: height fits, width overflows
      renderedH = CIRCLE_SIZE;
      renderedW = CIRCLE_SIZE * aspectRatio;
    } else {
      // Portrait: width fits, height overflows
      renderedW = CIRCLE_SIZE;
      renderedH = CIRCLE_SIZE / aspectRatio;
    }
    const pannableX = Math.max(1, (renderedW - CIRCLE_SIZE) * s);
    const pannableY = Math.max(1, (renderedH - CIRCLE_SIZE) * s);
    return {
      x: 100 / pannableX,
      y: 100 / pannableY,
    };
  }, [imgNatural]);

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: crop.posX, py: crop.posY };
  };

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    const sens = getPanSensitivity(crop.scale);
    // Dragging right moves viewport left → decrease posX
    const newX = Math.min(100, Math.max(0, dragStart.current.px - dx * sens.x));
    const newY = Math.min(100, Math.max(0, dragStart.current.py - dy * sens.y));
    setCrop(prev => ({ ...prev, posX: newX, posY: newY }));
  }, [dragging, getPanSensitivity, crop.scale]);

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
  const touchRef = useRef({ x: 0, y: 0, dist: 0, px: 50, py: 50, cs: 1 });

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchRef.current = {
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        px: crop.posX, py: crop.posY, cs: crop.scale, dist: 0,
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
      const sens = getPanSensitivity(crop.scale);
      const newX = Math.min(100, Math.max(0, touchRef.current.px - dx * sens.x));
      const newY = Math.min(100, Math.max(0, touchRef.current.py - dy * sens.y));
      setCrop(prev => ({ ...prev, posX: newX, posY: newY }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / (touchRef.current.dist || dist);
      const newScale = Math.min(4, Math.max(1, touchRef.current.cs * ratio));
      setCrop(prev => ({ ...prev, scale: newScale }));
    }
  };

  const onTouchEnd = () => setDragging(false);

  // ── Scroll to zoom ──────────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setCrop(prev => ({ ...prev, scale: Math.min(4, Math.max(1, prev.scale + delta)) }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const handleSave = () => onSave(crop);
  const handleReset = () => setCrop({ posX: 50, posY: 50, scale: 1 });

  // Render using the same model as LivePhoto
  const objectPos = `${crop.posX.toFixed(1)}% ${crop.posY.toFixed(1)}%`;

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

        {/* Circle crop — EXACT same rendering as LivePhoto */}
        <div
          ref={containerRef}
          className="relative select-none flex-shrink-0"
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#e5e7eb',
            cursor: dragging ? 'grabbing' : 'grab',
            boxShadow: '0 0 0 4px rgba(180,60,100,0.25), 0 4px 20px rgba(0,0,0,0.2)',
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Scale wrapper — zoom around the focus point */}
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${crop.scale})`,
              transformOrigin: objectPos,
            }}
          >
            <img
              src={src}
              alt="Crop"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: objectPos,
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
              draggable={false}
            />
          </div>

          {/* Rule-of-thirds grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), ' +
                'linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
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
              onChange={(e) => setCrop(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
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
