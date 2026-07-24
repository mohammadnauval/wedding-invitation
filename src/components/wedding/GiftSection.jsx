import React, { useState } from 'react';
import useInView from '../../hooks/useInView';

function GiftSection({ weddingData }) {
  const [ref, inView] = useInView();
  const [copiedId, setCopiedId] = useState(null);
  const gifts = weddingData?.gifts || [];

  if (gifts.length === 0) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const bankGifts = gifts.filter(g => g.type === 'bank');
  const addressGifts = gifts.filter(g => g.type === 'address');

  return (
    <section ref={ref} className="py-16 bg-[var(--color-bg-soft)]">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Wedding Gift</h2>
        <p className="section-subtitle">Hadiah Pernikahan</p>

        <p className="text-center text-xs text-[var(--color-text-muted)] mb-8 leading-relaxed">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika memberi adalah
          bentuk tanda kasih, Anda dapat memberikan melalui:
        </p>

        {/* Bank Transfer */}
        {bankGifts.length > 0 && (
          <div className="space-y-4 mb-6">
            {bankGifts.map((gift) => (
              <div
                key={gift.id}
                className="p-5 bg-white rounded-2xl border border-[var(--color-border)] text-center"
              >
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Bank Transfer</p>
                <p className="text-sm font-semibold text-[var(--color-text)] mb-2">
                  {gift.bank_name}
                </p>
                <p className="text-lg font-mono tracking-wider text-[var(--color-primary)] mb-1">
                  {gift.account_number}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  a.n. {gift.account_holder}
                </p>
                <button
                  onClick={() => copyToClipboard(gift.account_number, gift.id)}
                  className="btn-outline text-xs py-2"
                >
                  {copiedId === gift.id ? '✓ Tersalin' : 'Copy Account Number'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Address */}
        {addressGifts.length > 0 && (
          <div className="space-y-4">
            {addressGifts.map((gift) => (
              <div
                key={gift.id}
                className="p-5 bg-white rounded-2xl border border-[var(--color-border)] text-center"
              >
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Kirim Hadiah</p>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {gift.address}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GiftSection;
