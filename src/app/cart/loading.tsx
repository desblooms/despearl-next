import React from 'react';

export default function CartLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full py-8 md:py-12">
      <div className="h-8 w-44 rounded-lg skel-luxury mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-neutral-100 flex gap-4 items-center shadow-xs">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl skel-luxury shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded skel-luxury" />
                <div className="h-3 w-1/3 rounded skel-luxury" />
                <div className="h-5 w-24 rounded skel-luxury pt-1" />
              </div>
              <div className="w-24 h-9 rounded-full skel-luxury shrink-0" />
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-neutral-100 shadow-xs space-y-4">
          <div className="h-6 w-36 rounded skel-luxury mb-4" />
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded skel-luxury" />
            <div className="h-4 w-16 rounded skel-luxury" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded skel-luxury" />
            <div className="h-4 w-14 rounded skel-luxury" />
          </div>
          <hr className="border-neutral-100 my-2" />
          <div className="flex justify-between">
            <div className="h-6 w-20 rounded skel-luxury" />
            <div className="h-6 w-24 rounded skel-luxury" />
          </div>
          <div className="h-13 w-full rounded-full skel-luxury mt-4" />
        </div>
      </div>
    </div>
  );
}
