import React from 'react';

export default function RootLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F2F1ED] animate-fade-in">
      {/* 1. Hero Banner Skeleton matching aspect-[16/9] md:aspect-[1920/900] */}
      <div className="w-full aspect-[16/9] md:aspect-[1920/900] skel-luxury relative overflow-hidden bg-brand-espresso/20">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent flex items-center">
          <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6">
            <div className="max-w-xl flex flex-col items-start gap-3">
              <div className="h-4 w-24 rounded bg-white/30 backdrop-blur-xs" />
              <div className="h-8 md:h-14 w-3/4 rounded-lg bg-white/20 backdrop-blur-xs" />
              <div className="h-4 md:h-6 w-1/2 rounded bg-white/20 backdrop-blur-xs hidden md:block" />
              <div className="h-8 md:h-11 w-32 md:w-40 rounded-full bg-brand-burgundy/60 mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
        {/* 2. Shop By Categories Skeleton */}
        <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
          <div>
            <div className="h-6 w-44 rounded-lg skel-luxury mb-1.5" />
            <div className="h-3 w-56 rounded skel-luxury" />
          </div>
          <div className="h-4 w-16 rounded skel-luxury" />
        </div>
        <div className="flex gap-4 md:gap-8 pt-6 pb-2 overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-[23vw] md:w-auto flex flex-col items-center gap-2.5 shrink-0">
              <div className="w-full aspect-square md:w-40 md:h-40 rounded-[20px] skel-luxury" />
              <div className="h-3.5 w-16 rounded-full skel-luxury" />
            </div>
          ))}
        </div>

        {/* 3. Offers Row Skeleton */}
        <div className="mt-8 md:mt-12 flex overflow-x-auto no-scrollbar gap-3 md:gap-6 md:grid md:grid-cols-3 pb-2 md:pb-0">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="w-[calc(50%-6px)] md:w-full shrink-0 aspect-[3/4] rounded-2xl skel-luxury border border-gray-200/50" 
            />
          ))}
        </div>

        {/* 4. New Arrivals Skeleton */}
        <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
          <div>
            <div className="h-6 w-36 rounded-lg skel-luxury mb-1.5" />
            <div className="h-3 w-40 rounded skel-luxury" />
          </div>
          <div className="h-4 w-16 rounded skel-luxury" />
        </div>
        <div className="flex gap-4 pt-6 pb-2 overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="w-[220px] md:w-[260px] shrink-0 bg-white border border-brand-cream/50 rounded-2xl overflow-hidden p-3 shadow-2xs"
            >
              <div className="aspect-square w-full rounded-xl skel-luxury mb-3" />
              <div className="h-3 w-16 rounded skel-luxury mb-2" />
              <div className="h-4 w-5/6 rounded skel-luxury mb-1.5" />
              <div className="h-4 w-1/2 rounded skel-luxury mb-3" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-5 w-20 rounded skel-luxury" />
                <div className="w-7 h-7 rounded-full skel-luxury shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* 5. Just For You Grid Skeleton */}
        <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
          <div>
            <div className="h-6 w-32 rounded-lg skel-luxury mb-1.5" />
            <div className="h-3 w-48 rounded skel-luxury" />
          </div>
          <div className="h-4 w-20 rounded skel-luxury" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pt-6 pb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="bg-white border border-brand-cream/50 rounded-2xl overflow-hidden p-3 shadow-2xs flex flex-col"
            >
              <div className="aspect-square w-full rounded-xl skel-luxury mb-3" />
              <div className="h-3 w-16 rounded skel-luxury mb-2" />
              <div className="h-4 w-5/6 rounded skel-luxury mb-1.5" />
              <div className="h-4 w-1/2 rounded skel-luxury mb-3" />
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="h-5 w-20 rounded skel-luxury" />
                <div className="w-7 h-7 rounded-full skel-luxury shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
