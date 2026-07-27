'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { User, LogOut, Heart, List, MapPin, Tag, Headphones, UserPlus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, wishlist, logoutUser, setAuthOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex flex-col pb-20">
        <div className="bg-brand-burgundy px-6 py-8 md:py-12 text-center shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3 shadow-sm">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg md:text-xl font-black font-outfit text-white mb-1">Guest User</h2>
            <p className="text-[11px] text-white/70 font-medium mb-5">Sign in for a better experience</p>
            <div className="flex gap-2 justify-center w-full max-w-xs">
              <button 
                onClick={() => setAuthOpen(true)} 
                className="flex-1 py-2.5 bg-white text-brand-burgundy rounded-sm text-[12px] font-bold transition active:scale-95 shadow-sm"
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthOpen(true)} 
                className="flex-1 py-2.5 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-sm text-[12px] font-bold transition active:scale-95"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:max-w-3xl md:mx-auto w-full mt-6">
          <div className="bg-white rounded-sm shadow-sm border border-brand-cream/50 overflow-hidden mb-4">
            <div onClick={() => setAuthOpen(true)} className="flex items-center gap-4 p-3.5 border-b border-gray-50 cursor-pointer hover:bg-brand-cream/20 transition">
              <div className="w-8 h-8 rounded-sm bg-brand-cream/20 flex items-center justify-center shrink-0"><List className="w-4 h-4 text-gray-700" /></div>
              <span className="flex-1 font-bold text-[13px] text-gray-800">My Orders</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div onClick={() => setAuthOpen(true)} className="flex items-center gap-4 p-3.5 border-b border-gray-50 cursor-pointer hover:bg-brand-cream/20 transition">
              <div className="w-8 h-8 rounded-sm bg-brand-cream/20 flex items-center justify-center shrink-0"><Heart className="w-4 h-4 text-gray-700" /></div>
              <span className="flex-1 font-bold text-[13px] text-gray-800">Wishlist <span className="text-gray-400 font-medium ml-1">({wishlist.length})</span></span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-4 p-3.5 cursor-pointer hover:bg-brand-cream/20 transition">
              <div className="w-8 h-8 rounded-sm bg-brand-cream/20 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4 text-gray-700" /></div>
              <span className="flex-1 font-bold text-[13px] text-gray-800">Customer Support</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="bg-brand-burgundy rounded-sm p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 text-[#dfa054] flex items-center justify-center mx-auto mb-3"><UserPlus className="w-5 h-5" /></div>
            <h3 className="font-black font-outfit text-white mb-1.5 text-base">Join the Store</h3>
            <p className="text-[11px] text-white/70 font-medium mb-4 max-w-xs mx-auto">Create an account to track orders, save wishlist, and get exclusive deals</p>
            <button onClick={() => setAuthOpen(true)} className="px-6 py-2.5 bg-[#dfa054] hover:bg-[#c38944] text-white rounded-sm text-[12px] font-bold transition active:scale-95 shadow-sm">Create Account</button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex flex-col pb-20">
      <div className="bg-brand-burgundy px-6 py-8 md:py-12 text-center shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#dfa054] flex items-center justify-center text-white text-2xl font-black font-outfit mb-3 shadow-sm border-[3px] border-white/20">
                {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg md:text-xl font-black font-outfit text-white mb-0.5">{user.name || 'User'}</h2>
            <p className="text-[11px] text-white/70 font-medium">{user.email || ''}</p>
            {user.phone && <p className="text-[10px] text-white/50 font-bold mt-0.5 tracking-wider">{user.phone}</p>}
        </div>
      </div>

      <div className="flex-1 p-4 md:max-w-3xl md:mx-auto w-full pb-10 mt-6">
        <div className="bg-white rounded-sm shadow-sm border border-brand-cream/50 overflow-hidden mb-4">
          <Link href="/orders" className="flex items-center gap-4 p-3.5 border-b border-gray-50 cursor-pointer hover:bg-brand-cream/20 transition">
            <div className="w-8 h-8 rounded-sm bg-brand-cream flex items-center justify-center shrink-0"><List className="w-4 h-4 text-brand-burgundy" /></div>
            <span className="flex-1 font-bold text-[13px] text-gray-800">My Orders</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link href="/wishlist" className="flex items-center gap-4 p-3.5 border-b border-gray-50 cursor-pointer hover:bg-brand-cream/20 transition">
            <div className="w-8 h-8 rounded-sm bg-brand-cream flex items-center justify-center shrink-0"><Heart className="w-4 h-4 text-brand-burgundy" /></div>
            <span className="flex-1 font-bold text-[13px] text-gray-800">Wishlist <span className="text-gray-400 font-medium ml-1">({wishlist.length})</span></span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <div className="flex items-center gap-4 p-3.5 border-b border-gray-50 cursor-pointer hover:bg-brand-cream/20 transition">
            <div className="w-8 h-8 rounded-sm bg-brand-cream flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-brand-burgundy" /></div>
            <span className="flex-1 font-bold text-[13px] text-gray-800">Saved Addresses</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4 p-3.5 border-b border-gray-50 cursor-pointer hover:bg-brand-cream/20 transition">
            <div className="w-8 h-8 rounded-sm bg-[#fcf5e9] flex items-center justify-center shrink-0"><Tag className="w-4 h-4 text-[#dfa054]" /></div>
            <span className="flex-1 font-bold text-[13px] text-gray-800">Offers & Coupons</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4 p-3.5 cursor-pointer hover:bg-brand-cream/20 transition">
            <div className="w-8 h-8 rounded-sm bg-brand-cream/20 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4 text-gray-700" /></div>
            <span className="flex-1 font-bold text-[13px] text-gray-800">Customer Support</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-sm shadow-sm border border-brand-cream/50 overflow-hidden mb-8">
          <div className="flex items-center gap-4 p-3.5 cursor-pointer hover:bg-brand-cream/20 transition group" onClick={logoutUser}>
            <div className="w-8 h-8 rounded-sm bg-brand-cream/20 group-hover:bg-brand-cream/50 flex items-center justify-center shrink-0 transition"><LogOut className="w-4 h-4 text-gray-600 group-hover:text-gray-900" /></div>
            <span className="flex-1 font-bold text-[13px] text-gray-600 group-hover:text-gray-900">Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
