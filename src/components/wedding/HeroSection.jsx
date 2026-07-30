import React from 'react';
import useInView from '../../hooks/useInView';

function HeroSection({ weddingData }) {
  const [ref, inView] = useInView({ threshold: 0.2 });

  const brideName = weddingData?.couple?.bride?.nickname || 'Bride';
  const groomName = weddingData?.couple?.groom?.nickname || 'Groom';

  const weddingDate = weddingData?.events?.[0]?.event_date
    ? new Date(weddingData.events[0].event_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.')
    : '';

  return (
    <section id="home" ref={ref} className="relative h-screen flex items-center justify-center bg-[var(--color-bg)]">

      {/* Content */}
      <div className={`relative text-center px-12 py-20 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--color-primary)] mb-4">
          The Wedding of
        </p>

        <h1 className="font-couple text-5xl md:text-6xl text-[var(--color-primary)] mb-2 leading-[0.9]">
          {brideName} & {groomName}
        </h1>

        <p className="text-xs tracking-wide text-[var(--color-primary)] mt-3 italic font-medium">
          We invite you to witness our vows and share in our joy
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="w-12 h-[2px] bg-[var(--color-primary)]" />
          <p className="font-couple text-2xl text-[var(--color-primary)]">
            {weddingDate}
          </p>
          <div className="w-12 h-[2px] bg-[var(--color-primary)]" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
