import React from 'react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs tracking-wider text-[var(--color-text-muted)]">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
