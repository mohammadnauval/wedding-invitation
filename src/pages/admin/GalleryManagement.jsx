import React, { useState, useEffect } from 'react';
import { adminFetch, adminUpload } from '../../hooks/useAdmin';

/**
 * Compress an image File using Canvas before uploading.
 */
async function compressImage(file, maxPx = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) { height = Math.round((height / width) * maxPx); width = maxPx; }
        else { width = Math.round((width / height) * maxPx); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })) : reject(new Error('Compression failed')),
        'image/jpeg', quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

function GalleryManagement() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [staticPath, setStaticPath] = useState('');

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

  // Upload file (compressed client-side)
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Memproses foto ${i + 1} dari ${files.length}...`);
        const compressed = await compressImage(files[i]);
        const formData = new FormData();
        formData.append('image', compressed);
        await adminUpload('/gallery', formData);
      }
      setUploadProgress('');
      loadGallery();
    } catch (err) {
      alert(err.message);
      setUploadProgress('');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Add static file path (file already in /public/images/gallery/)
  const handleAddStaticPath = async () => {
    const trimmed = staticPath.trim();
    if (!trimmed) return;

    // Ensure path starts with /images/gallery/
    const finalPath = trimmed.startsWith('/images/gallery/')
      ? trimmed
      : `/images/gallery/${trimmed}`;

    try {
      await adminFetch('/gallery', {
        method: 'POST',
        body: JSON.stringify({ static_path: finalPath }),
      });
      setStaticPath('');
      loadGallery();
    } catch (err) {
      alert(err.message);
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
        <label className={`px-4 py-2 text-xs rounded-lg cursor-pointer text-white ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'}`}>
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

      {uploadProgress && (
        <p className="text-xs text-gray-500 mb-4 text-center">{uploadProgress}</p>
      )}

      {/* Add static path */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6">
        <p className="text-xs text-gray-500 mb-2">
          Atau tambahkan foto dari folder <code className="bg-gray-100 px-1 rounded">/public/images/gallery/</code>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={staticPath}
            onChange={(e) => setStaticPath(e.target.value)}
            placeholder="nama_file.jpg"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            onClick={handleAddStaticPath}
            className="px-4 py-2 text-xs bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]"
          >
            Tambah
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          Commit foto ke git terlebih dahulu, lalu masukkan nama file di sini.
        </p>
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
        <p className="text-center py-12 text-gray-400 text-sm">No photos yet. Upload some or add from static folder!</p>
      )}
    </div>
  );
}

export default GalleryManagement;
