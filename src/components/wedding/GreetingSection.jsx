import React from 'react';
import useInView from '../../hooks/useInView';
import { FloralCorner, LeafBranch } from './FloralOrnament';

function GreetingSection({ weddingData }) {
  const [ref, inView] = useInView();

  const greeting = weddingData?.content?.greeting || {
    opening: 'Bismillahirrahmanirrahim',
    quote: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
    closing: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.',
  };

  return (
    <section ref={ref} className="relative py-16 bg-[var(--color-bg-soft)] overflow-hidden">
      {/* Floral corners */}
      <FloralCorner className="absolute top-2 left-2" size={70} />
      <FloralCorner className="absolute top-2 right-2 -scale-x-100" size={70} />
      <FloralCorner className="absolute bottom-2 left-2 -scale-y-100" size={70} />
      <FloralCorner className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100" size={70} />

      {/* Leaf branches on sides */}
      <LeafBranch className="absolute top-1/3 -left-4 opacity-60" />
      <LeafBranch className="absolute bottom-1/3 -right-4 opacity-60" flip />

      <div className={`section-container relative z-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-center font-couple text-2xl text-[var(--color-primary)] mb-8">
          {greeting.opening}
        </p>

        {/* Quote card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[var(--color-primary-light)]/20">
          <blockquote className="text-center text-sm leading-relaxed text-[var(--color-text-muted)] italic">
            "{greeting.quote}"
          </blockquote>

          <p className="text-center text-xs font-bold tracking-wider text-[var(--color-primary)] mt-4 uppercase">
            — {greeting.source}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-[2px] bg-[var(--color-primary-light)]" />
          <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--color-primary)" opacity="0.5">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
          <div className="w-8 h-[2px] bg-[var(--color-primary-light)]" />
        </div>

        <p className="text-center text-sm leading-relaxed text-[var(--color-text-muted)]">
          {greeting.closing}
        </p>
      </div>
    </section>
  );
}

export default GreetingSection;
