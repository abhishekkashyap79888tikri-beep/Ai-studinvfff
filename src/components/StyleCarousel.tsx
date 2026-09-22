import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Check, Wand2 } from 'lucide-react';
import { StyleOption } from '../types';

interface StyleCarouselProps {
  styles: StyleOption[];
  selectedStyleId: string;
  onSelectStyle: (style: StyleOption) => void;
  onCustomStyleSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  styles,
  selectedStyleId,
  onSelectStyle,
  onCustomStyleSubmit,
  isGenerating,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onCustomStyleSubmit(customPrompt.trim());
    setCustomPrompt('');
    setShowCustomInput(false);
  };

  return (
    <div className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900 flex items-center gap-2">
            <span>Reimagined Styles</span>
            <span className="text-[11px] font-normal text-stone-500">
              Select an aesthetic to transform your space
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-custom-style-toggle"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition-colors shadow-2xs"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Custom Aesthetic</span>
          </button>
          <div className="w-px h-4 bg-stone-200 mx-1 hidden sm:block" />
          <button
            id="btn-carousel-left"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-100 transition-colors shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-carousel-right"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-100 transition-colors shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional Custom Aesthetic Input Drawer */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="mb-4 p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., Parisian Haussmann apartment with chevron parquet floors and marble fireplace..."
            className="flex-1 px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={isGenerating || !customPrompt.trim()}
            className="px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Custom Style</span>
          </button>
        </form>
      )}

      {/* Horizontal Carousel */}
      <div
        id="styles-carousel-track"
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 scroll-smooth"
      >
        {styles.map((style) => {
          const isSelected = style.id === selectedStyleId;
          return (
            <div
              key={style.id}
              id={`style-card-${style.id}`}
              onClick={() => !isGenerating && onSelectStyle(style)}
              className={`group shrink-0 w-64 sm:w-72 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border text-left flex flex-col ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-400/40 bg-white shadow-md'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
              } ${isGenerating ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                <img
                  src={style.thumbnail}
                  alt={style.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-semibold text-[10px] flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active Style</span>
                  </div>
                )}

                {/* Color swatches strip */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                  {style.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                      style={{ backgroundColor: c }}
                      title={`Palette color ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {style.name}
                  </h3>
                  <p className="text-[11px] font-medium text-stone-500 mt-0.5">
                    {style.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {style.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    {style.keyElements[0]}
                  </span>
                  <button
                    type="button"
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-stone-700 group-hover:text-stone-900 bg-stone-100 group-hover:bg-stone-200'
                    }`}
                  >
                    {isSelected ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
