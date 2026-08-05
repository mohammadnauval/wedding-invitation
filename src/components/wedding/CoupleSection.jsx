import React from 'react';
import useInView from '../../hooks/useInView';
import LivePhoto from './LivePhoto';

function CoupleSection({ weddingData }) {
  const [ref, inView] = useInView();

  const groom = weddingData?.couple?.groom || {};
  const bride = weddingData?.couple?.bride || {};

  const getPhotos = (person, defaultPhotos) => {
    try {
      const parsed = JSON.parse(person.photos || '[]');
      if (parsed.length > 0) return parsed;
    } catch (e) {}
    return person.photo ? [person.photo] : defaultPhotos;
  };

  const parseCropSettings = (person) => {
    try {
      const parsed = JSON.parse(person.photo_focuses || '[]');
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  };

  const bridePhotos = getPhotos(bride, ['/images/couple/bride/bride_1.JPEG', '/images/couple/bride/bride_2.JPEG']);
  const groomPhotos = getPhotos(groom, ['/images/couple/groom/groom_1.JPEG', '/images/couple/groom/groom_2.JPEG']);

  const brideCropSettings = parseCropSettings(bride);
  const groomCropSettings = parseCropSettings(groom);

  return (
    <section id="couple" ref={ref} className="relative pt-16 pb-10 overflow-hidden bg-[var(--color-bg)]">
      {/* Background border */}
      <div className="absolute inset-0">
        <img src="/images/background_border_fix.png" alt="" className="w-full h-full object-fill" />
      </div>

      <img src="/images/rings_illustration.png" alt="" className="absolute top-52 left-0 w-44 opacity-70 z-10" />

      <div className={`section-container relative z-10 pt-52 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">The Couple</h2>
        <p className="section-subtitle font-bold drop-shadow-sm">Two hearts, one love story</p>

        <div className="space-y-5">
          {/* Bride - left aligned */}
          <div className="py-2">
            <div className="flex items-center gap-4 ml-4">
              {/* ring wrapper */}
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden ring-3 ring-[var(--color-primary)]/20 ring-offset-2 ring-offset-[var(--color-bg-soft)]">
                <LivePhoto
                  photos={bridePhotos}
                  alt={bride.full_name || 'Bride'}
                  cropSettings={brideCropSettings}
                />
              </div>              <div className="text-left flex-1">
                <h3 className="font-couple text-3xl text-[var(--color-primary)] leading-tight">
                  {bride.nickname || 'Bride'}
                </h3>
                <p className="text-xs font-medium text-[var(--color-text)] mt-0.5">
                  {bride.full_name || ''}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1 leading-relaxed">
                  {bride.child_order ? `Putri ${bride.child_order} dari` : 'Putri dari'}<br/>Bapak {bride.father_name || '-'} & Ibu {bride.mother_name || '-'}
                </p>
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
            <div className="flex items-center gap-4 flex-row-reverse mr-4">
              {/* ring wrapper */}
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden ring-3 ring-[var(--color-primary)]/20 ring-offset-2 ring-offset-[var(--color-bg-soft)]">
                <LivePhoto
                  photos={groomPhotos}
                  alt={groom.full_name || 'Groom'}
                  cropSettings={groomCropSettings}
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
                  {groom.child_order ? `Putra ${groom.child_order} dari` : 'Putra dari'}<br/>Bapak {groom.father_name || '-'} & Ibu {groom.mother_name || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoupleSection;
