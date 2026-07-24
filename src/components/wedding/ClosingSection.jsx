import React from 'react';
import useInView from '../../hooks/useInView';

function ClosingSection({ weddingData }) {
  const [ref, inView] = useInView();

  const coupleName = weddingData?.couple
    ? `${weddingData.couple.groom?.nickname || ''} & ${weddingData.couple.bride?.nickname || ''}`
    : '';

  const closingText = weddingData?.content?.closing ||
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.';

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className={`section-container text-center ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-xs tracking-wider text-[var(--color-text-muted)] mb-6 leading-relaxed">
          {closingText}
        </p>

        <div className="w-12 h-px bg-[var(--color-border)] mx-auto mb-6" />

        <p className="text-xs tracking-wider text-[var(--color-text-muted)] mb-2">
          Wassalamu'alaikum Wr. Wb.
        </p>

        <p className="font-script text-3xl text-[var(--color-primary)] mt-6">
          {coupleName}
        </p>

        <p className="text-[10px] text-[var(--color-text-light)] mt-12">
          Made with ♥
        </p>
      </div>
    </section>
  );
}

export default ClosingSection;
