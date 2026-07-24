import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function GuestList() {
  const [guests, setGuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [waTemplate, setWaTemplate] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showWaTemplate, setShowWaTemplate] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', category_id: '', max_pax: 2, notes: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [guestsData, catsData, settingsData] = await Promise.all([
        adminFetch('/guests'),
        adminFetch('/categories'),
        adminFetch('/settings'),
      ]);
      setGuests(guestsData.guests || []);
      setCategories(catsData.categories || []);
      setWaTemplate(settingsData.settings?.wa_template || `Assalamu'alaikum {nama},

Dengan penuh kebahagiaan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.

Silakan membuka undangan melalui link berikut:
{link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i dapat hadir. Terima kasih.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuest) {
        await adminFetch(`/guests/${editingGuest.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await adminFetch('/guests', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setShowForm(false);
      setEditingGuest(null);
      resetForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus tamu ini?')) return;
    try {
      await adminFetch(`/guests/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      phone: guest.phone || '',
      category_id: guest.category_id || '',
      max_pax: guest.max_pax,
      notes: guest.notes || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', category_id: '', max_pax: 2, notes: '' });
  };

  const copyInviteLink = (guest) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/invite/${guest.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWaMessage = (guest) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/invite/${guest.slug}`;
    return waTemplate
      .replace(/{nama}/g, guest.name)
      .replace(/{link}/g, link);
  };

  const sendWhatsApp = async (guest) => {
    if (!guest.phone) {
      alert('Nomor telepon belum diisi untuk tamu ini.');
      return;
    }
    const message = getWaMessage(guest);
    // Format phone: remove leading 0, add 62
    let phone = guest.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    } else if (!phone.startsWith('62')) {
      phone = '62' + phone;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    // Mark as sent
    try {
      await adminFetch(`/guests/${guest.id}/wa-sent`, { method: 'PUT' });
      setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, wa_sent: true } : g));
    } catch (err) {
      // Silent fail
    }
  };

  const copyWhatsApp = (guest) => {
    const message = getWaMessage(guest);
    navigator.clipboard.writeText(message);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveWaTemplate = async () => {
    try {
      await adminFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify({ wa_template: waTemplate }),
      });
      setShowWaTemplate(false);
      alert('Template berhasil disimpan!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/guests/export', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guests.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export gagal');
    }
  };

  const filteredGuests = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone && g.phone.includes(search));
    const matchCategory = !filterCategory || String(g.category_id) === filterCategory;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Guest List</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowWaTemplate(true)} className="px-4 py-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
            📝 WA Template
          </button>
          <button onClick={handleExport} className="px-4 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Export CSV
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingGuest(null); resetForm(); }}
            className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]"
          >
            + Add Guest
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Max Pax</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">RSVP</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">WA</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{guest.name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{guest.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{guest.category_name || '-'}</td>
                  <td className="px-4 py-3 text-center">{guest.max_pax}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      guest.rsvp_status === 'attending'
                        ? 'bg-green-50 text-green-700'
                        : guest.rsvp_status === 'not_attending'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {guest.rsvp_status === 'attending' ? 'Hadir'
                        : guest.rsvp_status === 'not_attending' ? 'Tidak Hadir'
                        : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {guest.wa_sent ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">✓ Sent</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => sendWhatsApp(guest)}
                        className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded"
                        title="Kirim WA"
                      >
                        📱
                      </button>
                      <button
                        onClick={() => copyWhatsApp(guest)}
                        className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded"
                        title="Copy WA Message"
                      >
                        {copiedId === guest.id ? '✓' : '💬'}
                      </button>
                      <button
                        onClick={() => copyInviteLink(guest)}
                        className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                        title="Copy Link"
                      >
                        🔗
                      </button>
                      <button
                        onClick={() => handleEdit(guest)}
                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGuests.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No guests found.</p>
        )}
      </div>

      {/* Add/Edit Guest Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingGuest ? 'Edit Guest' : 'Add Guest'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Phone (WhatsApp) *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Max Pax</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.max_pax}
                  onChange={(e) => setFormData({ ...formData, max_pax: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingGuest(null); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-dark)]"
                >
                  {editingGuest ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WA Template Modal */}
      {showWaTemplate && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">WhatsApp Template</h3>
            <p className="text-xs text-gray-500 mb-4">
              Gunakan <code className="bg-gray-100 px-1 rounded">{'{nama}'}</code> untuk nama tamu dan <code className="bg-gray-100 px-1 rounded">{'{link}'}</code> untuk link undangan.
            </p>
            <textarea
              value={waTemplate}
              onChange={(e) => setWaTemplate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none font-mono"
              rows={10}
            />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500 mb-1">Preview:</p>
              <p className="text-xs text-gray-700 whitespace-pre-wrap">
                {waTemplate.replace(/{nama}/g, 'Budi Santoso').replace(/{link}/g, 'https://domain.com/invite/budi-santoso')}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowWaTemplate(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={saveWaTemplate}
                className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-dark)]"
              >
                Simpan Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestList;
