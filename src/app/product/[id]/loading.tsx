import React from 'react';

export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12 animate-fade-in">
      {/* Breadcrumbs Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-12 rounded skel-luxury" />
          <span className="text-gray-300">/</span>
          <div className="h-3.5 w-16 rounded skel-luxury" />
          <span className="text-gray-300">/</span>
          <div className="h-3.5 w-24 rounded skel-luxury" />
          <span className="text-gray-300">/</span>
          <div className="h-3.5 w-32 rounded skel-luxury" />
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start gap-6 lg:gap-8">
        
        {/* Left: Gallery Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col md:grid md:grid-cols-[80px_1fr] gap-4 md:sticky md:top-4">
          {/* Thumbnails (Desktop vertical column, Mobile horizontal row) */}
          <div className="flex flex-row md:flex-col gap-3 overflow-hidden order-2 md:order-1">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-[70px] md:w-full aspect-square rounded-lg skel-luxury shrink-0" 
              />
            ))}
          </div>

          {/* Main Large Image Placeholder */}
          <div className="w-full aspect-square rounded-2xl skel-luxury relative overflow-hidden order-1 md:order-2 shadow-sm border border-neutral-100 flex items-center justify-center">
            {/* Subtle Despearl Emblem Watermark */}
            <div className="w-20 h-20 rounded-full border border-[#D4AF37]/20 flex items-center justify-center opacity-40">
              <span className="text-2xl font-black font-outfit text-[#D4AF37]">D</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col pb-10">
          
          {/* Brand & Title */}
          <div className="mb-6">
            <div className="h-3.5 w-24 rounded-full skel-luxury mb-3" />
            <div className="h-8 md:h-10 w-4/5 rounded-lg skel-luxury mb-2" />
            <div className="h-8 md:h-10 w-3/5 rounded-lg skel-luxury mb-4" />
            
            {/* Price line */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-32 rounded-lg skel-luxury" />
              <div className="h-5 w-20 rounded skel-luxury" />
              <div className="h-5 w-16 rounded-full skel-luxury" />
            </div>
            <div className="h-3 w-40 rounded skel-luxury" />
          </div>

          <hr className="border-neutral-100 mb-6" />

          {/* Color Options Skeleton */}
          <div className="mb-6">
            <div className="h-4 w-28 rounded skel-luxury mb-3" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full skel-luxury" />
              ))}
            </div>
          </div>

          {/* Size Options Skeleton */}
          <div className="mb-6">
            <div className="h-4 w-28 rounded skel-luxury mb-3" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-20 rounded-lg skel-luxury" />
              ))}
            </div>
          </div>

          {/* Pincode & Delivery Box Skeleton */}
          <div className="p-4 rounded-xl border border-neutral-100 skel-luxury mb-6 h-20" />

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3 mb-8">
            <div className="h-14 flex-1 rounded-full skel-luxury bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />
            <div className="w-14 h-14 rounded-full skel-luxury shrink-0" />
          </div>

          {/* Accordion Tabs Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl border border-neutral-100 skel-luxury" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
