'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { User, LogOut, Heart, List, MapPin, Tag, Headphones, UserPlus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, wishlist, logoutUser, setAuthOpen, setAuthMode } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col pb-20">
        <div className="bg-white px-6 pt-12 pb-10 md:pt-16 md:pb-12 text-center shadow-sm relative overflow-hidden rounded-b-[2.5rem] border-b border-black/5 mb-6">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center text-brand-rose mb-5 shadow-sm border border-brand-rose/20">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-outfit text-brand-espresso mb-1.5 tracking-tight">Welcome Guest</h2>
            <p className="text-sm text-gray-500 font-medium mb-8">Sign in for a premium experience</p>
            <div className="flex gap-4 justify-center w-full max-w-sm">
              <button 
                onClick={() => { setAuthMode('login'); setAuthOpen(true); }} 
                className="flex-1 py-3.5 bg-brand-espresso hover:bg-black text-white rounded-xl text-sm font-bold transition active:scale-95 shadow-md"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setAuthOpen(true); }} 
                className="flex-1 py-3.5 bg-white text-brand-espresso border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-bold transition active:scale-95 shadow-sm"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:max-w-3xl md:mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden mb-5">
            <div onClick={() => setAuthOpen(true)} className="flex items-center gap-3 py-3.5 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
              <List className="w-5 h-5 text-gray-500 shrink-0" />
              <span className="flex-1 font-semibold text-[13px] text-gray-800">My Orders</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
            <div onClick={() => setAuthOpen(true)} className="flex items-center gap-3 py-3.5 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
              <Heart className="w-5 h-5 text-gray-500 shrink-0" />
              <span className="flex-1 font-semibold text-[13px] text-gray-800">Wishlist <span className="text-gray-400 font-medium ml-1">({wishlist.length})</span></span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex items-center gap-3 py-3.5 px-4 cursor-pointer hover:bg-gray-50 transition">
              <Headphones className="w-5 h-5 text-gray-500 shrink-0" />
              <span className="flex-1 font-semibold text-[13px] text-gray-800">Customer Support</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-background text-brand-burgundy flex items-center justify-center mx-auto mb-4"><UserPlus className="w-6 h-6" /></div>
            <h3 className="font-black font-outfit text-brand-espresso mb-2 text-lg">Join the Club</h3>
            <p className="text-xs text-gray-500 font-medium mb-5 max-w-xs mx-auto leading-relaxed">Create an account to track orders, save your wishlist, and unlock exclusive rewards.</p>
            <button onClick={() => { setAuthMode('register'); setAuthOpen(true); }} className="w-full max-w-[200px] py-3 bg-brand-espresso hover:bg-black text-white rounded-xl text-sm font-bold transition active:scale-95 shadow-md">Create Account</button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col pb-20">
      <div className="bg-white px-6 pt-12 pb-10 md:pt-16 md:pb-12 text-center shadow-sm relative overflow-hidden rounded-b-[2.5rem] border-b border-black/5 mb-6">
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center text-brand-burgundy text-4xl font-black font-outfit mb-4 shadow-sm border border-brand-rose/30">
                {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-outfit text-brand-espresso mb-1 tracking-tight">{user.name || 'User'}</h2>
            <p className="text-sm text-gray-500 font-medium">{user.email || ''}</p>
            {user.phone && <p className="text-xs text-brand-rose font-bold mt-2 tracking-widest uppercase">{user.phone}</p>}
        </div>
      </div>

      <div className="flex-1 p-4 md:max-w-3xl md:mx-auto w-full pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden mb-5">
          <Link href="/orders" className="flex items-center gap-3 py-3.5 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <List className="w-5 h-5 text-gray-500 shrink-0" />
            <span className="flex-1 font-semibold text-[13px] text-gray-800">My Orders</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 py-3.5 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <Heart className="w-5 h-5 text-brand-burgundy shrink-0" />
            <span className="flex-1 font-semibold text-[13px] text-gray-800">Wishlist <span className="text-gray-400 font-medium ml-1">({wishlist.length})</span></span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
          <Link href="/profile/addresses" className="flex items-center gap-3 py-3.5 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
            <span className="flex-1 font-semibold text-[13px] text-gray-800">Saved Addresses</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
          <div className="flex items-center gap-3 py-3.5 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <Tag className="w-5 h-5 text-brand-sunshine shrink-0" />
            <span className="flex-1 font-semibold text-[13px] text-gray-800">Offers & Coupons</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center gap-3 py-3.5 px-4 cursor-pointer hover:bg-gray-50 transition">
            <Headphones className="w-5 h-5 text-gray-500 shrink-0" />
            <span className="flex-1 font-semibold text-[13px] text-gray-800">Customer Support</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden mb-8">
          <div className="flex items-center gap-3 py-3.5 px-4 cursor-pointer hover:bg-red-50 transition group" onClick={logoutUser}>
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 shrink-0 transition-colors" />
            <span className="flex-1 font-semibold text-[13px] text-gray-600 group-hover:text-red-600 transition-colors">Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
