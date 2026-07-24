import React from 'react';

function CoverSection({ weddingData, guestName, onOpen }) {
  const groomName = weddingData?.couple?.groom?.nickname || 'Groom';
  const brideName = weddingData?.couple?.bride?.nickname || 'Bride';

  const weddingDate = weddingData?.events?.[0]?.event_date
    ? new Date(weddingData.events[0].event_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.')
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)] lg:relative lg:min-h-screen overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      <div className="max-w-[480px] mx-auto w-full h-full flex flex-col items-center justify-center px-8 text-center relative">
        
        {/* Top text */}
        <p className="text-sm font-bold tracking-[0.25em] uppercase text-[var(--color-primary)] mb-10 fade-up" style={{ animationDelay: '0.2s' }}>
          We're Getting Married!
        </p>

        {/* Couple names - big, bold, handwritten */}
        <div className="mb-6 fade-up" style={{ animationDelay: '0.4s' }}>
          <h1 className="font-couple text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.9] mb-0">
            {groomName}
          </h1>
          <span className="font-couple text-5xl text-[var(--color-primary)] inline-block my-1">&</span>
          <h1 className="font-couple text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.9]">
            {brideName}
          </h1>
        </div>

        {/* Ring illustration */}
        <div className="my-8 fade-up float-animation" style={{ animationDelay: '0.6s' }}>
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
            {/* Hand holding ring */}
            <path d="M30 70 Q35 50, 45 45 Q50 42, 55 44 L58 48 Q56 52, 52 55 L48 70" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Fingers */}
            <path d="M45 45 Q43 38, 48 32 Q52 28, 55 33 L55 44" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M50 43 Q49 35, 53 28 Q57 24, 59 30 L58 43" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Ring */}
            <ellipse cx="56" cy="25" rx="8" ry="9" stroke="var(--color-primary)" strokeWidth="2.5" fill="none"/>
            {/* Diamond on ring */}
            <path d="M53 17 L56 12 L59 17" stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Sparkles */}
            <line x1="48" y1="10" x2="48" y2="6" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="64" y1="12" x2="67" y2="9" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="62" y1="8" x2="62" y2="4" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            
            {/* Other hand */}
            <path d="M90 70 Q85 55, 78 50 Q74 47, 70 50 L68 55 Q72 57, 75 60 L80 72" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Fingers of other hand */}
            <path d="M78 50 Q80 42, 76 37 Q73 34, 70 38 L70 50" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M74 48 Q75 40, 72 35 Q69 32, 67 36 L68 48" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            
            {/* Sleeve cuffs */}
            <path d="M25 72 Q28 68, 33 70 Q38 72, 35 76 L25 78 Z" 
                  stroke="var(--color-primary)" strokeWidth="2" fill="none"/>
            <path d="M95 72 Q92 68, 87 70 Q82 72, 85 76 L95 78 Z" 
                  stroke="var(--color-primary)" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Save the date */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-primary)] mb-1">
            Save the Date
          </p>
          <p className="font-couple text-3xl text-[var(--color-primary)]">
            {weddingDate}
          </p>
        </div>

        {/* Guest info */}
        <div className="mb-8 fade-up" style={{ animationDelay: '1s' }}>
          <div className="inline-block px-6 py-3 rounded-2xl bg-[var(--color-primary)]/10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-0.5">
              Dear
            </p>
            <p className="text-base font-semibold text-[var(--color-primary)]">
              {guestName}
            </p>
          </div>
        </div>

        {/* Open button */}
        <div className="fade-up" style={{ animationDelay: '1.2s' }}>
          <button
            onClick={onOpen}
            className="btn-primary"
            aria-label="Buka Undangan"
          >
            Open Invitation
          </button>
        </div>

        {/* Decorative hearts scattered */}
        <div className="absolute top-[15%] left-[10%] opacity-20">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
        <div className="absolute top-[25%] right-[12%] opacity-15">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
        <div className="absolute bottom-[20%] left-[15%] opacity-15">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
        <div className="absolute bottom-[30%] right-[8%] opacity-20">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CoverSection;
