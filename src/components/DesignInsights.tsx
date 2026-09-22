import React from 'react';
import { Palette, CheckCircle2, Sliders, Share2, Download, Info } from 'lucide-react';
import { StyleOption } from '../types';

interface DesignInsightsProps {
  currentStyle: StyleOption;
  colorPalette?: string[];
  keyElements?: string[];
  makeoverNotes?: string;
  onDownloadComparison?: () => void;
}

export const DesignInsights: React.FC<DesignInsightsProps> = ({
  currentStyle,
  colorPalette = currentStyle.colors,
  keyElements = currentStyle.keyElements,
  makeoverNotes,
  onDownloadComparison,
}) => {
  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
            Design Dossier
          </span>
          <h3 className="text-sm font-semibold text-stone-900 mt-1">
            {currentStyle.name} Architectural Direction
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {onDownloadComparison && (
            <button
              onClick={onDownloadComparison}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Save View</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Color Palette */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-stone-700">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Material & Color Palette</span>
          </div>
          <div className="flex items-center gap-2">
            {colorPalette.map((color, idx) => (
              <div key={idx} className="group relative">
                <div
                  className="w-8 h-8 rounded-lg border border-stone-300 shadow-2xs cursor-pointer group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                />
                <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[10px] bg-stone-900 text-white rounded whitespace-nowrap pointer-events-none transition-opacity shadow-sm">
                  {color}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {currentStyle.description}
          </p>
        </div>

        {/* Key Architectural & Decor Elements */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Key Makeover Elements</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {keyElements.map((element, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs text-stone-700 bg-stone-50 border border-stone-100 rounded-lg px-2.5 py-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">{element}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
