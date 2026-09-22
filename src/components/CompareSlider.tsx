import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, Eye, Sparkles, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompareSliderProps {
  originalImage: string;
  reimaginedImage: string;
  styleName: string;
  isGenerating?: boolean;
  statusMessage?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalImage,
  reimaginedImage,
  styleName,
  isGenerating = false,
  statusMessage,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Keyboard navigation for precision
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-stone-950 shadow-xl border border-stone-800 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'aspect-4/3 max-h-[580px]'
      }`}
    >
      <div
        id="compare-container"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full h-full cursor-ew-resize overflow-hidden focus:outline-hidden"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* Reimagined Background Image (Right side) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            id="img-reimagined"
            src={reimaginedImage}
            alt={`Reimagined in ${styleName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center pointer-events-none"
          />
        </div>

        {/* Original Clipped Image (Left side) */}
        <div
          className="absolute inset-0 h-full overflow-hidden will-change-[clip-path]"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <img
            id="img-original"
            src={originalImage}
            alt="Original space"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Grab Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-stone-900 shadow-xl border-2 border-stone-900/10 flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-105 active:scale-95 transition-transform">
            <ChevronsLeftRight className="w-5 h-5 text-stone-800" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs font-semibold bg-stone-900/80 backdrop-blur-md text-stone-100 rounded-full border border-white/10 shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            Original Space
          </span>
        </div>

        <div className="absolute top-4 right-4 z-30 pointer-events-none flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs font-semibold bg-amber-500/90 backdrop-blur-md text-stone-950 rounded-full border border-amber-300/40 shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            Reimagined: {styleName}
          </span>
        </div>

        {/* Bottom Center Floating Quick Toggles */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            id="btn-peek-original"
            onClick={() => setSliderPosition(100)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              sliderPosition >= 95 ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Original
          </button>
          <button
            id="btn-split-slider"
            onClick={() => setSliderPosition(50)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              sliderPosition > 20 && sliderPosition < 80
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Compare (50/50)
          </button>
          <button
            id="btn-peek-reimagined"
            onClick={() => setSliderPosition(0)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              sliderPosition <= 5 ? 'bg-amber-400 text-stone-950 shadow-xs font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Reimagined
          </button>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <button
            id="btn-fullscreen-toggle"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            className="p-1 text-stone-300 hover:text-white rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Loading / Generating Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-7 h-7 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-white tracking-wide">
                Reimagining in {styleName}...
              </h3>
              <p className="text-xs text-stone-300 mt-1.5 max-w-sm">
                {statusMessage || 'Analyzing room architecture, preserving natural lighting, and applying curated materials.'}
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-amber-300">
                  Gemini Visual Consultant Active
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
