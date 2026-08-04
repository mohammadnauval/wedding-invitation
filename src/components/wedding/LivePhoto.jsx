import React, { useState, useEffect } from 'react';

function LivePhoto({ photos = [], alt = '', className = '', objectPosition = 'center' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % photos.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) return null;

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
          style={{ objectPosition }}
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default LivePhoto;
