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
      
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/images/wedding_welcome_page_background.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[480px] mx-auto w-full h-full flex flex-col justify-start px-8 pt-12 pb-8 relative">
        
        {/* Top section - names and title, positioned at top like reference */}
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.25em] uppercase text-[var(--color-primary)] mb-4 fade-up" style={{ animationDelay: '0.2s' }}>
            We're Getting Married!
          </p>

          <div className="fade-up" style={{ animationDelay: '0.4s' }}>
            <h1 className="font-couple text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.85] text-left">
              {groomName} &
            </h1>
            <h1 className="font-couple text-7xl md:text-8xl text-[var(--color-primary)] leading-[0.85] text-left pl-4">
              {brideName}
            </h1>
          </div>
        </div>

        {/* Spacer - leave room for hand illustration in background */}
        <div className="flex-1" />

        {/* Bottom section - date, guest name, button (lower 30%) */}
        <div className="text-center pb-4 fade-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-primary)] mb-0.5">
            Save the Date
          </p>
          <p className="font-couple text-3xl text-[var(--color-primary)] mb-4">
            {weddingDate}
          </p>

          {/* Guest info */}
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-[var(--color-primary)]/10 mb-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-0.5">
              Dear
            </p>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {guestName} & Partner
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
      </div>
    </div>
  );
}

export default CoverSection;
