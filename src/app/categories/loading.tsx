import React from 'react';

export default function CategoriesLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full py-8 md:py-12">
      <div className="mb-6">
        <div className="h-7 w-48 rounded-lg skel-luxury mb-2" />
        <div className="h-3.5 w-64 rounded skel-luxury" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div 
            key={i} 
            className="rounded-2xl overflow-hidden aspect-[4/5] skel-luxury relative p-4 flex flex-col justify-end border border-neutral-100 shadow-xs"
          >
            <div className="h-5 w-2/3 rounded-md bg-white/70 backdrop-blur-xs mb-2 z-10" />
            <div className="h-3 w-1/3 rounded-md bg-white/50 backdrop-blur-xs z-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
