import React, { useState } from 'react';
import useInView from '../../hooks/useInView';

function GallerySection({ weddingData }) {
  const [ref, inView] = useInView();
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const gallery = weddingData?.gallery || [];

  if (gallery.length === 0) return null;

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <section id="gallery" ref={ref} className="py-16 bg-[var(--color-bg)]">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Gallery</h2>
        <p className="section-subtitle">Momen Berharga Kami</p>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2">
          {gallery.map((photo, index) => (
            <div
              key={photo.id || index}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.thumbnail_url || photo.image_url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white text-2xl w-10 h-10 flex items-center justify-center"
            aria-label="Previous"
          >
            ‹
          </button>

          <img
            src={gallery[lightboxIndex]?.image_url}
            alt={`Gallery ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white text-2xl w-10 h-10 flex items-center justify-center"
            aria-label="Next"
          >
            ›
          </button>

          <p className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </p>
        </div>
      )}
    </section>
  );
}

export default GallerySection;
