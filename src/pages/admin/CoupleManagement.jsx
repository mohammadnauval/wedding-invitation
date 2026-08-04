import React, { useState, useEffect } from 'react';
import { adminFetch, adminUpload } from '../../hooks/useAdmin';

const FOCUS_OPTIONS = [
  { value: 'top', label: 'Atas' },
  { value: 'center', label: 'Tengah' },
  { value: 'bottom', label: 'Bawah' },
  { value: 'left', label: 'Kiri' },
  { value: 'right', label: 'Kanan' },
  { value: '50% 20%', label: 'Atas-Tengah' },
  { value: '50% 30%', label: 'Wajah (atas)' },
];

function CoupleManagement() {
  const [couple, setCouple] = useState({ groom: {}, bride: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ groom: false, bride: false });

  useEffect(() => { loadCouple(); }, []);

  const loadCouple = async () => {
    try {
      const data = await adminFetch('/couple');
      setCouple(data.couple || { groom: {}, bride: {} });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch('/couple', {
        method: 'PUT',
        body: JSON.stringify(couple),
      });
      alert('Saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (type, files) => {
    if (!files || files.length === 0) return;
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('photo', files[i]);
        formData.append('type', type);
        const data = await adminUpload('/couple/photo', formData);
        setCouple(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            photo: data.url,
            photos: data.photos,
          },
        }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDeletePhoto = async (type, url) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      const data = await adminFetch('/couple/photo', {
        method: 'DELETE',
        body: JSON.stringify({ type, url }),
      });
      setCouple(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          photo: data.photos?.[0] || null,
          photos: data.photos,
        },
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const updateField = (type, field, value) => {
    setCouple(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  const renderPersonForm = (type, label) => {
    const person = couple[type] || {};
    const photos = (() => {
      try { return JSON.parse(person.photos || '[]'); }
      catch { return person.photo ? [person.photo] : []; }
    })();

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">{label}</h3>
        <div className="space-y-4">
          {/* Photo gallery */}
          <div>
            <label className="text-xs text-gray-600 mb-2 block">
              Foto ({photos.length} foto) — Live photo otomatis jika lebih dari 1
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {photos.map((url, index) => (
                <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: person.photo_focus || 'center' }}
                  />
                  <button
                    onClick={() => handleDeletePhoto(type, url)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
                  >
                    ✕
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5">Main</span>
                  )}
                </div>
              ))}
            </div>

            <label className="cursor-pointer">
              <span className={`inline-block px-3 py-1.5 text-xs rounded-lg ${uploading[type] ? 'bg-gray-200 text-gray-500' : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'}`}>
                {uploading[type] ? 'Uploading...' : '+ Upload Foto'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading[type]}
                onChange={(e) => handlePhotoUpload(type, e.target.files)}
              />
            </label>
          </div>

          {/* Focus position */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Fokus Foto (area yang ditampilkan)</label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField(type, 'photo_focus', opt.value)}
                  className={`py-1.5 text-xs rounded-lg border transition-colors ${
                    (person.photo_focus || 'center') === opt.value
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Preview */}
            {photos.length > 0 && (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 mt-2">
                <img
                  src={photos[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: person.photo_focus || 'center' }}
                />
              </div>
            )}
          </div>

          {/* Other fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Full Name</label>
              <input value={person.full_name || ''} onChange={(e) => updateField(type, 'full_name', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Nickname</label>
              <input value={person.nickname || ''} onChange={(e) => updateField(type, 'nickname', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Father's Name</label>
              <input value={person.father_name || ''} onChange={(e) => updateField(type, 'father_name', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Mother's Name</label>
              <input value={person.mother_name || ''} onChange={(e) => updateField(type, 'mother_name', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Anak ke-</label>
              <select value={person.child_order || ''} onChange={(e) => updateField(type, 'child_order', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="">-</option>
                {['pertama','kedua','ketiga','keempat','kelima','keenam','ketujuh','kedelapan','kesembilan','kesepuluh'].map(o => (
                  <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Instagram</label>
              <input value={person.instagram || ''} onChange={(e) => updateField(type, 'instagram', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="username" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Couple Management</h2>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="space-y-6">
        {renderPersonForm('bride', '👰 Bride')}
        {renderPersonForm('groom', '🤵 Groom')}
      </div>
    </div>
  );
}

export default CoupleManagement;
