'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, ArrowLeft, MapPin, ChevronDown, Heart, User, Sparkles, Building2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getOptimizedImageUrl } from '@/utils/image';

export default function Header({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cartCount, 
    cartTotal,
    wishlist, 
    user, 
    selectedPlace, 
    setPlaceModalOpen, 
    setAuthOpen 
  } = useStore();

  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isCategories = pathname.startsWith('/categories');
  const isProfile = pathname.startsWith('/profile');
  const isInnerPage = ['/product', '/cart', '/checkout', '/orders'].some(path => pathname.startsWith(path));

  // Listen to keyboard shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <header id="app-header" className="w-full shrink-0 sticky top-0 z-50 transition-all duration-300">
      
      {/* 1. Top Utility & Location Ticker Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-espresso to-brand-burgundy text-white text-[11px] font-medium py-1.5 px-4 md:px-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Announcement Ticker */}
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/15 text-brand-rose px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 animate-pulse" /> Express
            </span>
            <span className="truncate opacity-90 font-outfit">
              Fast Express Delivery across all 14 Districts of Kerala & Free Store Pickup
            </span>
          </div>

          {/* Location & Support Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Desktop Location Selector Trigger */}
            <button
              onClick={() => setPlaceModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-1 rounded-full text-white transition cursor-pointer group"
              title="Change Delivery Location or Store Branch"
            >
              {selectedPlace?.type === 'store' ? (
                <Building2 className="w-3.5 h-3.5 text-brand-rose group-hover:scale-110 transition" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-brand-rose group-hover:scale-110 transition" />
              )}
              <span className="text-[11px] font-bold max-w-[140px] truncate">
                {selectedPlace?.name || 'Select Location'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/70 group-hover:translate-y-0.5 transition" />
            </button>

            <span className="hidden md:inline-block text-white/30">|</span>

            {/* Currency / Language indicator */}
            <div className="hidden md:flex items-center gap-1 text-white/80 text-[11px] font-semibold">
              <span>USD ($)</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Luxury Header Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-brand-cream/80 px-4 md:px-6 h-[62px] md:h-[68px] flex items-center shadow-xs">
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto gap-4">
          
          {/* Left side (Mobile Back or Desktop Logo) */}
          <div className="flex items-center gap-3">
            {isInnerPage && (
              <button 
                onClick={() => router.back()} 
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-800 hover:bg-brand-cream/50 transition cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
             <Link href="/" className="font-black text-xl md:text-2xl tracking-tighter cursor-pointer text-gray-900 flex items-center font-outfit group">
              {logoUrl ? (
                <img src={getOptimizedImageUrl(logoUrl, 160, 85)} alt="Store Logo" className="h-8 md:h-10 object-contain group-hover:opacity-90 transition" />
              ) : (
                <>
                  <span className="text-gray-900 group-hover:text-brand-burgundy transition-colors">Despearl</span>
                  <span className="text-brand-burgundy font-serif font-bold text-2xl group-hover:rotate-12 transition-transform inline-block">.</span>
                </>
              )}
            </Link>
          </div>
          
          {/* Center (Desktop Nav Links) */}
          <nav id="app-header-desktop-nav" className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`font-bold text-xs uppercase tracking-widest cursor-pointer transition-all py-1 relative ${
                isHome ? 'text-brand-burgundy font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-burgundy' : 'text-gray-600 hover:text-brand-burgundy'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className={`font-bold text-xs uppercase tracking-widest cursor-pointer transition-all py-1 relative ${
                isShop ? 'text-brand-burgundy font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-burgundy' : 'text-gray-600 hover:text-brand-burgundy'
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/categories" 
              className={`font-bold text-xs uppercase tracking-widest cursor-pointer transition-all py-1 relative ${
                isCategories ? 'text-brand-burgundy font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-burgundy' : 'text-gray-600 hover:text-brand-burgundy'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/profile" 
              className={`font-bold text-xs uppercase tracking-widest cursor-pointer transition-all py-1 relative ${
                isProfile ? 'text-brand-burgundy font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-burgundy' : 'text-gray-600 hover:text-brand-burgundy'
              }`}
            >
              Account
            </Link>
          </nav>

          {/* Right side (Interactive Search, Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-2.5 md:gap-3">
            
            {/* Search Box Trigger (Desktop & Tablet) */}
            <Link 
              href="/search" 
              className="hidden lg:flex items-center justify-between gap-3 bg-gray-50 hover:bg-brand-cream/40 border border-gray-200 hover:border-brand-rose/40 rounded-full px-3.5 py-1.5 cursor-pointer text-gray-500 text-xs font-medium transition w-[210px] shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-burgundy transition-colors" />
                <span className="truncate">Search products...</span>
              </div>
              <kbd className="hidden sm:inline-block bg-white text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 shadow-2xs">
                ⌘K
              </kbd>
            </Link>

            {/* Mobile Search Icon */}
            <Link 
              href="/search" 
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Wishlist Quick Action */}
            <Link 
              href="/profile" 
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-700 hover:bg-brand-cream/50 transition relative group cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 group-hover:text-brand-burgundy transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-rose text-gray-900 rounded-full text-[9px] font-bold flex items-center justify-center border border-white shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <Link 
              href="/cart" 
              className="flex items-center gap-2 bg-brand-burgundy text-white hover:bg-brand-wine px-3 py-1.5 rounded-full transition shadow-sm group cursor-pointer relative"
              title="Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white group-hover:scale-105 transition" />
                {cartCount > 0 && (
                  <span id="cart-badge" className="absolute -top-2 -right-2.5 w-4.5 h-4.5 bg-brand-rose text-gray-900 rounded-full text-[9px] font-black flex items-center justify-center border border-white shadow-xs">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold font-mono tracking-tight ml-0.5">
                ${cartTotal > 0 ? cartTotal.toFixed(2) : '0.00'}
              </span>
            </Link>

            {/* User Account Sheet Trigger */}
            <button
              onClick={() => {
                if (user) {
                  router.push('/profile');
                } else {
                  setAuthOpen(true);
                }
              }}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-brand-cream/60 border border-gray-200 flex items-center justify-center text-gray-800 transition cursor-pointer shrink-0 ml-0.5"
              title={user ? `Signed in as ${user.name}` : "Sign In / Register"}
            >
              {user ? (
                <span className="text-xs font-black text-brand-burgundy uppercase font-outfit">
                  {user.name.charAt(0)}
                </span>
              ) : (
                <User className="w-4 h-4 text-gray-600" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* 3. Mobile Location Bar (Visible on mobile under header) */}
      <div className="sm:hidden bg-brand-cream/40 border-b border-brand-rose/20 px-4 py-1.5 flex items-center justify-between text-xs text-gray-700">
        <button
          onClick={() => setPlaceModalOpen(true)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800 truncate cursor-pointer hover:text-brand-burgundy transition"
        >
          <MapPin className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
          <span className="text-gray-500 font-normal">Deliver to:</span>
          <span className="truncate max-w-[180px] font-outfit text-brand-burgundy">
            {selectedPlace?.name || 'Select Location'}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
        </button>
        <span className="text-[10px] text-brand-rose font-bold uppercase tracking-wider">
          {selectedPlace?.type === 'store' ? 'Store Pickup' : 'Express Delivery'}
        </span>
      </div>

    </header>
  );
}
