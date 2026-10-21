import React from 'react';

export default function ShopLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full py-4 md:py-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-2">
        <div>
          <div className="h-7 w-36 rounded-lg skel-luxury mb-2" />
          <div className="h-3.5 w-60 rounded skel-luxury" />
        </div>
        <div className="h-9 w-40 rounded-lg skel-luxury self-start md:self-auto" />
      </div>

      {/* Category Pills Strip Skeleton */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div 
            key={i} 
            className="h-10 w-28 md:w-32 rounded-full skel-luxury shrink-0" 
          />
        ))}
      </div>

      {/* Product Cards Grid Skeleton (8 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div 
            key={i} 
            className="bg-white border border-brand-cream/50 rounded-2xl overflow-hidden flex flex-col p-3 shadow-xs"
          >
            {/* Square Image Box */}
            <div className="aspect-square w-full rounded-xl skel-luxury mb-3 relative overflow-hidden" />
            
            {/* Brand Pill */}
            <div className="h-3 w-16 rounded skel-luxury mb-2" />

            {/* Title Line 1 & Line 2 */}
            <div className="h-4 w-5/6 rounded skel-luxury mb-1.5" />
            <div className="h-4 w-1/2 rounded skel-luxury mb-3" />

            {/* Price & Cart Button */}
            <div className="mt-auto pt-2 flex items-center justify-between">
              <div className="h-5 w-20 rounded skel-luxury" />
              <div className="w-8 h-8 rounded-full skel-luxury shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
