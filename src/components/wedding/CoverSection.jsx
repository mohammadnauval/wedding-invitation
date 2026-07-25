import React from 'react';

function CoverSection({ weddingData, guestName, onOpen }) {
  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] lg:relative lg:min-h-screen overflow-hidden">
      
      {/* Background image - phone version for mobile, desktop version for larger screens */}
      <div className="absolute inset-0">
        {/* Mobile */}
        <img 
          src="/images/wedding_welcome_page_background_phone.png" 
          alt="" 
          className="w-full h-full object-cover md:hidden"
        />
        {/* Desktop/Tablet */}
        <img 
          src="/images/wedding_welcome_page_background_2.png" 
          alt="" 
          className="w-full h-full object-cover hidden md:block"
        />
      </div>

      {/* Content wrapper */}
      <div className="absolute inset-0 max-w-[480px] mx-auto">
        {/* Dear + Button - pinned to bottom */}
        <div className="absolute bottom-[4vh] left-0 right-0 text-center px-6 fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-block px-5 py-2 rounded-2xl bg-[var(--color-primary)]/10 mb-3">
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
