import React from 'react';

// Reusable floral/leaf SVG ornaments
export function LeafBranch({ className = '', flip = false }) {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : {}}
    >
      {/* Main stem */}
      <path d="M10 70 Q30 55, 50 45 Q70 35, 90 25 Q100 20, 110 15" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
      {/* Leaves */}
      <path d="M30 58 Q35 48, 42 50 Q36 55, 30 58Z" fill="var(--color-primary)" opacity="0.15"/>
      <path d="M50 45 Q55 35, 62 38 Q56 43, 50 45Z" fill="var(--color-primary)" opacity="0.2"/>
      <path d="M70 35 Q75 25, 82 28 Q76 33, 70 35Z" fill="var(--color-primary)" opacity="0.15"/>
      <path d="M90 25 Q95 16, 101 19 Q95 23, 90 25Z" fill="var(--color-primary)" opacity="0.2"/>
      {/* Small leaves on other side */}
      <path d="M40 52 Q38 58, 44 60 Q42 55, 40 52Z" fill="var(--color-primary)" opacity="0.12"/>
      <path d="M60 40 Q58 46, 64 48 Q62 43, 60 40Z" fill="var(--color-primary)" opacity="0.15"/>
      <path d="M80 30 Q78 36, 84 37 Q82 32, 80 30Z" fill="var(--color-primary)" opacity="0.12"/>
    </svg>
  );
}

export function FloralCorner({ className = '', size = 80 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
    >
      {/* Flower petals */}
      <ellipse cx="20" cy="20" rx="8" ry="4" fill="var(--color-primary)" opacity="0.12" transform="rotate(-30 20 20)"/>
      <ellipse cx="20" cy="20" rx="8" ry="4" fill="var(--color-primary)" opacity="0.12" transform="rotate(30 20 20)"/>
      <ellipse cx="20" cy="20" rx="8" ry="4" fill="var(--color-primary)" opacity="0.12" transform="rotate(90 20 20)"/>
      <circle cx="20" cy="20" r="3" fill="var(--color-primary)" opacity="0.2"/>
      {/* Leaves */}
      <path d="M30 30 Q40 25, 45 30 Q38 32, 30 30Z" fill="var(--color-primary)" opacity="0.15"/>
      <path d="M25 35 Q35 32, 40 38 Q32 37, 25 35Z" fill="var(--color-primary)" opacity="0.12"/>
      {/* Small buds */}
      <circle cx="50" cy="20" r="2.5" fill="var(--color-primary)" opacity="0.1"/>
      <circle cx="55" cy="30" r="2" fill="var(--color-primary)" opacity="0.08"/>
      {/* Curving stem */}
      <path d="M20 25 Q30 35, 45 40 Q55 43, 65 42" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.2" strokeLinecap="round"/>
      <path d="M18 22 Q15 30, 20 42 Q24 50, 30 55" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.15" strokeLinecap="round"/>
    </svg>
  );
}

export function FloralDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
        {/* Left branch */}
        <path d="M30 20 Q50 18, 70 20 Q80 20, 90 20" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round"/>
        <path d="M40 20 Q45 14, 52 16 Q47 19, 40 20Z" fill="var(--color-primary)" opacity="0.15"/>
        <path d="M55 20 Q60 14, 67 16 Q62 19, 55 20Z" fill="var(--color-primary)" opacity="0.12"/>
        <path d="M45 20 Q48 25, 54 24 Q49 22, 45 20Z" fill="var(--color-primary)" opacity="0.12"/>
        <path d="M60 20 Q63 25, 69 24 Q64 22, 60 20Z" fill="var(--color-primary)" opacity="0.1"/>

        {/* Center flower */}
        <ellipse cx="100" cy="20" rx="6" ry="3" fill="var(--color-primary)" opacity="0.15" transform="rotate(0 100 20)"/>
        <ellipse cx="100" cy="20" rx="6" ry="3" fill="var(--color-primary)" opacity="0.15" transform="rotate(60 100 20)"/>
        <ellipse cx="100" cy="20" rx="6" ry="3" fill="var(--color-primary)" opacity="0.15" transform="rotate(120 100 20)"/>
        <circle cx="100" cy="20" r="3" fill="var(--color-primary)" opacity="0.25"/>

        {/* Right branch */}
        <path d="M110 20 Q120 20, 130 20 Q150 18, 170 20" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round"/>
        <path d="M133 20 Q138 14, 145 16 Q140 19, 133 20Z" fill="var(--color-primary)" opacity="0.15"/>
        <path d="M148 20 Q153 14, 160 16 Q155 19, 148 20Z" fill="var(--color-primary)" opacity="0.12"/>
        <path d="M138 20 Q141 25, 147 24 Q142 22, 138 20Z" fill="var(--color-primary)" opacity="0.12"/>
        <path d="M153 20 Q156 25, 162 24 Q157 22, 153 20Z" fill="var(--color-primary)" opacity="0.1"/>
      </svg>
    </div>
  );
}

export function SmallFlower({ className = '', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="12" rx="5" ry="2.5" fill="var(--color-primary)" opacity="0.15" transform="rotate(0 12 12)"/>
      <ellipse cx="12" cy="12" rx="5" ry="2.5" fill="var(--color-primary)" opacity="0.15" transform="rotate(72 12 12)"/>
      <ellipse cx="12" cy="12" rx="5" ry="2.5" fill="var(--color-primary)" opacity="0.15" transform="rotate(144 12 12)"/>
      <ellipse cx="12" cy="12" rx="5" ry="2.5" fill="var(--color-primary)" opacity="0.15" transform="rotate(216 12 12)"/>
      <ellipse cx="12" cy="12" rx="5" ry="2.5" fill="var(--color-primary)" opacity="0.15" transform="rotate(288 12 12)"/>
      <circle cx="12" cy="12" r="2" fill="var(--color-primary)" opacity="0.25"/>
    </svg>
  );
}
