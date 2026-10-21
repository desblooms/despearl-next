import React from 'react';
import LuxuryLoadingScreen from '@/components/LuxuryLoadingScreen';

export default function RootLoading() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-start">
      <LuxuryLoadingScreen 
        message="DESPEARL"
        subtext="KERALA'S BEST FURNITURE FACTORY"
        fullScreen={false}
      />
      
      {/* Ghost Preview Skeletons */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full pb-16 opacity-75">
        {/* Banner Skeleton */}
        <div className="w-full h-44 md:h-72 rounded-2xl skel-luxury mb-8 shadow-sm" />

        {/* Category Pills Strip Skeleton */}
        <div className="flex gap-3 overflow-hidden mb-8 pb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-28 rounded-full skel-luxury shrink-0" />
          ))}
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-2.5 border border-neutral-100 shadow-sm flex flex-col">
              <div className="aspect-square rounded-xl skel-luxury mb-3" />
              <div className="h-3 w-16 rounded skel-luxury mb-2" />
              <div className="h-4 w-3/4 rounded skel-luxury mb-2" />
              <div className="h-4 w-20 rounded skel-luxury mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
