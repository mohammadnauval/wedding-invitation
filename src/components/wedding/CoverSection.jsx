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

        {/* Hand illustration - proposal style like the reference */}
        <div className="my-4 fade-up" style={{ animationDelay: '0.6s' }}>
          <svg width="200" height="140" viewBox="0 0 200 140" fill="none" className="mx-auto">
            {/* Left hand (from left sleeve, holding ring) */}
            {/* Sleeve/cuff */}
            <path d="M20 130 L20 105 Q20 100, 25 98 L45 95 Q50 94, 50 90 L50 85" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M50 130 L50 105 Q50 100, 45 98" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Cuff detail */}
            <path d="M20 105 Q35 102, 50 105" 
                  stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            
            {/* Left hand fingers going up */}
            <path d="M30 95 Q28 80, 32 70 Q34 65, 38 63" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M36 93 Q35 75, 40 62 Q42 58, 45 56" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Thumb holding ring */}
            <path d="M45 90 Q50 82, 55 75 Q58 70, 60 68" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Index finger */}
            <path d="M42 92 Q42 78, 48 65 Q50 60, 53 57" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            
            {/* The Ring */}
            <ellipse cx="56" cy="48" rx="12" ry="14" stroke="var(--color-primary)" strokeWidth="2.5" fill="none"/>
            {/* Ring band thickness */}
            <ellipse cx="56" cy="48" rx="9" ry="11" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.4"/>
            
            {/* Diamond/gem on top */}
            <path d="M49 34 L52 28 L56 25 L60 28 L63 34" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M49 34 L63 34" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M56 25 L56 34" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            
            {/* Sparkles around diamond */}
            <line x1="56" y1="18" x2="56" y2="13" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="44" y1="22" x2="41" y2="18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="68" y1="22" x2="71" y2="18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="40" y1="30" x2="36" y2="28" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            <line x1="72" y1="30" x2="76" y2="28" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            
            {/* Right hand (open, receiving) */}
            {/* Sleeve/cuff */}
            <path d="M150 130 L150 108 Q150 103, 155 100 L165 96 Q168 95, 168 92" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M180 130 L180 108 Q180 103, 175 100" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Cuff detail */}
            <path d="M150 108 Q165 105, 180 108" 
                  stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            
            {/* Right hand palm and fingers - open/reaching */}
            <path d="M160 96 Q158 85, 155 78 Q153 73, 150 70" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M163 94 Q162 82, 158 72 Q156 67, 153 63" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M167 93 Q167 80, 163 70 Q161 65, 158 60" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M170 94 Q172 82, 170 72 Q168 67, 165 63" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Thumb */}
            <path d="M158 96 Q152 92, 147 88 Q143 85, 140 83" 
                  stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            
            {/* Small sparkle between hands */}
            <circle cx="105" cy="55" r="2" fill="var(--color-primary)" opacity="0.4"/>
            <circle cx="98" cy="70" r="1.5" fill="var(--color-primary)" opacity="0.3"/>
            <circle cx="112" cy="68" r="1.5" fill="var(--color-primary)" opacity="0.3"/>
          </svg>
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
