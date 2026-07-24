import React from 'react';

function CoverSection({ weddingData, guestName, onOpen }) {
  const coupleName = weddingData?.couple
    ? `${weddingData.couple.groom?.nickname || ''} & ${weddingData.couple.bride?.nickname || ''}`
    : 'Groom & Bride';

  const weddingDate = weddingData?.events?.[0]?.event_date
    ? new Date(weddingData.events[0].event_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white lg:relative lg:min-h-screen">
      <div className="max-w-[480px] mx-auto w-full h-full flex flex-col items-center justify-center px-8 text-center">
        {/* Decorative top */}
        <div className="mb-8 opacity-60">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="mx-auto">
            <path d="M30 5 C20 15, 5 20, 5 35 C5 50, 20 55, 30 55 C40 55, 55 50, 55 35 C55 20, 40 15, 30 5Z" 
                  stroke="var(--color-primary-light)" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-4">
          The Wedding of
        </p>

        <h1 className="font-couple text-5xl md:text-6xl text-[var(--color-primary)] mb-4">
          {coupleName}
        </h1>

        <p className="text-sm tracking-wider text-[var(--color-text-muted)] mb-12">
          {weddingDate}
        </p>

        {/* Divider */}
        <div className="w-16 h-px bg-[var(--color-border)] mb-8" />

        <p className="text-xs tracking-wider text-[var(--color-text-muted)] mb-1">
          Kepada Yth.
        </p>
        <p className="text-lg font-medium text-[var(--color-text)] mb-10">
          {guestName} & Partner
        </p>

        <button
          onClick={onOpen}
          className="btn-outline text-sm animate-pulse hover:animate-none"
          aria-label="Buka Undangan"
        >
          Buka Undangan
        </button>

        {/* Decorative bottom */}
        <div className="mt-12 opacity-40">
          <div className="w-px h-12 bg-[var(--color-primary-light)] mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default CoverSection;
