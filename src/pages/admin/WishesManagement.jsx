import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function WishesManagement() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWishes(); }, []);

  const loadWishes = async () => {
    try {
      const data = await adminFetch('/wishes');
      setWishes(data.wishes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminFetch(`/wishes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus ucapan ini?')) return;
    try {
      await adminFetch(`/wishes/${id}`, { method: 'DELETE' });
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Wishes Management</h2>

      <div className="space-y-3">
        {wishes.map((wish) => (
          <div key={wish.id} className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-800 text-sm">{wish.name}</p>
                <p className="text-xs text-gray-500 mt-1">{wish.message}</p>
                <p className="text-[10px] text-gray-400 mt-2">
                  {new Date(wish.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  wish.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : wish.status === 'hidden'
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {wish.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
              {wish.status !== 'published' && (
                <button
                  onClick={() => handleStatusChange(wish.id, 'published')}
                  className="text-xs text-green-600 hover:underline"
                >
                  Approve
                </button>
              )}
              {wish.status !== 'hidden' && (
                <button
                  onClick={() => handleStatusChange(wish.id, 'hidden')}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Hide
                </button>
              )}
              <button
                onClick={() => handleDelete(wish.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {wishes.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No wishes yet.</p>
        )}
      </div>
    </div>
  );
}

export default WishesManagement;
