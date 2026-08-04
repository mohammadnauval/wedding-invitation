import React, { useState, useEffect } from 'react';

/**
 * LivePhoto
 *
 * Renders one or more cycling photos clipped to a circle.
 *
 * cropSettings[i] = { posX, posY, scale }
 *   posX, posY : CSS object-position % (0–100), default 50
 *   scale      : zoom multiplier (1 = no zoom), default 1
 *
 * Rendering model (IDENTICAL to PhotoCropEditor):
 *   outer div  : overflow:hidden, border-radius:50%  (circle clip)
 *   scale div  : transform:scale(s), transformOrigin: posX% posY%
 *   img        : object-cover, objectPosition: posX% posY%
 *
 * This approach uses only native CSS — no px math, no ResizeObserver,
 * no stacking context hacks. Works correctly at any container size.
 */
function LivePhoto({ photos = [], alt = '', cropSettings = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % photos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const getObjectPos = (index) => {
    const c = cropSettings[index];
    const x = c?.posX ?? 50;
    const y = c?.posY ?? 50;
    return `${x}% ${y}%`;
  };

  const getScale = (index) => {
    return cropSettings[index]?.scale ?? 1;
  };

  return (
    // Outer: fills parent, clips to circle
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      {photos.map((photo, index) => {
        const objPos = getObjectPos(index);
        const scale = getScale(index);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            {/* Scale wrapper — zoom around focus point */}
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale})`,
                transformOrigin: objPos,
              }}
            >
              <img
                src={photo}
                alt={alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: objPos,
                  display: 'block',
                }}
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LivePhoto;
