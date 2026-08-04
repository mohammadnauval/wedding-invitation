import React, { useState } from 'react';
import PhotoCropEditor from './PhotoCropEditor';

/**
 * PhotoFocusPicker
 * Shows thumbnail grid for each photo.
 * Clicking a photo opens the Instagram-style circular crop editor.
 * cropSettings: array of { x, y, scale } — one per photo (index-matched)
 * onChangeCrops: (newCropSettingsArray) => void
 */
function PhotoFocusPicker({ photos = [], cropSettings = [], onChangeCrops }) {
  const [editingIndex, setEditingIndex] = useState(null);

  if (photos.length === 0) {
    return (
      <div className="w-full h-24 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
        Upload foto terlebih dahulu
      </div>
    );
  }

  const getCrop = (index) => {
    const c = cropSettings[index];
    if (c && typeof c === 'object' && 'posX' in c) return c;
    return { posX: 50, posY: 50, scale: 1 };
  };

  // Thumbnail preview uses the same render model as LivePhoto/editor
  const getThumbnailImgStyle = (index) => {
    const c = getCrop(index);
    const objPos = `${c.posX}% ${c.posY}%`;
    return { objectFit: 'cover', objectPosition: objPos, width: '100%', height: '100%', display: 'block' };
  };
  const getThumbnailScaleStyle = (index) => {
    const c = getCrop(index);
    const objPos = `${c.posX}% ${c.posY}%`;
    return { width: '100%', height: '100%', transform: `scale(${c.scale})`, transformOrigin: objPos };
  };

  const handleSave = (index, newCrop) => {
    const updated = [...cropSettings];
    // Pad array if needed
    while (updated.length <= index) updated.push({ x: 0, y: 0, scale: 1 });
    updated[index] = newCrop;
    onChangeCrops(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gray-500">
        Klik foto untuk mengatur crop — bisa zoom dan geser seperti Instagram.
      </p>

      <div className="flex flex-wrap gap-3">
        {photos.map((url, i) => {
          const crop = getCrop(i);
          const hasCrop = crop.scale > 1.01 || crop.posX !== 50 || crop.posY !== 50;

          return (
            <button
              key={i}
              onClick={() => setEditingIndex(i)}
              className="relative group focus:outline-none"
              title={`Edit crop foto ${i + 1}`}
            >
              {/* Circle preview */}
              <div
                className="w-20 h-20 bg-gray-100 border-2 border-gray-200 group-hover:border-[var(--color-primary)] transition-colors shadow-sm"
                style={{ borderRadius: '50%', overflow: 'hidden' }}
              >
                <div style={getThumbnailScaleStyle(i)}>
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    style={getThumbnailImgStyle(i)}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Edit overlay */}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-medium drop-shadow">
                  Edit
                </span>
              </div>

              {/* Badge: crop applied */}
              {hasCrop && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[8px] flex items-center justify-center shadow">
                  ✓
                </span>
              )}

              {/* Label */}
              <p className="text-[9px] text-center text-gray-400 mt-1">
                {i === 0 ? 'Main' : `Foto ${i + 1}`}
              </p>
            </button>
          );
        })}
      </div>

      {/* Crop editor modal */}
      {editingIndex !== null && (
        <PhotoCropEditor
          src={photos[editingIndex]}
          initialCrop={getCrop(editingIndex)}
          onSave={(newCrop) => handleSave(editingIndex, newCrop)}
          onCancel={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
}

export default PhotoFocusPicker;
