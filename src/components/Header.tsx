'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Header({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setDrawerOpen, drawerOpen } = useStore();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isCategories = pathname.startsWith('/categories');
  const isProfile = pathname.startsWith('/profile');
  const isInnerPage = ['/product', '/cart', '/checkout', '/orders'].some(path => pathname.startsWith(path));

  return (
    <header id="app-header" className="bg-white border-b border-brand-cream/50 flex items-center px-4 md:px-6 h-[60px] md:h-[64px] shrink-0 sticky top-0 z-50 transition-all">
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto gap-4">
        
        {/* Left side (Mobile Back or Desktop Logo) */}
        <div className="flex items-center gap-4">
          {isInnerPage && (
            <button onClick={() => router.back()} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-800 hover:bg-brand-cream/50 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <Link href="/" className="font-black text-xl md:text-2xl tracking-tighter cursor-pointer text-gray-900 flex items-center font-outfit">
              {logoUrl ? <img src={logoUrl} alt="Store Logo" className="h-8 md:h-10 object-contain" /> : <><span className="text-gray-900">Despearl</span><span className="text-brand-burgundy">.</span></>}
          </Link>
        </div>
        
        {/* Center (Desktop Nav) */}
        <div id="app-header-desktop-nav" className="hidden md:flex items-center gap-6">
            <Link href="/" className={`font-semibold text-sm cursor-pointer transition py-2 ${isHome ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-gray-500 hover:text-brand-burgundy'}`}>Home</Link>
            <Link href="/shop" className={`font-semibold text-sm cursor-pointer transition py-2 ${isShop ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-gray-500 hover:text-brand-burgundy'}`}>Shop</Link>
            <Link href="/categories" className={`font-semibold text-sm cursor-pointer transition py-2 ${isCategories ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-gray-500 hover:text-brand-burgundy'}`}>Categories</Link>
            <Link href="/profile" className={`font-semibold text-sm cursor-pointer transition py-2 ${isProfile ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-gray-500 hover:text-brand-burgundy'}`}>Account</Link>
        </div>

        {/* Right side (Search, Cart) */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/search" className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-brand-cream/50 transition md:hidden">
              <Search className="w-4 h-4" />
          </Link>
          <Link href="/search" className="hidden md:flex items-center gap-2 bg-brand-cream/20 border border-brand-rose/20 rounded-full px-3 py-1.5 cursor-pointer text-gray-500 text-[13px] font-medium hover:bg-brand-cream/50 transition w-[200px]">
              <Search className="w-4 h-4" />
              <span>Search...</span>
          </Link>
          <Link href="/cart" className="w-9 h-9 flex items-center justify-center rounded-full text-gray-800 hover:bg-brand-cream/50 transition relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span id="cart-badge" className="absolute top-0 right-0 w-4 h-4 bg-brand-burgundy text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
          </Link>
        </div>
      </div>
    </header>
  );
}
