import React from 'react';

function CoverSection({ weddingData, guestName, guestData, onOpen }) {
  const inviteType = guestData?.invite_type || 'partner';
  const suffix = inviteType === 'keluarga' ? '& Keluarga' : '& Partner';

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] lg:relative lg:min-h-screen overflow-hidden">
      
      {/* Background image - phone version for mobile, desktop version for larger screens */}
      <div className="absolute inset-0">
        {/* Mobile */}
        <img 
          src="/images/welcome_page_new_phone.png" 
          alt="" 
          className="w-full h-full object-cover md:hidden"
        />
        {/* Desktop/Tablet */}
        <img 
          src="/images/welcome_page_new.png" 
          alt="" 
          className="w-full h-full object-cover hidden md:block"
        />
      </div>

      {/* Content wrapper */}
      <div className="absolute inset-0 max-w-[480px] mx-auto">
        {/* Dear + Button - pinned to bottom */}
        <div className="absolute bottom-[4vh] left-0 right-0 text-center px-6 fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-block px-5 py-2 rounded-2xl bg-white/70 backdrop-blur-sm mb-3">
            <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[var(--color-primary)] mb-0.5 font-bold">
              Dear
            </p>
            <p className="text-sm sm:text-base font-bold text-[var(--color-primary)]">
              {guestName} {suffix}
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
