import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function LoveStoryManagement() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ date: '', title: '', description: '' });

  useEffect(() => { loadStories(); }, []);

  const loadStories = async () => {
    try {
      const data = await adminFetch('/love-stories');
      setStories(data.stories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminFetch(`/love-stories/${editing.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await adminFetch('/love-stories', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      loadStories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus?')) return;
    try {
      await adminFetch(`/love-stories/${id}`, { method: 'DELETE' });
      loadStories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setFormData({ date: s.date, title: s.title, description: s.description });
    setShowForm(true);
  };

  const resetForm = () => setFormData({ date: '', title: '', description: '' });

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Love Story</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm(); }} className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg">+ Add</button>
      </div>

      <div className="space-y-3">
        {stories.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-primary)]">{s.date}</p>
              <p className="font-medium text-gray-800 text-sm">{s.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{s.description}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(s)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">✏️</button>
              <button onClick={() => handleDelete(s.id)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">🗑️</button>
            </div>
          </div>
        ))}
        {stories.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No stories yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Story' : 'Add Story'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="text-xs text-gray-600">Date / Year</label><input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="2018" required /></div>
              <div><label className="text-xs text-gray-600">Title</label><input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required /></div>
              <div><label className="text-xs text-gray-600">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={3} required /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoveStoryManagement;
