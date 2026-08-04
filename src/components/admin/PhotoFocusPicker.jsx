import React, { useState, useRef, useCallback } from 'react';

/**
 * PhotoFocusPicker
 * Drag on the photo to set the object-position (focus point).
 * Shows a circular crop preview at the chosen size (w-32 h-32 = 128px).
 */
function PhotoFocusPicker({ src, value = '50% 50%', onChange }) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Parse current value to percentages
  const parseValue = (val) => {
    const parts = String(val).trim().split(/\s+/);
    const parse = (s) => {
      if (!s) return 50;
      if (s.endsWith('%')) return parseFloat(s);
      const keywords = { left: 0, right: 100, top: 0, bottom: 100, center: 50 };
      return keywords[s] ?? 50;
    };
    return { x: parse(parts[0]), y: parse(parts[1] ?? parts[0]) };
  };

  const pos = parseValue(value);

  const updateFocus = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onChange(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }, [onChange]);

  const handleMouseDown = (e) => {
    setDragging(true);
    updateFocus(e);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    updateFocus(e);
  };

  const handleMouseUp = () => setDragging(false);

  if (!src) return (
    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
      Upload foto terlebih dahulu
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Klik atau drag pada foto untuk menentukan titik fokus. Preview bulat menunjukkan tampilan di undangan.
      </p>

      <div className="flex gap-4 items-start">
        {/* Drag area */}
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 mb-1">Drag untuk pilih fokus</p>
          <div
            ref={containerRef}
            className="relative rounded-lg overflow-hidden cursor-crosshair select-none"
            style={{ paddingTop: '75%' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={(e) => { setDragging(true); updateFocus(e); }}
            onTouchMove={(e) => { if (dragging) updateFocus(e); }}
            onTouchEnd={() => setDragging(false)}
          >
            <img
              src={src}
              alt="Focus picker"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />

            {/* Focus point indicator */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Crosshair */}
              <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
            </div>

            {/* Overlay text */}
            <div className="absolute bottom-1 right-1 text-[9px] text-white bg-black/40 px-1 rounded pointer-events-none">
              {pos.x.toFixed(0)}% {pos.y.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Preview circle (128px = w-32 h-32 as shown in invitation) */}
        <div className="shrink-0">
          <p className="text-[10px] text-gray-400 mb-1">Preview di undangan</p>
          <div
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-primary)]/30 ring-2 ring-[var(--color-primary)]/10"
          >
            <img
              src={src}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ objectPosition: value }}
              draggable={false}
            />
          </div>
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-primary)]/30 ring-2 ring-[var(--color-primary)]/10 mt-2"
          >
            <img
              src={src}
              alt="Preview large"
              className="w-full h-full object-cover"
              style={{ objectPosition: value }}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoFocusPicker;
