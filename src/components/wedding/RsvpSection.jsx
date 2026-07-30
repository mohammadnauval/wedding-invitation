import React, { useState, useEffect } from 'react';
import useInView from '../../hooks/useInView';

function RsvpSection({ guestData, weddingData }) {
  const [ref, inView] = useInView();
  const [formData, setFormData] = useState({
    attendance_status: '',
    pax: 1,
    notes: '',
  });
  const [existingRsvp, setExistingRsvp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const maxPax = guestData?.max_pax || 2;
  const rsvpDeadline = weddingData?.settings?.rsvp_deadline;
  const allowUpdate = weddingData?.settings?.rsvp_allow_update === '1';

  const isDeadlinePassed = rsvpDeadline && new Date(rsvpDeadline) < new Date();

  useEffect(() => {
    if (guestData?.rsvp) {
      setExistingRsvp(guestData.rsvp);
      setFormData({
        attendance_status: guestData.rsvp.attendance_status,
        pax: guestData.rsvp.pax,
        notes: guestData.rsvp.notes || '',
      });
    }
  }, [guestData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.attendance_status) {
      setMessage({ type: 'error', text: 'Silakan pilih konfirmasi kehadiran.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const url = existingRsvp ? `/api/rsvp/${guestData.id}` : '/api/rsvp';
      const method = existingRsvp ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: guestData?.id,
          ...formData,
          pax: formData.attendance_status === 'attending' ? formData.pax : 0,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal mengirim RSVP');
      }

      const data = await response.json();
      setExistingRsvp(data.rsvp);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Konfirmasi berhasil dikirim!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (isDeadlinePassed && !existingRsvp) {
    return (
      <section id="rsvp" ref={ref} className="relative py-16 bg-[var(--color-bg-soft)] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/background_border_fix.png" alt="" className="w-full h-full object-fill" />
        </div>
        <div className="section-container text-center relative z-10">
          <h2 className="section-title">RSVP</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-4">
            Mohon maaf, periode konfirmasi kehadiran telah berakhir.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" ref={ref} className="relative py-16 bg-[var(--color-bg-soft)] overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/background_border_fix.png" alt="" className="w-full h-full object-fill" />
      </div>
      <div className={`section-container relative z-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">RSVP</h2>
        <p className="section-subtitle">Konfirmasi Kehadiran</p>

        {existingRsvp && !isEditing ? (
          <div className="text-center p-6 bg-[var(--color-bg)] rounded-2xl border-2 border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">Konfirmasi Anda</p>
            <p className="text-lg font-medium text-[var(--color-primary)] mb-1">
              {existingRsvp.attendance_status === 'attending' ? 'âœ“ Hadir' : 'âœ— Tidak Hadir'}
            </p>
            {existingRsvp.attendance_status === 'attending' && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Jumlah tamu: {existingRsvp.pax}
              </p>
            )}
            {allowUpdate && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline text-xs mt-4 py-2"
              >
                Ubah Konfirmasi
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Nama</label>
              <input
                type="text"
                value={guestData?.name || ''}
                disabled
                className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-xl text-sm"
              />
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-2">
                Apakah Anda akan hadir?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendance_status: 'attending' })}
                  className={`py-3 rounded-xl text-sm border transition-all ${
                    formData.attendance_status === 'attending'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendance_status: 'not_attending' })}
                  className={`py-3 rounded-xl text-sm border transition-all ${
                    formData.attendance_status === 'not_attending'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  Tidak Hadir
                </button>
              </div>
            </div>

            {/* Number of guests */}
            {formData.attendance_status === 'attending' && (
              <div>
                <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                  Jumlah Tamu
                </label>
                <select
                  value={formData.pax}
                  onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm"
                >
                  {Array.from({ length: maxPax }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                Pesan / Catatan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm resize-none"
                placeholder="Tulis pesan atau catatan..."
              />
            </div>

            {/* Message */}
            {message && (
              <p className={`text-xs text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {message.text}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default RsvpSection;
