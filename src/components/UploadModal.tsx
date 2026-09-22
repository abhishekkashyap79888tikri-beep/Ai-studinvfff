import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { PRESET_ROOMS } from '../data/styles';
import { PresetRoom } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadCustomImage: (dataUrl: string, fileName: string) => void;
  onSelectPreset: (preset: PresetRoom) => void;
  currentRoomId?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadCustomImage,
  onSelectPreset,
  currentRoomId,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUploadCustomImage(result, file.name);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              Select or Upload Your Space
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Upload a real photo of your room or choose a high-resolution sample space
            </p>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div className="mt-5">
          <div
            id="drop-zone-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50/60 scale-[0.99]'
                : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50/80 bg-stone-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Upload className="w-6 h-6 text-amber-700" />
            </div>
            <h4 className="text-sm font-semibold text-stone-900">
              Drag and drop your room photo here
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Supports JPG, PNG, WebP up to 25MB • or <span className="text-amber-700 font-medium underline">browse files</span>
            </p>
          </div>
        </div>

        {/* Or Instant Preset Sample Rooms */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Or Try a Curated Sample Space
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_ROOMS.map((preset) => {
              const isSelected = preset.id === currentRoomId;
              return (
                <div
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                  }`}
                >
                  <div className="aspect-4/3 w-full bg-stone-100 relative">
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center gap-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Current</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-white">
                    <h5 className="text-xs font-semibold text-stone-900 truncate">
                      {preset.name}
                    </h5>
                    <p className="text-[11px] text-stone-500">{preset.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
