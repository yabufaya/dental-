import React, { useState } from 'react';

interface BeforeAfterProps {
  before: string;
  after: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  before,
  after,
  alt,
  width = 800,
  height = 600,
  className = '',
}) => {
  const [pos, setPos] = useState<number>(50);

  return (
    <figure
      className={`relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-slate-100 select-none shadow-md ${className}`}
      style={{ ['--pos' as string]: `${pos}%` }}
    >
      {/* After image underneath */}
      <img
        src={after}
        alt={`After: ${alt}`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Before image clipped on top */}
      <img
        src={before}
        alt={`Before: ${alt}`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{
          clipPath: `inset(0 calc(100% - ${pos}%) 0 0)`,
        }}
      />

      {/* Floating Before/After tags */}
      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow-sm pointer-events-none backdrop-blur-sm z-10">
        Before
      </span>
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow-sm pointer-events-none backdrop-blur-sm z-10">
        After
      </span>

      {/* Draggable Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        style={{ left: `${pos}%`, transform: 'translateX(-1px)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center font-bold text-sm border border-slate-200">
          ↔
        </div>
      </div>

      {/* Native Range Input over the entire image for keyboard, touch & mouse dragging */}
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Slide to compare before and after: ${alt}`}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize touch-pan-y z-30 m-0 p-0"
      />

      {/* Disclaimer note */}
      <figcaption className="absolute left-0 right-0 bottom-0 px-4 py-2 text-[11px] text-center text-white/90 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20">
        Results vary. Shared with patient's written consent.
      </figcaption>
    </figure>
  );
};

export default BeforeAfter;
