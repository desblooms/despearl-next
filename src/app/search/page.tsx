import React, { Suspense } from 'react';
import SearchClient from '@/components/SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><div className="animate-spin w-8 h-8 border-4 border-brand-espresso border-t-transparent rounded-full"></div></div>}>
      <SearchClient />
    </Suspense>
  );
}
