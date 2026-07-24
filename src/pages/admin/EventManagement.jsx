import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '', event_date: '', start_time: '', end_time: '',
    venue: '', address: '', maps_url: '', is_main_event: false,
  });

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const data = await adminFetch('/events');
      setEvents(data.events || []);
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
        await adminFetch(`/events/${editing.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await adminFetch('/events', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus event ini?')) return;
    try {
      await adminFetch(`/events/${id}`, { method: 'DELETE' });
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (ev) => {
    setEditing(ev);
    setFormData({
      title: ev.title, event_date: ev.event_date, start_time: ev.start_time,
      end_time: ev.end_time || '', venue: ev.venue, address: ev.address,
      maps_url: ev.maps_url || '', is_main_event: ev.is_main_event,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', event_date: '', start_time: '', end_time: '',
      venue: '', address: '', maps_url: '', is_main_event: false,
    });
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Event Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); resetForm(); }}
          className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg"
        >
          + Add Event
        </button>
      </div>

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 text-sm">{ev.title}</p>
                {ev.is_main_event && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">Main</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {ev.event_date} • {ev.start_time}{ev.end_time ? ` - ${ev.end_time}` : ''} • {ev.venue}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(ev)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">✏️</button>
              <button onClick={() => handleDelete(ev.id)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">🗑️</button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No events yet.</p>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Event' : 'Add Event'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Event Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Date *</label>
                  <input type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Start Time *</label>
                  <input type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">End Time</label>
                <input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Venue *</label>
                <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              </div>
              <div>
                <label className="text-xs text-gray-600">Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Google Maps URL</label>
                <input type="url" value={formData.maps_url} onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={formData.is_main_event} onChange={(e) => setFormData({ ...formData, is_main_event: e.target.checked })} />
                Set as main event (for countdown)
              </label>
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

export default EventManagement;
