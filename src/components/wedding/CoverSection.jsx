import React from 'react';

function CoverSection({ weddingData, guestName, onOpen }) {
  const groomName = weddingData?.couple?.bride?.nickname || 'Bride';
  const brideName = weddingData?.couple?.groom?.nickname || 'Groom';

  const weddingDate = weddingData?.events?.[0]?.event_date
    ? new Date(weddingData.events[0].event_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.')
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] lg:relative lg:min-h-screen overflow-hidden">
      
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/images/wedding_welcome_page_background.png" 
          alt="" 
          className="w-full h-full object-cover scale-125 origin-center"
        />
      </div>

      {/* Content wrapper - max width for desktop */}
      <div className="absolute inset-0 max-w-[480px] mx-auto">

        {/* Top section - title + names */}
        <div className="absolute top-[2vh] left-0 right-0 px-6 sm:px-8">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[var(--color-primary)] mb-1 sm:mb-2 text-center fade-up" style={{ animationDelay: '0.2s' }}>
            We're Getting Married!
          </p>

          <div className="fade-up" style={{ animationDelay: '0.4s' }}>
            <h1 className="font-couple text-[3.5rem] sm:text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.85] text-left">
              {groomName} &
            </h1>
            <h1 className="font-couple text-[3.5rem] sm:text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.85] text-left pl-2 sm:pl-4">
              {brideName}
            </h1>
          </div>
        </div>

        {/* Save the Date - positioned to avoid hands */}
        <div className="absolute top-[26%] sm:top-[32%] md:top-[40%] right-6 sm:right-8 text-right fade-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[var(--color-primary)] mb-0.5">
            Save the Date
          </p>
          <p className="font-couple text-2xl sm:text-3xl text-[var(--color-primary)]">
            {weddingDate}
          </p>
        </div>

        {/* Dear + Button - pinned to bottom, safe area aware */}
        <div className="absolute bottom-[2vh] left-0 right-0 text-center px-6 fade-up" style={{ animationDelay: '0.8s' }}>
          <div className="inline-block px-4 sm:px-5 py-2 rounded-2xl bg-[var(--color-primary)]/10 mb-2 sm:mb-3">
            <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-0.5">
              Dear
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-primary)]">
              {guestName} & Partner
            </p>
          </div>

          <div className="block">
            <button
              onClick={onOpen}
              className="btn-primary text-xs sm:text-sm"
              aria-label="Buka Undangan"
            >
              Open Invitation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CoverSection;
