import React from 'react';

export default function ReelsLoading() {
  return (
    <div className="w-full bg-black min-h-screen flex items-center justify-center p-4">
      {/* 9:16 Vertical Reel Player Skeleton */}
      <div className="relative w-full max-w-[420px] aspect-[9/16] rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
        {/* Top Header Placeholder */}
        <div className="flex justify-between items-center z-10">
          <div className="h-6 w-24 rounded-full bg-neutral-800 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-neutral-800 animate-pulse" />
        </div>

        {/* Center Spinner Icon */}
        <div className="self-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-700 border-t-[#D4AF37] animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Loading Reel</span>
        </div>

        {/* Bottom Details Placeholder */}
        <div className="space-y-3 z-10">
          <div className="h-4 w-3/4 rounded bg-neutral-800 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-neutral-800 animate-pulse" />
          <div className="h-11 w-full rounded-full bg-neutral-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
