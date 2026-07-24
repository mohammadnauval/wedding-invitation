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
    <section ref={ref} className="bg-[var(--color-bg-soft)] py-16">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-center text-sm tracking-wider text-[var(--color-primary)] mb-8">
          {greeting.opening}
        </p>

        <blockquote className="text-center text-sm leading-relaxed text-[var(--color-text-muted)] italic mb-4 px-4">
          "{greeting.quote}"
        </blockquote>

        <p className="text-center text-xs text-[var(--color-text-light)] mb-10">
          — {greeting.source}
        </p>

        <div className="w-12 h-px bg-[var(--color-border)] mx-auto mb-8" />

        <p className="text-center text-sm leading-relaxed text-[var(--color-text-muted)]">
          {greeting.closing}
        </p>
      </div>
    </section>
  );
}

export default GreetingSection;
