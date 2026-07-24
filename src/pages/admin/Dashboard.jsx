import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../hooks/useAdmin';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminFetch('/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  const cards = [
    { label: 'Total Guests', value: stats?.total_guests || 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'RSVP Responded', value: stats?.rsvp_responded || 0, color: 'bg-green-50 text-green-700' },
    { label: 'Attending', value: stats?.attending || 0, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Not Attending', value: stats?.not_attending || 0, color: 'bg-red-50 text-red-700' },
    { label: 'Total Pax', value: stats?.total_pax || 0, color: 'bg-purple-50 text-purple-700' },
    { label: 'Pending RSVP', value: stats?.pending_rsvp || 0, color: 'bg-amber-50 text-amber-700' },
    { label: 'Total Wishes', value: stats?.total_wishes || 0, color: 'bg-pink-50 text-pink-700' },
  ];

  const attendingPct = stats?.total_guests > 0
    ? Math.round((stats.attending / stats.total_guests) * 100)
    : 0;
  const notAttendingPct = stats?.total_guests > 0
    ? Math.round((stats.not_attending / stats.total_guests) * 100)
    : 0;
  const noResponsePct = 100 - attendingPct - notAttendingPct;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`p-4 rounded-xl ${card.color}`}>
            <p className="text-xs opacity-70 mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* RSVP Chart (simple bar) */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">RSVP Overview</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Attending</span>
              <span>{attendingPct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${attendingPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Not Attending</span>
              <span>{notAttendingPct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${notAttendingPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>No Response</span>
              <span>{noResponsePct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${noResponsePct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
