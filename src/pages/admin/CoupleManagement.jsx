import React, { useState, useEffect } from 'react';
import { adminFetch, adminUpload } from '../../hooks/useAdmin';

function CoupleManagement() {
  const [couple, setCouple] = useState({ groom: {}, bride: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handlePhotoUpload = async (type, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    try {
      const data = await adminUpload('/couple/photo', formData);
      setCouple((prev) => ({
        ...prev,
        [type]: { ...prev[type], photo: data.url },
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const updateField = (type, field, value) => {
    setCouple((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  const renderPersonForm = (type, label) => {
    const person = couple[type] || {};
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">{label}</h3>
        <div className="space-y-3">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border">
              {person.photo && (
                <img src={person.photo} alt={label} className="w-full h-full object-cover" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handlePhotoUpload(type, e.target.files[0])}
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Full Name</label>
              <input
                value={person.full_name || ''}
                onChange={(e) => updateField(type, 'full_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Nickname</label>
              <input
                value={person.nickname || ''}
                onChange={(e) => updateField(type, 'nickname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Father's Name</label>
              <input
                value={person.father_name || ''}
                onChange={(e) => updateField(type, 'father_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Mother's Name</label>
              <input
                value={person.mother_name || ''}
                onChange={(e) => updateField(type, 'mother_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600">Instagram (without @)</label>
              <input
                value={person.instagram || ''}
                onChange={(e) => updateField(type, 'instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="username"
              />
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
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {renderPersonForm('groom', '🤵 Groom')}
        {renderPersonForm('bride', '👰 Bride')}
      </div>
    </div>
  );
}

export default CoupleManagement;
