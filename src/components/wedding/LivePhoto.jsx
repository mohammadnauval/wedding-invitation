import React, { useState, useEffect } from 'react';

/**
 * LivePhoto
 * Displays a photo (or cycling live photos) inside a fixed container.
 * cropSettings: array of { x, y, scale } — one per photo, index-matched.
 * Falls back to objectPosition (legacy) if cropSettings not provided.
 */
function LivePhoto({ photos = [], alt = '', className = '', objectPosition = 'center', cropSettings = [] }) {
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
    if (c && typeof c === 'object' && (c.scale > 1.01 || Math.abs(c.x) > 0.5 || Math.abs(c.y) > 0.5)) {
      return {
        objectPosition: 'center',
        transform: `translate(${c.x}px, ${c.y}px) scale(${c.scale})`,
        transformOrigin: 'center center',
      };
    }
    // Legacy fallback
    return { objectPosition };
  };

  return (
    <div className={`relative ${className}`}>
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
