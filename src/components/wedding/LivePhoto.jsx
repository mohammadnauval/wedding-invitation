import React, { useState, useEffect } from 'react';

/**
 * LivePhoto
 * Renders one or more photos (cycling) clipped to a circle.
 *
 * Clipping is done HERE (not in the parent) so that transformed <img> children
 * are correctly clipped. Using overflow:hidden + border-radius + isolation on
 * the same element that contains the transforms avoids browser stacking-context
 * bugs where a parent's overflow-hidden fails to clip transformed children.
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
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        borderRadius: '50%',
        overflow: 'hidden',
        isolation: 'isolate', // forces new stacking context — fixes overflow-hidden + transform clipping
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
