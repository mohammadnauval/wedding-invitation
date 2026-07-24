import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function RsvpManagement() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadRsvps(); }, []);

  const loadRsvps = async () => {
    try {
      const data = await adminFetch('/rsvp');
      setRsvps(data.rsvps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      a.download = 'rsvp-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export gagal');
    }
  };

  const filtered = rsvps.filter((r) => {
    if (filter === 'all') return true;
    return r.attendance_status === filter;
  });

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">RSVP Management</h2>
        <button onClick={handleExport} className="px-4 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['all', 'attending', 'not_attending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs rounded-lg transition-colors ${
              filter === f ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {f === 'all' ? 'All' : f === 'attending' ? 'Hadir' : 'Tidak Hadir'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Guest</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Pax</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rsvp) => (
                <tr key={rsvp.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{rsvp.guest_name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rsvp.attendance_status === 'attending'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {rsvp.attendance_status === 'attending' ? 'Hadir' : 'Tidak Hadir'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{rsvp.pax || 0}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{rsvp.notes || '-'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {rsvp.submitted_at ? new Date(rsvp.submitted_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No RSVP data.</p>
        )}
      </div>
    </div>
  );
}

export default RsvpManagement;
