'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const pathname = usePathname();
  const { cartCount } = useStore();

  const isHome = pathname === '/';
  const isCategories = pathname.startsWith('/categories');
  const isSearch = pathname.startsWith('/search');
  const isProfile = pathname.startsWith('/profile');

  // Hide footer on specific pages
  if (pathname.startsWith('/product') || pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <nav id="app-nav" className="h-[60px] bg-white border-t border-brand-cream/50 flex items-stretch shrink-0 pb-[env(safe-area-inset-bottom)] z-40 relative md:hidden">
      <Link href="/" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[10px] font-medium ${isHome ? 'text-brand-burgundy' : 'text-gray-400'}`}>
          <Home className={`w-5 h-5 ${isHome ? 'stroke-brand-burgundy' : 'stroke-gray-400'}`} />
          <span>Home</span>
      </Link>
      <Link href="/categories" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[10px] font-medium ${isCategories ? 'text-brand-burgundy' : 'text-gray-400'}`}>
          <LayoutGrid className={`w-5 h-5 ${isCategories ? 'stroke-brand-burgundy' : 'stroke-gray-400'}`} />
          <span>Categories</span>
      </Link>
      <Link href="/search" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[10px] font-medium ${isSearch ? 'text-brand-burgundy' : 'text-gray-400'}`}>
          <Search className={`w-5 h-5 ${isSearch ? 'stroke-brand-burgundy' : 'stroke-gray-400'}`} />
          <span>Search</span>
      </Link>
      <Link href="/cart" className="flex-1 flex flex-col items-center justify-center gap-1 transition text-[10px] font-medium text-gray-400 relative">
          <ShoppingBag className="w-5 h-5 stroke-gray-400" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span id="nav-cart-badge" className="absolute top-1 right-3 w-4 h-4 bg-brand-burgundy text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
      </Link>
      <Link href="/profile" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[10px] font-medium ${isProfile ? 'text-brand-burgundy' : 'text-gray-400'}`}>
          <User className={`w-5 h-5 ${isProfile ? 'stroke-brand-burgundy' : 'stroke-gray-400'}`} />
          <span>Profile</span>
      </Link>
    </nav>
  );
}
