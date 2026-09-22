import React from 'react';
import { Sparkles, Upload, RefreshCw, Layers, SlidersHorizontal } from 'lucide-react';
import { StyleOption } from '../types';

interface HeaderProps {
  currentStyle: StyleOption;
  onOpenUpload: () => void;
  onResetToSample: () => void;
  roomName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentStyle,
  onOpenUpload,
  onResetToSample,
  roomName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-stone-900">
                StudioReimagine
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full">
                AI Interior Consultant
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate max-w-[200px] sm:max-w-xs">
              Space: <span className="font-medium text-stone-700">{roomName}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-switch-sample"
            onClick={onResetToSample}
            title="Switch sample space"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sample Rooms</span>
          </button>

          <button
            id="btn-upload-photo"
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-all active:scale-[0.98]"
          >
            <Upload className="w-3.5 h-3.5 text-amber-300" />
            <span>Upload Your Space</span>
          </button>
        </div>
      </div>
    </header>
  );
};
