import React, { useState, useEffect, useRef, useCallback } from 'react';
import useInView from '../../hooks/useInView';

function GallerySection({ weddingData }) {
  const [ref, inView] = useInView();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const gallery = weddingData?.gallery || [];

  if (gallery.length === 0) return null;

  const total = gallery.length;

  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);

  // Auto-advance every 3.5s unless paused
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [paused, next, total]);

  // Touch swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section id="gallery" ref={ref} className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/images/background_gallery.png" alt="" className="w-full h-full object-cover" />
      </div>

      <div className={`section-container relative z-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Gallery</h2>
        <p className="section-subtitle">Momen Berharga Kami</p>

        {/* Slideshow */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-lg select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Slides — stack all, only current is visible */}
          {gallery.map((photo, index) => (
            <div
              key={photo.id || index}
              className="transition-opacity duration-700"
              style={{
                opacity: index === current ? 1 : 0,
                // Non-active slides are absolutely positioned so they don't affect layout
                position: index === current ? 'relative' : 'absolute',
                inset: 0,
                pointerEvents: index === current ? 'auto' : 'none',
              }}
            >
              <img
                src={photo.image_url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-auto block rounded-2xl"
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 right-3 z-10 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
            {current + 1} / {total}
          </div>
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className="rounded-full transition-all"
                style={{
                  width: index === current ? '20px' : '6px',
                  height: '6px',
                  background: index === current ? 'var(--color-primary)' : 'var(--color-primary)',
                  opacity: index === current ? 1 : 0.3,
                }}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GallerySection;
