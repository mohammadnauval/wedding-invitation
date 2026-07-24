import React, { useState, useEffect } from 'react';
import { adminFetch, adminUpload } from '../../hooks/useAdmin';

function MusicManagement() {
  const [music, setMusic] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadMusic(); }, []);

  const loadMusic = async () => {
    try {
      const data = await adminFetch('/music');
      setMusic(data.music);
      setEnabled(data.enabled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('music', file);
      await adminUpload('/music', formData);
      loadMusic();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleEnabled = async () => {
    try {
      await adminFetch('/music/toggle', {
        method: 'PUT',
        body: JSON.stringify({ enabled: !enabled }),
      });
      setEnabled(!enabled);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Music Management</h2>

      <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Background Music</span>
          <button
            onClick={toggleEnabled}
            className={`px-4 py-1.5 text-xs rounded-full ${
              enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {music && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Current: {music.filename || 'Music file'}</p>
            <audio controls className="w-full">
              <source src={music.url} type="audio/mpeg" />
            </audio>
          </div>
        )}

        <div>
          <label className="block text-xs text-gray-600 mb-2">Upload MP3</label>
          <input
            type="file"
            accept="audio/mpeg,audio/mp3"
            onChange={handleUpload}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}

export default MusicManagement;
