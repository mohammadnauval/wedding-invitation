import React, { useState, useEffect } from 'react';
import { adminFetch, adminUpload } from '../../hooks/useAdmin';
import PhotoFocusPicker from '../../components/admin/PhotoFocusPicker';

// Compress image client-side before upload to stay within Vercel's 4.5MB request limit
async function compressImage(file, maxPx = 1200, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) { height = Math.round((height / width) * maxPx); width = maxPx; }
        else { width = Math.round((width / height) * maxPx); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })) : reject(new Error('Compression failed')),
        'image/jpeg', quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

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
        const compressed = await compressImage(files[i]);
        const formData = new FormData();
        formData.append('photo', compressed);
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
      const isLocalImage = url.startsWith('/images/');
      if (isLocalImage) {
        const person = couple[type] || {};
        let photos = [];
        try { photos = JSON.parse(person.photos || '[]'); } catch (e) {}
        const deletedIndex = photos.indexOf(url);
        photos = photos.filter(p => p !== url);
        const mainPhoto = photos.length > 0 ? photos[0] : null;

        // Also remove the corresponding crop setting
        let focuses = [];
        try { focuses = JSON.parse(person.photo_focuses || '[]'); } catch (e) {}
        if (deletedIndex >= 0) focuses.splice(deletedIndex, 1);

        await adminFetch('/couple/photo/update-array', {
          method: 'PUT',
          body: JSON.stringify({ type, photos, photo: mainPhoto, photo_focuses: focuses }),
        });
        setCouple(prev => ({
          ...prev,
          [type]: { ...prev[type], photo: mainPhoto, photos: JSON.stringify(photos), photo_focuses: JSON.stringify(focuses) },
        }));
        return;
      }

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

  const handleUseDefaultPhotos = async (type) => {
    const defaults = {
      groom: ['/images/couple/groom/groom_1.JPEG', '/images/couple/groom/groom_2.JPEG'],
      bride: ['/images/couple/bride/bride_1.JPEG', '/images/couple/bride/bride_2.JPEG'],
    };
    const defaultPhotos = defaults[type];
    if (!defaultPhotos) return;
    try {
      await adminFetch('/couple/photo/update-array', {
        method: 'PUT',
        body: JSON.stringify({ type, photos: defaultPhotos, photo: defaultPhotos[0], photo_focuses: [] }),
      });
      setCouple(prev => ({
        ...prev,
        [type]: { ...prev[type], photo: defaultPhotos[0], photos: JSON.stringify(defaultPhotos), photo_focuses: '[]' },
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCropsChange = async (type, newCrops) => {
    const jsonStr = JSON.stringify(newCrops);
    setCouple(prev => ({
      ...prev,
      [type]: { ...prev[type], photo_focuses: jsonStr },
    }));
    // Auto-save to DB
    try {
      await adminFetch('/couple/focuses', {
        method: 'PUT',
        body: JSON.stringify({ type, photo_focuses: jsonStr }),
      });
    } catch (e) { /* silent */ }
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
      try {
        const parsed = JSON.parse(person.photos || '[]');
        if (parsed.length > 0) return parsed;
      } catch (e) {}
      if (type === 'groom') return ['/images/couple/groom/groom_1.JPEG', '/images/couple/groom/groom_2.JPEG'];
      if (type === 'bride') return ['/images/couple/bride/bride_1.JPEG', '/images/couple/bride/bride_2.JPEG'];
      return person.photo ? [person.photo] : [];
    })();

    const cropSettings = (() => {
      try {
        const parsed = JSON.parse(person.photo_focuses || '[]');
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return [];
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

            <div className="flex items-center gap-2 flex-wrap">
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
              <button
                onClick={() => handleUseDefaultPhotos(type)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Gunakan foto default
              </button>
            </div>
          </div>

          {/* Crop / zoom per foto */}
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Crop & Zoom (per foto)</label>
            <PhotoFocusPicker
              photos={photos}
              cropSettings={cropSettings}
              onChangeCrops={(newCrops) => handleCropsChange(type, newCrops)}
            />
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
