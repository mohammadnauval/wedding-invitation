import React, { useState, useEffect } from 'react';

/**
 * LivePhoto
 * Renders one or more photos (cycling) inside its parent container.
 *
 * Rendering model — IDENTICAL to PhotoCropEditor:
 *   base layer : object-cover fills the container (w-full h-full)
 *   crop layer : transform translate(x,y) scale(s) with transformOrigin center
 *
 * The parent in CoupleSection already has `rounded-full overflow-hidden`,
 * so clipping to circle is handled there — LivePhoto just fills it.
 */
function LivePhoto({ photos = [], alt = '', className = '', cropSettings = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
    const x = c?.x ?? 0;
    const y = c?.y ?? 0;
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: 'center center',
    };
  };

  return (
    // This div fills the parent (w-32 h-32 rounded-full overflow-hidden in CoupleSection).
    // `relative` + explicit size so absolute children position correctly.
    <div className={`relative w-full h-full ${className}`}>
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
