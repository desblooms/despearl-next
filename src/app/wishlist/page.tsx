'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Heart, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-brand-cream/50">
            <Heart className="w-8 h-8 opacity-50 text-gray-400" />
        </div>
        <h3 className="text-lg font-black font-outfit text-gray-900 mb-2">Wishlist is Empty</h3>
        <p className="text-[13px] mb-6 max-w-[250px] font-medium text-gray-500">You haven't saved any items yet. Start exploring and save your favorites!</p>
        <Link href="/shop" className="px-8 py-3 bg-brand-burgundy text-white rounded-sm text-[13px] font-bold shadow-sm transition active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] pb-20">
      <div className="max-w-[1440px] mx-auto pt-6 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/profile')} className="w-9 h-9 rounded-full bg-white border border-brand-rose/20 flex items-center justify-center hover:bg-brand-cream/20 transition active:scale-95 shrink-0">
            <ArrowLeft className="w-4 h-4 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-outfit text-gray-900">My Wishlist</h1>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{wishlist.length} items saved</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
