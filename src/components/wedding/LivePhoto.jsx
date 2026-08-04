import React, { useState, useEffect, useRef } from 'react';

/**
 * LivePhoto
 *
 * Crop values (x, y) are stored as % of container size — NOT pixels.
 * At render: translatePx = (x / 100) * containerSizePx
 * This keeps the crop visually identical regardless of container size
 * (editor=288px vs invitation=128px).
 *
 * Clipping: uses clip-path:circle() which is more reliable than
 * overflow:hidden + border-radius when child elements have transforms.
 */
function LivePhoto({ photos = [], alt = '', className = '', cropSettings = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState(128); // default w-32

  // Measure actual container size on mount and resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      // Use the smaller dimension to be safe
      setContainerSize(Math.min(rect.width, rect.height) || 128);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % photos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const getCropStyle = (index) => {
    const c = cropSettings[index];
    const scale = c?.scale ?? 1;
    // Convert % → px using actual container size
    const xPx = ((c?.x ?? 0) / 100) * containerSize;
    const yPx = ((c?.y ?? 0) / 100) * containerSize;
    return {
      transform: `translate(${xPx}px, ${yPx}px) scale(${scale})`,
      transformOrigin: 'center center',
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{
        // clip-path:circle clips correctly even when children have transforms,
        // unlike overflow:hidden + border-radius which can fail with transforms.
        clipPath: 'circle(50% at center)',
        WebkitClipPath: 'circle(50% at center)',
      }}
    >
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={getCropStyle(index)}
          loading="lazy"
          draggable={false}
        />
      ))}
    </div>
  );
}

export default LivePhoto;
