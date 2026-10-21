import React from 'react';

interface LuxuryLoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export default function LuxuryLoadingScreen({
  message = "DESPEARL",
  subtext = "FURNITURE & BESPOKE LIVING",
  fullScreen = true,
}: LuxuryLoadingScreenProps) {
  const containerClass = fullScreen
    ? "min-h-[70vh] w-full flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-[#faf9f6] via-white to-[#f7f5ef]"
    : "w-full py-16 flex flex-col items-center justify-center px-4";

  return (
    <div className={containerClass}>
      <div className="relative flex flex-col items-center max-w-sm text-center">
        
        {/* Ambient Gold Halo */}
        <div className="absolute -top-12 w-48 h-48 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Medallion */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/50 animate-spin-slow" />
          
          {/* Inner Accent Ring */}
          <div className="absolute inset-2 rounded-full border border-[#D4AF37]/30" />
          
          {/* Central Luxury Crest */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#710014] via-[#52000e] to-[#2b0007] flex items-center justify-center shadow-lg shadow-[#710014]/25 relative overflow-hidden">
            {/* Shimmer sweep inside crest */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full animate-[skel-luxury-anim_2.4s_infinite]" />
            
            {/* Elegant Monogram 'D' */}
            <svg
              className="w-8 h-8 text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 3h6.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5H8.5V21H6V3zm2.5 10.5H12c2.21 0 4-1.79 4-4s-1.79-4-4-4H8.5v8z" />
            </svg>
          </div>

          {/* Floating Gold Pearl Dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black font-outfit tracking-[0.3em] text-[#161616] uppercase mb-1">
          {message}
        </h2>

        {/* Subtext */}
        <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] text-[#B38F6F] uppercase mb-6">
          {subtext}
        </p>

        {/* Luxury Progress Line */}
        <div className="w-44 h-[2px] bg-neutral-200/80 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-[#710014] via-[#D4AF37] to-[#710014] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-[skel-luxury-anim_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
        </div>
      </div>
    </div>
  );
}
