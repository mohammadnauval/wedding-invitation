import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WeddingPage from './pages/WeddingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import GuestList from './pages/admin/GuestList';
import RsvpManagement from './pages/admin/RsvpManagement';
import CoupleManagement from './pages/admin/CoupleManagement';
import EventManagement from './pages/admin/EventManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import MusicManagement from './pages/admin/MusicManagement';
import ContentManagement from './pages/admin/ContentManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Wedding Invitation */}
      <Route path="/invite/:guestSlug" element={<WeddingPage />} />
      <Route path="/wedding" element={<WeddingPage />} />
      <Route path="/" element={<WeddingPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="guests" element={<GuestList />} />
        <Route path="rsvp" element={<RsvpManagement />} />

        <Route path="couple" element={<CoupleManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="music" element={<MusicManagement />} />


        <Route path="content" element={<ContentManagement />} />
        <Route path="settings" element={<SettingsManagement />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
