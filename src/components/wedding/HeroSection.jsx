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
    <section id="home" ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Decorative border frame */}
      <div className="absolute inset-3 pointer-events-none z-10 border-2 border-[var(--color-primary)]/30 rounded-lg">
        {/* Inner decorative border */}
        <div className="absolute inset-1 border border-dashed border-[var(--color-primary)]/20 rounded-md" />
        
        {/* Corner florals */}
        <svg className="absolute -top-3 -left-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="6" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M20 8 Q24 14, 20 20 Q16 14, 20 8Z" fill="var(--color-primary)" opacity="0.25"/>
          <path d="M8 20 Q14 16, 20 20 Q14 24, 8 20Z" fill="var(--color-primary)" opacity="0.25"/>
          <path d="M20 32 Q16 26, 20 20 Q24 26, 20 32Z" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M32 20 Q26 24, 20 20 Q26 16, 32 20Z" fill="var(--color-primary)" opacity="0.2"/>
        </svg>
        <svg className="absolute -top-3 -right-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="6" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M20 8 Q24 14, 20 20 Q16 14, 20 8Z" fill="var(--color-primary)" opacity="0.25"/>
          <path d="M8 20 Q14 16, 20 20 Q14 24, 8 20Z" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M20 32 Q16 26, 20 20 Q24 26, 20 32Z" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M32 20 Q26 24, 20 20 Q26 16, 32 20Z" fill="var(--color-primary)" opacity="0.25"/>
        </svg>
        <svg className="absolute -bottom-3 -left-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="6" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M20 8 Q24 14, 20 20 Q16 14, 20 8Z" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M8 20 Q14 16, 20 20 Q14 24, 8 20Z" fill="var(--color-primary)" opacity="0.25"/>
          <path d="M20 32 Q16 26, 20 20 Q24 26, 20 32Z" fill="var(--color-primary)" opacity="0.25"/>
          <path d="M32 20 Q26 24, 20 20 Q26 16, 32 20Z" fill="var(--color-primary)" opacity="0.2"/>
        </svg>
        <svg className="absolute -bottom-3 -right-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="6" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M20 8 Q24 14, 20 20 Q16 14, 20 8Z" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M8 20 Q14 16, 20 20 Q14 24, 8 20Z" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M20 32 Q16 26, 20 20 Q24 26, 20 32Z" fill="var(--color-primary)" opacity="0.25"/>
          <path d="M32 20 Q26 24, 20 20 Q26 16, 32 20Z" fill="var(--color-primary)" opacity="0.25"/>
        </svg>

        {/* Top center bow/ribbon */}
        <svg className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-10" viewBox="0 0 60 36" fill="none">
          <path d="M30 18 Q20 8, 10 12 Q5 14, 8 18 Q12 22, 22 18 L30 18" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M30 18 Q40 8, 50 12 Q55 14, 52 18 Q48 22, 38 18 L30 18" fill="var(--color-primary)" opacity="0.2"/>
          <path d="M28 18 L26 28 Q30 30, 34 28 L32 18" fill="var(--color-primary)" opacity="0.15"/>
        </svg>

        {/* Side vine decorations - left */}
        <svg className="absolute top-1/4 -left-1 w-4 h-20" viewBox="0 0 16 80" fill="none">
          <path d="M8 0 Q4 20, 8 40 Q12 60, 8 80" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" fill="none"/>
          <circle cx="6" cy="20" r="2.5" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="10" cy="40" r="2" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="6" cy="60" r="2.5" fill="var(--color-primary)" opacity="0.15"/>
        </svg>
        {/* Side vine decorations - right */}
        <svg className="absolute top-1/4 -right-1 w-4 h-20" viewBox="0 0 16 80" fill="none">
          <path d="M8 0 Q12 20, 8 40 Q4 60, 8 80" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" fill="none"/>
          <circle cx="10" cy="20" r="2.5" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="6" cy="40" r="2" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="10" cy="60" r="2.5" fill="var(--color-primary)" opacity="0.15"/>
        </svg>
        {/* Bottom vine */}
        <svg className="absolute -bottom-1 left-1/4 w-1/2 h-4" viewBox="0 0 200 16" fill="none">
          <path d="M0 8 Q50 4, 100 8 Q150 12, 200 8" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" fill="none"/>
          <circle cx="50" cy="6" r="2.5" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="100" cy="10" r="2" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="150" cy="6" r="2.5" fill="var(--color-primary)" opacity="0.15"/>
        </svg>
      </div>

      {/* Content */}
      <div className={`relative text-center px-8 py-20 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-primary)] mb-6">
          The Wedding of
        </p>

        <h1 className="font-couple text-6xl md:text-7xl text-[var(--color-primary)] mb-2 leading-[0.9]">
          {brideName} & {groomName}
        </h1>

        <p className="text-sm tracking-wide text-[var(--color-primary)] mt-4 italic font-medium">
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
