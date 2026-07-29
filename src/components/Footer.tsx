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
    <nav id="app-nav" className="h-[60px] bg-white border-t border-brand-cream/50 flex items-stretch shrink-0 pb-[env(safe-area-inset-bottom)] z-50 fixed bottom-0 left-0 right-0 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <Link href="/" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[11px] font-bold ${isHome ? 'text-brand-burgundy' : 'text-gray-600 hover:text-gray-900'}`}>
          <Home className={`w-5 h-5 ${isHome ? 'stroke-brand-burgundy' : 'stroke-gray-600'}`} />
          <span>Home</span>
      </Link>
      <Link href="/categories" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[11px] font-bold ${isCategories ? 'text-brand-burgundy' : 'text-gray-600 hover:text-gray-900'}`}>
          <LayoutGrid className={`w-5 h-5 ${isCategories ? 'stroke-brand-burgundy' : 'stroke-gray-600'}`} />
          <span>Categories</span>
      </Link>
      <Link href="/search" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[11px] font-bold ${isSearch ? 'text-brand-burgundy' : 'text-gray-600 hover:text-gray-900'}`}>
          <Search className={`w-5 h-5 ${isSearch ? 'stroke-brand-burgundy' : 'stroke-gray-600'}`} />
          <span>Search</span>
      </Link>
      <Link href="/cart" className="flex-1 flex flex-col items-center justify-center gap-1 transition text-[11px] font-bold text-gray-600 hover:text-gray-900 relative">
          <ShoppingBag className="w-5 h-5 stroke-gray-600" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span id="nav-cart-badge" className="absolute top-1 right-3 w-4 h-4 bg-brand-burgundy text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
      </Link>
      <Link href="/profile" className={`flex-1 flex flex-col items-center justify-center gap-1 transition text-[11px] font-bold ${isProfile ? 'text-brand-burgundy' : 'text-gray-600 hover:text-gray-900'}`}>
          <User className={`w-5 h-5 ${isProfile ? 'stroke-brand-burgundy' : 'stroke-gray-600'}`} />
          <span>Account</span>
      </Link>
    </nav>
  );
}
