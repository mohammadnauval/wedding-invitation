import React from 'react';
import useInView from '../../hooks/useInView';

function CoupleSection({ weddingData }) {
  const [ref, inView] = useInView();

  const groom = weddingData?.couple?.groom || {};
  const bride = weddingData?.couple?.bride || {};

  return (
    <section id="couple" ref={ref} className="py-16 bg-[var(--color-bg)]">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">The Couple</h2>
        <p className="section-subtitle">Two hearts, one love story</p>

        {/* Groom */}
        <div className="text-center mb-12">
          <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[var(--color-primary-light)]/30 shadow-lg shadow-[var(--color-primary)]/10">
            <img
              src={groom.photo || '/uploads/groom-default.jpg'}
              alt={groom.full_name || 'Groom'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="font-couple text-4xl text-[var(--color-primary)] mb-1">
            {groom.nickname || 'Groom'}
          </h3>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {groom.full_name || ''}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Putra dari Bapak {groom.father_name || '-'} & Ibu {groom.mother_name || '-'}
          </p>
          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] mt-2 hover:underline font-semibold"
            >
              @{groom.instagram}
            </a>
          )}
        </div>

        {/* Heart divider */}
        <div className="text-center mb-12">
          <svg width="40" height="36" viewBox="0 0 20 20" fill="var(--color-primary)" className="mx-auto opacity-60">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>

        {/* Bride */}
        <div className="text-center">
          <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[var(--color-primary-light)]/30 shadow-lg shadow-[var(--color-primary)]/10">
            <img
              src={bride.photo || '/uploads/bride-default.jpg'}
              alt={bride.full_name || 'Bride'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="font-couple text-4xl text-[var(--color-primary)] mb-1">
            {bride.nickname || 'Bride'}
          </h3>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {bride.full_name || ''}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Putri dari Bapak {bride.father_name || '-'} & Ibu {bride.mother_name || '-'}
          </p>
          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] mt-2 hover:underline font-semibold"
            >
              @{bride.instagram}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default CoupleSection;
