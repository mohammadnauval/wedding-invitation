import React from 'react';
import useInView from '../../hooks/useInView';

function GreetingSection({ weddingData }) {
  const [ref, inView] = useInView();

  const greeting = weddingData?.content?.greeting || {
    opening: 'Bismillahirrahmanirrahim',
    quote: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
    closing: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.',
  };

  return (
    <section id="greeting" ref={ref} className="relative py-16 bg-[var(--color-bg-soft)] overflow-hidden">
      {/* Background border */}
      <div className="absolute inset-0">
        <img src="/images/background_border_fix.png" alt="" className="w-full h-full object-fill" />
      </div>

      <div className={`section-container relative z-10 pt-40 pb-8 px-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-center font-couple text-2xl text-[var(--color-primary)] mb-8 font-bold drop-shadow-sm">
          {greeting.opening}
        </p>

        {/* Quote card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 mb-5 border border-[var(--color-primary-light)]/20">
          <blockquote className="text-center text-xs leading-relaxed text-[var(--color-text-muted)] italic">
            "{greeting.quote}"
          </blockquote>

          <p className="text-center text-[10px] font-bold tracking-wider text-[var(--color-primary)] mt-3 uppercase">
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

        <p className="text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
          {greeting.closing}
        </p>
      </div>
    </section>
  );
}

export default GreetingSection;
