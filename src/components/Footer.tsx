'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User, ListTodo } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const pathname = usePathname();
  const { cartCount } = useStore();

  const isHome = pathname === '/';
  const isCategories = pathname.startsWith('/categories');
  const isOrders = pathname.startsWith('/orders');
  const isProfile = pathname.startsWith('/profile');

  // Hide footer on specific checkout/order pages to prevent layout clashing
  if (
    pathname.startsWith('/product') || 
    pathname.startsWith('/cart') || 
    pathname.startsWith('/checkout') || 
    pathname.match(/\/orders\/\d+/)
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <nav 
        id="app-nav" 
        className="pointer-events-auto w-full max-w-[420px] bg-white border border-gray-150 rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-2.5 flex items-center select-none transition-all duration-300"
      >
        {/* Bottom Tab Options Row */}
        <div className="flex items-center justify-between w-full">
          
          {/* Home Tab */}
          <Link 
            href="/" 
            className="flex flex-col items-center justify-center gap-1 flex-1 transition"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isHome ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <Home className="w-4.5 h-4.5" />
            </div>
            <span className={`text-[10px] font-bold tracking-wide transition-colors ${isHome ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
              Home
            </span>
          </Link>

          {/* Categories Tab */}
          <Link 
            href="/categories" 
            className="flex flex-col items-center justify-center gap-1 flex-1 transition"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isCategories ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid className="w-4.5 h-4.5" />
            </div>
            <span className={`text-[10px] font-bold tracking-wide transition-colors ${isCategories ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
              Categories
            </span>
          </Link>

          {/* Centerpiece Floating Action Button (Cart Trigger) */}
          <Link 
            href="/cart" 
            className="relative flex items-center justify-center w-[56px] h-[56px] -mt-8 rounded-full bg-brand-burgundy hover:opacity-95 active:scale-95 shadow-md shadow-brand-burgundy/40 transition duration-300 mx-2 shrink-0 border-[4px] border-white z-50"
          >
            <ShoppingBag className="w-6 h-6 text-white stroke-[2.5px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 px-1 bg-brand-espresso text-white rounded-full text-[9px] font-black flex items-center justify-center border-[1.5px] border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Orders Tab */}
          <Link 
            href="/orders" 
            className="flex flex-col items-center justify-center gap-1 flex-1 transition"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isOrders ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <ListTodo className="w-4.5 h-4.5" />
            </div>
            <span className={`text-[10px] font-bold tracking-wide transition-colors ${isOrders ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
              Orders
            </span>
          </Link>

          {/* Account Profile Tab */}
          <Link 
            href="/profile" 
            className="flex flex-col items-center justify-center gap-1 flex-1 transition"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isProfile ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <User className="w-4.5 h-4.5" />
            </div>
            <span className={`text-[10px] font-bold tracking-wide transition-colors ${isProfile ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
              Account
            </span>
          </Link>

        </div>
      </nav>
    </div>
  );
}
