import React from 'react';
import useInView from '../../hooks/useInView';

function HeroSection({ weddingData }) {
  const [ref, inView] = useInView({ threshold: 0.2 });

  const coupleName = weddingData?.couple
    ? `${weddingData.couple.groom?.nickname || ''} & ${weddingData.couple.bride?.nickname || ''}`
    : 'Groom & Bride';

  const weddingDate = weddingData?.events?.[0]?.event_date
    ? new Date(weddingData.events[0].event_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.')
    : '';

  const heroImage = weddingData?.settings?.hero_image || '/hero.jpeg';

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Wedding Hero"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[var(--color-bg)]/60" />
      </div>

      {/* Content */}
      <div className={`relative text-center px-8 py-20 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-6">
          The Wedding of
        </p>

        <h1 className="font-script text-5xl md:text-6xl text-[var(--color-primary)] mb-4">
          {coupleName}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-px bg-[var(--color-primary-light)]" />
          <p className="text-sm tracking-[0.2em] text-[var(--color-text-muted)]">
            {weddingDate}
          </p>
          <div className="w-12 h-px bg-[var(--color-primary-light)]" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
