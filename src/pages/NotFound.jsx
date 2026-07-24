import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)]">
      <div className="text-center p-8">
        <h1 className="text-4xl font-semibold text-[var(--color-text)] mb-2">404</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Halaman tidak ditemukan.</p>
        <Link to="/" className="btn-primary text-sm">Kembali</Link>
      </div>
    </div>
  );
}

export default NotFound;
