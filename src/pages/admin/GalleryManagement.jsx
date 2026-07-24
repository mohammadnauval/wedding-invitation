import React, { useState, useEffect } from 'react';
import { adminFetch, adminUpload } from '../../hooks/useAdmin';

function GalleryManagement() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadGallery(); }, []);

  const loadGallery = async () => {
    try {
      const data = await adminFetch('/gallery');
      setGallery(data.gallery || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        await adminUpload('/gallery', formData);
      }
      loadGallery();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await adminFetch(`/gallery/${id}`, { method: 'DELETE' });
      loadGallery();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gallery Management</h2>
        <label className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg cursor-pointer hover:bg-[var(--color-primary-dark)]">
          {uploading ? 'Uploading...' : '+ Upload Photos'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {gallery.map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
            <img
              src={photo.thumbnail_url || photo.image_url}
              alt="Gallery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                onClick={() => handleDelete(photo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {gallery.length === 0 && (
        <p className="text-center py-12 text-gray-400 text-sm">No photos yet. Upload some!</p>
      )}
    </div>
  );
}

export default GalleryManagement;
