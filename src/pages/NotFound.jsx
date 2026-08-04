import React from 'react';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)]">
      <div className="text-center p-8 max-w-sm">
        <p className="text-5xl mb-4">💌</p>
        <h1 className="text-xl font-semibold text-[var(--color-text)] mb-2">
          Halaman Tidak Tersedia
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          Undangan ini hanya dapat diakses melalui link yang telah dikirimkan secara pribadi.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
