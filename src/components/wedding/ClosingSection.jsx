import React from 'react';
import useInView from '../../hooks/useInView';
import { FloralCorner, LeafBranch } from './FloralOrnament';

function ClosingSection({ weddingData }) {
  const [ref, inView] = useInView();

  const groomName = weddingData?.couple?.groom?.nickname || '';
  const brideName = weddingData?.couple?.bride?.nickname || '';

  const closingText = weddingData?.content?.closing ||
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.';

  return (
    <section ref={ref} className="relative py-20 bg-[var(--color-bg)] overflow-hidden">
      {/* Floral decorations */}
      <FloralCorner className="absolute top-4 left-2" size={60} />
      <FloralCorner className="absolute top-4 right-2 -scale-x-100" size={60} />
      <LeafBranch className="absolute bottom-8 -left-6 opacity-50 rotate-6" />
      <LeafBranch className="absolute bottom-8 -right-6 opacity-50 -rotate-6" flip />

      <div className={`section-container relative z-10 text-center ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)] mb-8">
          {closingText}
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-[2px] bg-[var(--color-primary-light)]" />
          <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--color-primary)" opacity="0.5">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
          <div className="w-8 h-[2px] bg-[var(--color-primary-light)]" />
        </div>

        <p className="text-xs tracking-wider text-[var(--color-text-muted)] mb-2">
          Wassalamu'alaikum Wr. Wb.
        </p>

        <p className="font-couple text-4xl text-[var(--color-primary)] mt-6">
          {brideName} & {groomName}
        </p>

        <p className="text-[10px] text-[var(--color-text-light)] mt-16 font-bold tracking-widest uppercase">
          Made with ♥
        </p>
      </div>
    </section>
  );
}

export default ClosingSection;
