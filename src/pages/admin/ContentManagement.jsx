import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function ContentManagement() {
  const [content, setContent] = useState({
    greeting_opening: '',
    greeting_quote: '',
    greeting_source: '',
    greeting_closing: '',
    closing_message: '',
    countdown_message: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadContent(); }, []);

  const loadContent = async () => {
    try {
      const data = await adminFetch('/content');
      setContent(data.content || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch('/content', { method: 'PUT', body: JSON.stringify(content) });
      alert('Saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Content Management</h2>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Greeting Section</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-gray-600">Opening Text</label><input value={content.greeting_opening || ''} onChange={(e) => setContent({ ...content, greeting_opening: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600">Quote</label><textarea value={content.greeting_quote || ''} onChange={(e) => setContent({ ...content, greeting_quote: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={3} /></div>
            <div><label className="text-xs text-gray-600">Quote Source</label><input value={content.greeting_source || ''} onChange={(e) => setContent({ ...content, greeting_source: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600">Closing Greeting</label><textarea value={content.greeting_closing || ''} onChange={(e) => setContent({ ...content, greeting_closing: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={2} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Closing Section</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-gray-600">Closing Message</label><textarea value={content.closing_message || ''} onChange={(e) => setContent({ ...content, closing_message: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={3} /></div>
            <div><label className="text-xs text-gray-600">Countdown Finished Message</label><input value={content.countdown_message || ''} onChange={(e) => setContent({ ...content, countdown_message: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Today is Our Special Day" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
