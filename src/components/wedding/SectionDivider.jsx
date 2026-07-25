import React from 'react';
import { FloralDivider } from './FloralOrnament';

function SectionDivider({ variant = 'wave' }) {
  if (variant === 'wave') {
    return (
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-[30px]">
          <path
            d="M0 20 Q150 0, 300 20 Q450 40, 600 20 Q750 0, 900 20 Q1050 40, 1200 20 L1200 40 L0 40 Z"
            fill="var(--color-bg-soft)"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'wave-reverse') {
    return (
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-[30px]">
          <path
            d="M0 20 Q150 40, 300 20 Q450 0, 600 20 Q750 40, 900 20 Q1050 0, 1200 20 L1200 40 L0 40 Z"
            fill="var(--color-bg)"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'floral') {
    return <FloralDivider className="py-4" />;
  }

  if (variant === 'hearts') {
    return (
      <div className="flex items-center justify-center py-6 gap-3">
        <div className="w-12 h-[1px] bg-[var(--color-primary-light)]/40" />
        <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--color-primary)" opacity="0.3">
          <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
        </svg>
        <svg width="10" height="10" viewBox="0 0 20 20" fill="var(--color-primary)" opacity="0.2">
          <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
        </svg>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--color-primary)" opacity="0.3">
          <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z"/>
        </svg>
        <div className="w-12 h-[1px] bg-[var(--color-primary-light)]/40" />
      </div>
    );
  }

  return null;
}

export default SectionDivider;
