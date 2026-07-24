import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function GiftManagement() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    type: 'bank', bank_name: '', account_number: '', account_holder: '', address: '',
  });

  useEffect(() => { loadGifts(); }, []);

  const loadGifts = async () => {
    try {
      const data = await adminFetch('/gifts');
      setGifts(data.gifts || []);
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
        await adminFetch(`/gifts/${editing.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await adminFetch('/gifts', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      loadGifts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus?')) return;
    try {
      await adminFetch(`/gifts/${id}`, { method: 'DELETE' });
      loadGifts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (gift) => {
    setEditing(gift);
    setFormData({
      type: gift.type, bank_name: gift.bank_name || '', account_number: gift.account_number || '',
      account_holder: gift.account_holder || '', address: gift.address || '',
    });
    setShowForm(true);
  };

  const resetForm = () => setFormData({ type: 'bank', bank_name: '', account_number: '', account_holder: '', address: '' });

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Wedding Gift</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm(); }} className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg">+ Add</button>
      </div>

      <div className="space-y-3">
        {gifts.map((gift) => (
          <div key={gift.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {gift.type === 'bank' ? `${gift.bank_name} - ${gift.account_number}` : 'Address'}
              </p>
              <p className="text-xs text-gray-500">{gift.type === 'bank' ? `a.n. ${gift.account_holder}` : gift.address}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(gift)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">✏️</button>
              <button onClick={() => handleDelete(gift.id)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">🗑️</button>
            </div>
          </div>
        ))}
        {gifts.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No gift info yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Gift' : 'Add Gift'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="bank">Bank Transfer</option>
                  <option value="address">Address</option>
                </select>
              </div>
              {formData.type === 'bank' ? (
                <>
                  <div><label className="text-xs text-gray-600">Bank Name</label><input value={formData.bank_name} onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required /></div>
                  <div><label className="text-xs text-gray-600">Account Number</label><input value={formData.account_number} onChange={(e) => setFormData({ ...formData, account_number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required /></div>
                  <div><label className="text-xs text-gray-600">Account Holder</label><input value={formData.account_holder} onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required /></div>
                </>
              ) : (
                <div><label className="text-xs text-gray-600">Address</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={3} required /></div>
              )}
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

export default GiftManagement;
