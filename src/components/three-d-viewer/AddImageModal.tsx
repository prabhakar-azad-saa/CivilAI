import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import { RenderImageItem } from '../../types/design';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (item: RenderImageItem) => void;
  conceptTitle: string;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onClose,
  onAddImage,
  conceptTitle
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<RenderImageItem['category']>('3d-cutaway');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        setImageUrl(result);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !imageUrl) return;

    const newItem: RenderImageItem = {
      id: `user-img-${Date.now()}`,
      title: title || 'Custom Architectural View',
      category,
      url: previewUrl || imageUrl,
      caption: caption || `Uploaded image for ${conceptTitle}`,
      uploadedAt: new Date().toLocaleDateString(),
      roomTags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined
    };

    onAddImage(newItem);
    onClose();
    // Reset state
    setTitle('');
    setCaption('');
    setImageUrl('');
    setPreviewUrl('');
    setTags('');
  };

  const samplePresets = [
    { label: 'Sample 3D Cutaway Top View', url: '/renders/cutaway-floorplan-3d.jpg', category: '3d-cutaway' as const, title: 'HD 3D Cutaway Plan' },
    { label: 'Sample Split 2D+3D BIM', url: '/renders/split-cad-bim-sync.png', category: 'split-sync' as const, title: 'CAD Blueprint + 3D View' },
    { label: 'Sample 2D Blueprint', url: '/renders/sample-2d-cad.jpg', category: '2d-blueprint' as const, title: '2D Architectural CAD Blueprint' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-olive-700" />
              <span>Add / Upload Design Images</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Attach 2D blueprints, 3D cutaways, interior photos or client reference drawings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-charcoal-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* File Upload Drop Area */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Upload Image from Computer
            </label>
            <div className="border-2 border-dashed border-stone-300 hover:border-olive-600 rounded-xl p-5 text-center transition-colors bg-stone-50/50 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <Upload className="w-8 h-8 text-stone-400 mb-2" />
                <span className="text-xs font-semibold text-charcoal-800">
                  {isUploading ? 'Loading image...' : 'Click to select or drag and drop image'}
                </span>
                <span className="text-[11px] text-stone-400 mt-1">
                  Supports PNG, JPG, WebP, CAD snapshots (up to 15MB)
                </span>
              </div>
            </div>
          </div>

          {/* Or Image URL / Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Or Paste Web Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://example.com/render.jpg or /renders/..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-olive-600"
            />

            {/* Quick Sample Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-stone-400 font-mono">Quick Presets:</span>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    setPreviewUrl(preset.url);
                    setCategory(preset.category);
                    setTitle(preset.title);
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Thumbnail if available */}
          {previewUrl && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
              <div className="w-20 h-16 rounded-lg overflow-hidden border border-stone-300 bg-stone-200 flex-shrink-0">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-charcoal-900 block truncate">
                  Image Preview Ready
                </span>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Valid image attached
                </span>
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                View Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-olive-600 bg-white"
              >
                <option value="3d-cutaway">🏠 3D Cutaway Floor Plan</option>
                <option value="split-sync">🔀 Split 2D Blueprint + 3D Sync</option>
                <option value="2d-blueprint">📐 2D CAD Blueprint</option>
                <option value="exterior-3d">🏡 3D Exterior Villa Facade</option>
                <option value="interior">🛋️ Interior Room View</option>
                <option value="user-upload">📁 Client / Custom Upload</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Image Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Bedroom & Kitchen Top Cutaway"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-olive-600"
              />
            </div>
          </div>

          {/* Description / Caption */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description / Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Detailed view showing double bed layout, modular kitchen island and terrace seating"
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-olive-600"
            />
          </div>

          {/* Room Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Room Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Master Bedroom, Kitchen, Living, Balcony"
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-olive-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!previewUrl && !imageUrl}
              className="px-5 py-2 rounded-lg bg-olive-700 hover:bg-olive-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add to Project Gallery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
