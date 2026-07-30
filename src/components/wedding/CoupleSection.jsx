import React from 'react';
import useInView from '../../hooks/useInView';
import { LeafBranch, FloralCorner, SmallFlower } from './FloralOrnament';

function CoupleSection({ weddingData }) {
  const [ref, inView] = useInView();

  const groom = weddingData?.couple?.groom || {};
  const bride = weddingData?.couple?.bride || {};

  return (
    <section id="couple" ref={ref} className="relative py-16 overflow-hidden bg-[var(--color-bg)]">
      {/* Background border */}
      <div className="absolute inset-0">
        <img src="/images/background_border_fix.png" alt="" className="w-full h-full object-fill" />
      </div>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }} />

      {/* Floral decorations */}
      <img src="/images/rings_illustration.png" alt="" className="absolute top-16 -left-8 w-44 opacity-70 z-10" />
      <FloralCorner className="absolute top-0 left-0" size={90} />
      <FloralCorner className="absolute top-0 right-0 -scale-x-100" size={90} />
      <LeafBranch className="absolute top-1/2 -translate-y-1/2 -left-10 opacity-40 rotate-45" />
      <LeafBranch className="absolute top-1/2 -translate-y-1/2 -right-10 opacity-40 -rotate-45" flip />
      <SmallFlower className="absolute bottom-6 left-1/4 opacity-70" size={20} />
      <SmallFlower className="absolute top-10 right-1/4 opacity-70" size={18} />

      <div className={`section-container relative z-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">The Couple</h2>
        <p className="section-subtitle">Two hearts, one love story</p>

        <div className="space-y-5">
          {/* Bride - left aligned */}
          <div className="py-2">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden ring-3 ring-[var(--color-primary)]/20 ring-offset-2 ring-offset-[var(--color-bg-soft)]">
                <img
                  src={bride.photo || '/uploads/bride-default.jpg'}
                  alt={bride.full_name || 'Bride'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-couple text-3xl text-[var(--color-primary)] leading-tight">
                  {bride.nickname || 'Bride'}
                </h3>
                <p className="text-xs font-medium text-[var(--color-text)] mt-0.5">
                  {bride.full_name || ''}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1 leading-relaxed">
                  {bride.child_order ? `Putri ${bride.child_order} dari` : 'Putri dari'} Bapak {bride.father_name || '-'} & Ibu {bride.mother_name || '-'}
                </p>
                {bride.instagram && (
                  <a
                    href={`https://instagram.com/${bride.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[10px] text-[var(--color-primary)] mt-1.5 hover:underline font-bold tracking-wide"
                  >
                    @{bride.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Ampersand divider */}
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="w-10 h-[1px] bg-[var(--color-primary)]/20" />
            <span className="font-couple text-4xl text-[var(--color-primary)] opacity-60">&</span>
            <div className="w-10 h-[1px] bg-[var(--color-primary)]/20" />
          </div>

          {/* Groom - right aligned */}
          <div className="py-2">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden ring-3 ring-[var(--color-primary)]/20 ring-offset-2 ring-offset-[var(--color-bg-soft)]">
                <img
                  src={groom.photo || '/uploads/groom-default.jpg'}
                  alt={groom.full_name || 'Groom'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="text-right flex-1">
                <h3 className="font-couple text-3xl text-[var(--color-primary)] leading-tight">
                  {groom.nickname || 'Groom'}
                </h3>
                <p className="text-xs font-medium text-[var(--color-text)] mt-0.5">
                  {groom.full_name || ''}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1 leading-relaxed">
                  {groom.child_order ? `Putra ${groom.child_order} dari` : 'Putra dari'} Bapak {groom.father_name || '-'} & Ibu {groom.mother_name || '-'}
                </p>
                {groom.instagram && (
                  <a
                    href={`https://instagram.com/${groom.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[10px] text-[var(--color-primary)] mt-1.5 hover:underline font-bold tracking-wide"
                  >
                    @{groom.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoupleSection;
