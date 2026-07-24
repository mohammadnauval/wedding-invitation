import React from 'react';
import useInView from '../../hooks/useInView';

function CoupleSection({ weddingData }) {
  const [ref, inView] = useInView();

  const groom = weddingData?.couple?.groom || {};
  const bride = weddingData?.couple?.bride || {};

  return (
    <section id="couple" ref={ref} className="py-16 bg-white">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Bride & Groom</h2>
        <p className="section-subtitle">Insya Allah yang berbahagia</p>

        {/* Groom */}
        <div className="text-center mb-12">
          <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[var(--color-border)]">
            <img
              src={groom.photo || '/uploads/groom-default.jpg'}
              alt={groom.full_name || 'Groom'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="font-script text-3xl text-[var(--color-primary)] mb-2">
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
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] mt-2 hover:underline"
            >
              @{groom.instagram}
            </a>
          )}
        </div>

        {/* Ampersand */}
        <div className="text-center mb-12">
          <span className="font-script text-4xl text-[var(--color-primary-light)]">&</span>
        </div>

        {/* Bride */}
        <div className="text-center">
          <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[var(--color-border)]">
            <img
              src={bride.photo || '/uploads/bride-default.jpg'}
              alt={bride.full_name || 'Bride'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="font-script text-3xl text-[var(--color-primary)] mb-2">
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
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] mt-2 hover:underline"
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
