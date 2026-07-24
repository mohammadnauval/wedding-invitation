import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function SettingsManagement() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await adminFetch('/settings');
      setSettings(data.settings || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch('/settings', { method: 'PUT', body: JSON.stringify(settings) });
      alert('Settings saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: prev[key] === '1' ? '0' : '1' }));
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">General</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-gray-600">Wedding Title</label><input value={settings.wedding_title || ''} onChange={(e) => setSettings({ ...settings, wedding_title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600">Wedding Date</label><input type="date" value={settings.wedding_date || ''} onChange={(e) => setSettings({ ...settings, wedding_date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Feature Toggles</h3>
          <div className="space-y-3">
            {[
              { key: 'love_story_enabled', label: 'Love Story' },
              { key: 'gallery_enabled', label: 'Gallery' },
              { key: 'rsvp_enabled', label: 'RSVP' },
              { key: 'wishes_enabled', label: 'Wishes' },
              { key: 'gift_enabled', label: 'Wedding Gift' },
              { key: 'music_enabled', label: 'Background Music' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{label}</span>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    settings[key] === '1' ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    settings[key] === '1' ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* RSVP Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">RSVP Settings</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-gray-600">RSVP Deadline</label><input type="date" value={settings.rsvp_deadline || ''} onChange={(e) => setSettings({ ...settings, rsvp_deadline: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Allow RSVP Update</span>
              <button type="button" onClick={() => toggle('rsvp_allow_update')} className={`w-10 h-5 rounded-full transition-colors relative ${settings.rsvp_allow_update === '1' ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.rsvp_allow_update === '1' ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>
        </div>

        {/* Wishes Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Wishes Settings</h3>
          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Require Moderation</span>
            <button type="button" onClick={() => toggle('wishes_moderation')} className={`w-10 h-5 rounded-full transition-colors relative ${settings.wishes_moderation === '1' ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.wishes_moderation === '1' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}

export default SettingsManagement;
