import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * PhotoCropEditor
 * Instagram-style circular crop editor.
 * - Drag to pan the photo inside the circle
 * - Scroll / pinch to zoom
 * - Returns { x, y, scale } where x,y are translate offsets in px relative to center
 */

const CIRCLE_SIZE = 288; // px — display size of the crop circle in the editor

function PhotoCropEditor({ src, initialCrop, onSave, onCancel }) {
  // crop state: translate (x,y) in px from the natural center, scale
  const [crop, setCrop] = useState(() => {
    if (initialCrop && typeof initialCrop === 'object') {
      return { x: initialCrop.x || 0, y: initialCrop.y || 0, scale: initialCrop.scale || 1 };
    }
    return { x: 0, y: 0, scale: 1 };
  });

  const [imgSize, setImgSize] = useState({ w: 0, h: 0 }); // natural size of the image
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Load image to get natural dimensions
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  // Clamp translate so the image always covers the circle
  const clamp = useCallback((nextCrop) => {
    if (imgSize.w === 0 || imgSize.h === 0) return nextCrop;

    const scale = nextCrop.scale;
    // Rendered size of the image inside the editor
    const renderedW = (imgSize.w / imgSize.h) * CIRCLE_SIZE * scale;
    const renderedH = CIRCLE_SIZE * scale;

    // Max allowed offset (so edge doesn't enter the circle)
    const maxX = Math.max(0, (renderedW - CIRCLE_SIZE) / 2);
    const maxY = Math.max(0, (renderedH - CIRCLE_SIZE) / 2);

    return {
      ...nextCrop,
      x: Math.min(maxX, Math.max(-maxX, nextCrop.x)),
      y: Math.min(maxY, Math.max(-maxY, nextCrop.y)),
    };
  }, [imgSize]);

  // Mouse drag
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

  const onMouseUp = () => setDragging(false);

  // Touch drag
  const touchRef = useRef({ x: 0, y: 0, dist: 0, cx: 0, cy: 0, cs: 1 });

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, cx: crop.x, cy: crop.y, cs: crop.scale, dist: 0 };
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

  // Scroll to zoom
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setCrop(prev => clamp({ ...prev, scale: Math.min(4, Math.max(1, prev.scale + delta)) }));
  };

  // Attach wheel with non-passive to allow preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clamp]);

  // Global mouse move/up for smooth drag outside element
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove]);

  const handleSave = () => onSave(crop);
  const handleReset = () => setCrop(clamp({ x: 0, y: 0, scale: 1 }));

  // Image style inside the circle
  const imgStyle = {
    transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.scale})`,
    transformOrigin: 'center center',
    cursor: dragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    // fit the image to cover the circle at scale=1
    width: imgSize.h > 0 ? `${(imgSize.w / imgSize.h) * 100}%` : '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    flexShrink: 0,
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
          className="relative overflow-hidden rounded-full border-4 border-[var(--color-primary)]/40 shadow-lg select-none"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, background: '#f0f0f0' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* The photo */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              ref={imgRef}
              src={src}
              alt="Crop"
              style={imgStyle}
              draggable={false}
            />
          </div>

          {/* Grid overlay (rule of thirds) */}
          <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '50%', overflow: 'hidden' }}>
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '33.33% 33.33%',
            }} />
          </div>
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
              onChange={(e) => {
                const newScale = parseFloat(e.target.value);
                setCrop(prev => clamp({ ...prev, scale: newScale }));
              }}
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
