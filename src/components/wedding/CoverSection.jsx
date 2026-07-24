import React from 'react';

function CoverSection({ weddingData, guestName, onOpen }) {
  const groomName = weddingData?.couple?.groom?.nickname || 'Groom';
  const brideName = weddingData?.couple?.bride?.nickname || 'Bride';

  const weddingDate = weddingData?.events?.[0]?.event_date
    ? new Date(weddingData.events[0].event_date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)] lg:relative lg:min-h-screen">
      <div className="max-w-[480px] mx-auto w-full h-full flex items-center justify-center px-6 py-8">
        {/* Main card with floral border */}
        <div className="relative w-full max-w-[380px] mx-auto bg-[var(--color-bg-soft)] rounded-lg p-2">
          {/* Outer decorative border */}
          <div className="border-[3px] border-[var(--color-primary-light)] rounded-md p-1">
            {/* Inner dashed border */}
            <div className="border border-dashed border-[var(--color-primary-light)] rounded p-8 md:p-10 relative overflow-hidden">
              
              {/* Corner floral decorations - Top Left */}
              <div className="absolute top-3 left-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="8" cy="8" r="5" fill="var(--color-floral)" opacity="0.7"/>
                  <circle cx="20" cy="5" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="5" cy="20" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="14" cy="14" r="4" fill="var(--color-berry)" opacity="0.6"/>
                  <path d="M10 25 Q15 20, 25 22" stroke="var(--color-floral)" strokeWidth="1" fill="none" opacity="0.4"/>
                </svg>
              </div>

              {/* Corner floral decorations - Top Right */}
              <div className="absolute top-3 right-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="42" cy="8" r="5" fill="var(--color-floral)" opacity="0.7"/>
                  <circle cx="30" cy="5" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="45" cy="20" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="36" cy="14" r="4" fill="var(--color-berry)" opacity="0.6"/>
                  <path d="M40 25 Q35 20, 25 22" stroke="var(--color-floral)" strokeWidth="1" fill="none" opacity="0.4"/>
                </svg>
              </div>

              {/* Corner floral decorations - Bottom Left */}
              <div className="absolute bottom-3 left-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="8" cy="42" r="5" fill="var(--color-floral)" opacity="0.7"/>
                  <circle cx="20" cy="45" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="5" cy="30" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="14" cy="36" r="4" fill="var(--color-berry)" opacity="0.6"/>
                </svg>
              </div>

              {/* Corner floral decorations - Bottom Right */}
              <div className="absolute bottom-3 right-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="42" cy="42" r="5" fill="var(--color-floral)" opacity="0.7"/>
                  <circle cx="30" cy="45" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="45" cy="30" r="3" fill="var(--color-floral)" opacity="0.5"/>
                  <circle cx="36" cy="36" r="4" fill="var(--color-berry)" opacity="0.6"/>
                </svg>
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <p className="font-script text-lg text-[var(--color-primary)] mb-6">
                  A Journey Begins
                </p>

                <h1 className="font-couple text-5xl md:text-6xl text-[var(--color-primary-dark)] leading-tight mb-1">
                  {groomName}
                </h1>
                <p className="font-couple text-3xl text-[var(--color-primary)] mb-1">&</p>
                <h1 className="font-couple text-5xl md:text-6xl text-[var(--color-primary-dark)] leading-tight mb-6">
                  {brideName}
                </h1>

                <p className="text-sm tracking-wider text-[var(--color-text-muted)] mb-8">
                  {weddingDate}
                </p>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-8 h-px bg-[var(--color-primary-light)]" />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--color-primary-light)">
                    <path d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5 Z"/>
                  </svg>
                  <div className="w-8 h-px bg-[var(--color-primary-light)]" />
                </div>

                <p className="font-script text-base text-[var(--color-text-muted)] mb-8 leading-relaxed italic">
                  We invite you to witness<br/>our vows and joy
                </p>

                {/* Guest name */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-light)] mb-1">
                    Kepada Yth.
                  </p>
                  <p className="text-base font-medium text-[var(--color-text)]">
                    {guestName}
                  </p>
                </div>

                <button
                  onClick={onOpen}
                  className="btn-outline text-xs py-2.5 px-8 animate-pulse hover:animate-none"
                  aria-label="Buka Undangan"
                >
                  Buka Undangan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side floral decorations (visible on larger screens) */}
      <div className="hidden lg:block fixed top-1/4 left-8 opacity-30">
        <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
          <circle cx="30" cy="20" r="15" fill="var(--color-berry)" opacity="0.3"/>
          <circle cx="15" cy="50" r="10" fill="var(--color-floral)" opacity="0.4"/>
          <circle cx="40" cy="80" r="12" fill="var(--color-berry)" opacity="0.3"/>
          <circle cx="20" cy="100" r="8" fill="var(--color-floral)" opacity="0.4"/>
        </svg>
      </div>
      <div className="hidden lg:block fixed top-1/4 right-8 opacity-30">
        <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
          <circle cx="30" cy="20" r="15" fill="var(--color-berry)" opacity="0.3"/>
          <circle cx="45" cy="50" r="10" fill="var(--color-floral)" opacity="0.4"/>
          <circle cx="20" cy="80" r="12" fill="var(--color-berry)" opacity="0.3"/>
          <circle cx="40" cy="100" r="8" fill="var(--color-floral)" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

export default CoverSection;
