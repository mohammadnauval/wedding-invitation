import React, { useState, useRef, useEffect } from 'react';

/**
 * PhotoCropEditor — Instagram-style circular crop editor.
 *
 * Stores crop as: { posX, posY, scale }
 *   posX, posY : CSS object-position %, 0–100  (50,50 = center)
 *   scale      : zoom multiplier (1–4)
 *
 * Pan is implemented by tracking pointer delta in px and converting to
 * object-position % using the actual rendered image overflow size.
 * All mutable state used during drag lives in refs — no closure staleness,
 * no re-registering event listeners mid-drag.
 */

const CIRCLE_SIZE = 288;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

function PhotoCropEditor({ src, initialCrop, onSave, onCancel }) {
  // Visible crop state (drives render)
  const [crop, setCrop] = useState({
    posX: initialCrop?.posX ?? 50,
    posY: initialCrop?.posY ?? 50,
    scale: initialCrop?.scale ?? 1,
  });

  // Ref mirrors — always current, no stale closure issues
  const cropRef = useRef(crop);
  const imgNatural = useRef({ w: 0, h: 0 });
  const dragging = useRef(false);
  const dragOrigin = useRef({ px: 0, py: 0, mx: 0, my: 0 }); // pointer start + crop start
  const pinchOrigin = useRef({ dist: 0, scale: 1 });
  const containerRef = useRef(null);

  // Keep cropRef in sync
  const updateCrop = (next) => {
    cropRef.current = next;
    setCrop(next);
  };

  // Load natural image size once
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => { imgNatural.current = { w: img.naturalWidth, h: img.naturalHeight }; };
    img.src = src;
  }, [src]);

  /**
   * Convert a pixel drag delta to an object-position % delta.
   *
   * object-cover renders the image so one dimension = CIRCLE_SIZE and the
   * other = CIRCLE_SIZE * aspect (overflowing). With scale s applied on top,
   * the effective rendered size is CIRCLE_SIZE*s × CIRCLE_SIZE*s*aspect.
   *
   * The pannable range (px) in each axis:
   *   overflowX = max(0, renderedW - CIRCLE_SIZE)
   *   overflowY = max(0, renderedH - CIRCLE_SIZE)
   *
   * 100% of object-position maps across that overflow range.
   * So: Δ% = (Δpx / overflow) * 100
   *
   * If overflow = 0 (square image or zoom is 1 in that axis) → no panning.
   */
  const pxToPct = (dxPx, dyPx, scale) => {
    const { w, h } = imgNatural.current;
    let renderedW, renderedH;
    if (w > 0 && h > 0) {
      const ar = w / h;
      if (ar >= 1) {
        renderedH = CIRCLE_SIZE * scale;
        renderedW = renderedH * ar;
      } else {
        renderedW = CIRCLE_SIZE * scale;
        renderedH = renderedW / ar;
      }
    } else {
      renderedW = CIRCLE_SIZE * scale;
      renderedH = CIRCLE_SIZE * scale;
    }
    const overflowX = Math.max(1, renderedW - CIRCLE_SIZE);
    const overflowY = Math.max(1, renderedH - CIRCLE_SIZE);
    return {
      dx: (dxPx / overflowX) * 100,
      dy: (dyPx / overflowY) * 100,
    };
  };

  // ── Pointer events (mouse + touch single-finger) ────────────────────────────
  const startDrag = (clientX, clientY) => {
    dragging.current = true;
    dragOrigin.current = {
      mx: clientX,
      my: clientY,
      px: cropRef.current.posX,
      py: cropRef.current.posY,
    };
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragging.current) return;
    const dxPx = clientX - dragOrigin.current.mx;
    const dyPx = clientY - dragOrigin.current.my;
    const { dx, dy } = pxToPct(dxPx, dyPx, cropRef.current.scale);
    // Dragging right → pan left → posX decreases
    const posX = Math.min(100, Math.max(0, dragOrigin.current.px - dx));
    const posY = Math.min(100, Math.max(0, dragOrigin.current.py - dy));
    updateCrop({ ...cropRef.current, posX, posY });
  };

  const endDrag = () => { dragging.current = false; };

  // ── Mouse ───────────────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  useEffect(() => {
    const onMove = (e) => moveDrag(e.clientX, e.clientY);
    const onUp = () => endDrag();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  // Intentionally empty deps — handlers always read from refs, never stale
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Touch ───────────────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      dragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchOrigin.current = {
        dist: Math.hypot(dx, dy),
        scale: cropRef.current.scale,
      };
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / (pinchOrigin.current.dist || dist);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchOrigin.current.scale * ratio));
      updateCrop({ ...cropRef.current, scale: newScale });
    }
  };

  const onTouchEnd = () => { dragging.current = false; };

  // ── Scroll zoom ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, cropRef.current.scale + delta));
      updateCrop({ ...cropRef.current, scale: newScale });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleSave = () => onSave(cropRef.current);
  const handleReset = () => updateCrop({ posX: 50, posY: 50, scale: 1 });

  const objectPos = `${crop.posX.toFixed(2)}% ${crop.posY.toFixed(2)}%`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-6 gap-5 w-[360px] max-w-[95vw]">

        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-800">Batal</button>
          <span className="text-sm font-medium text-gray-800">Sesuaikan foto</span>
          <button onClick={handleSave} className="text-sm font-semibold text-[var(--color-primary)] hover:opacity-80">
            Simpan
          </button>
        </div>

        {/* Circle crop */}
        <div
          ref={containerRef}
          className="select-none flex-shrink-0"
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#e5e7eb',
            cursor: 'grab',
            boxShadow: '0 0 0 4px rgba(180,60,100,0.25), 0 4px 20px rgba(0,0,0,0.2)',
            position: 'relative',
            touchAction: 'none',
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Scale wrapper */}
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${crop.scale})`,
              transformOrigin: objectPos,
              willChange: 'transform',
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
                willChange: 'object-position',
              }}
              draggable={false}
            />
          </div>

          {/* Rule-of-thirds grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),' +
                'linear-gradient(90deg,rgba(255,255,255,0.18) 1px,transparent 1px)',
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
              min={MIN_SCALE}
              max={MAX_SCALE}
              step="0.01"
              value={crop.scale}
              onChange={(e) => updateCrop({ ...cropRef.current, scale: parseFloat(e.target.value) })}
              className="flex-1 h-1.5 accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8 text-right">{crop.scale.toFixed(1)}×</span>
          </div>
        </div>

        {/* Hint & reset */}
        <div className="w-full flex items-center justify-between px-1">
          <p className="text-[10px] text-gray-400">Drag untuk geser · Scroll/pinch untuk zoom</p>
          <button onClick={handleReset} className="text-[10px] text-gray-400 hover:text-gray-600 underline">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default PhotoCropEditor;
