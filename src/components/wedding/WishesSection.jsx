import React, { useState, useEffect } from 'react';
import useInView from '../../hooks/useInView';

function WishesSection({ guestData }) {
  const [ref, inView] = useInView();
  const [wishes, setWishes] = useState([]);
  const [formData, setFormData] = useState({ name: guestData?.name || '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    fetchWishes();
  }, []);

  useEffect(() => {
    if (guestData?.name) {
      setFormData((prev) => ({ ...prev, name: guestData.name }));
    }
  }, [guestData]);

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
      }
    } catch (err) {
      // Silently fail
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setSubmitMessage({ type: 'error', text: 'Nama dan ucapan wajib diisi.' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: guestData?.id,
          name: formData.name,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error('Gagal mengirim ucapan');

      setFormData({ ...formData, message: '' });
      setSubmitMessage({ type: 'success', text: 'Ucapan berhasil dikirim!' });
      fetchWishes();
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  return (
    <section id="wishes" ref={ref} className="py-16 bg-white">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Wishes</h2>
        <p className="section-subtitle">Ucapan & Doa</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-8">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama"
            className="w-full px-4 py-3 bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-xl text-sm"
          />
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tulis ucapan & doa..."
            rows={3}
            className="w-full px-4 py-3 bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-xl text-sm resize-none"
          />
          {submitMessage && (
            <p className={`text-xs ${submitMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {submitMessage.text}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary disabled:opacity-50"
          >
            {submitting ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>

        {/* Wishes list */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {wishes.map((wish, index) => (
            <div
              key={wish.id || index}
              className="p-4 bg-[var(--color-bg-soft)] rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[var(--color-text)]">{wish.name}</p>
                <p className="text-[10px] text-[var(--color-text-light)]">
                  {timeAgo(wish.created_at)}
                </p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {wish.message}
              </p>
            </div>
          ))}
          {wishes.length === 0 && (
            <p className="text-center text-xs text-[var(--color-text-light)]">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default WishesSection;
