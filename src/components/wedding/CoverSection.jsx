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

      <div className="max-w-[480px] mx-auto w-full h-full flex flex-col items-center justify-center px-8 relative">
        
        {/* Top text */}
        <p className="text-sm font-bold tracking-[0.25em] uppercase text-[var(--color-primary)] mb-6 fade-up" style={{ animationDelay: '0.2s' }}>
          We're Getting Married!
        </p>

        {/* Couple names - big, bold, handwritten */}
        <div className="mb-4 text-center fade-up" style={{ animationDelay: '0.4s' }}>
          <h1 className="font-couple text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.85]">
            {groomName}
          </h1>
          <span className="font-couple text-5xl text-[var(--color-primary)] inline-block">&</span>
          <h1 className="font-couple text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.85]">
            {brideName}
          </h1>
        </div>



        {/* Save the date + Guest name + Button - compact */}
        <div className="text-center fade-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-primary)] mb-0.5">
            Save the Date
          </p>
          <p className="font-couple text-3xl text-[var(--color-primary)] mb-5">
            {weddingDate}
          </p>

          {/* Guest info */}
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-[var(--color-primary)]/10 mb-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-0.5">
              Dear
            </p>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {guestName}
            </p>
          </div>

          <div className="block">
            <button
              onClick={onOpen}
              className="btn-primary"
              aria-label="Buka Undangan"
            >
              Open Invitation
            </button>
          </div>
        </div>

        {/* Decorative hearts scattered */}
        <div className="absolute top-[12%] left-[8%] opacity-20">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
        <div className="absolute top-[20%] right-[10%] opacity-15">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
        <div className="absolute bottom-[15%] left-[12%] opacity-15">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
        <div className="absolute bottom-[22%] right-[7%] opacity-20">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--color-primary)">
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CoverSection;
