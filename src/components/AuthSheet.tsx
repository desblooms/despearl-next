'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function AuthSheet() {
  const { authOpen, setAuthOpen, loginUser, toast } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const closeAuth = () => setAuthOpen(false);

  const doLogin = async () => {
    if (!email || !password) {
      toast('Please fill all fields', 'alert-circle');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customer.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        loginUser({ name: data.name, email: data.email, token: data.token });
        closeAuth();
        toast('Welcome back, ' + (data.name || '') + '!');
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast(data.message || 'Login failed', 'alert-circle');
      }
    } catch (e) {
      toast('Network error', 'alert-circle');
    }
    setIsLoading(false);
  };

  const doRegister = async () => {
    if (!name || !email || !password) {
      toast('Please fill all required fields', 'alert-circle');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customer.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        loginUser({ name, email, phone, token: data.token });
        closeAuth();
        toast('Account created! Welcome ' + name);
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast(data.message || 'Registration failed', 'alert-circle');
      }
    } catch (e) {
      toast('Network error', 'alert-circle');
    }
    setIsLoading(false);
  };

  return (
    <div id="auth-sheet" className={`fixed inset-0 bg-black/50 z-[500] flex items-end justify-center backdrop-blur-sm transition-opacity duration-300 ${authOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}>
      <div className={`bg-white rounded-t-2xl p-6 w-full max-w-[400px] transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] auth-panel md:rounded-xl md:mb-auto md:mt-20 ${authOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden"></div>
        <h2 className="text-lg font-black mb-1 text-gray-900" id="auth-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        <p className="text-[13px] text-gray-500 font-medium mb-6" id="auth-subtitle">Sign in to track your orders and save your wishlist</p>
        
        {isLogin ? (
          <div id="auth-form-login">
            <div className="mb-3">
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition" placeholder="you@email.com" />
            </div>
            <div className="mb-5">
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition" placeholder="••••••••" />
            </div>
            <button onClick={doLogin} disabled={isLoading} className="w-full py-3 bg-brand-espresso hover:bg-black text-white rounded-xl text-sm font-bold transition active:scale-[0.98] mb-4 shadow-sm disabled:opacity-70">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-[13px] font-medium text-gray-500">Don't have an account? <span onClick={() => setIsLogin(false)} className="text-gray-900 font-bold cursor-pointer">Create one</span></p>
          </div>
        ) : (
          <div id="auth-form-register">
            <div className="mb-3">
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition" placeholder="Your Name" />
            </div>
            <div className="mb-3">
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition" placeholder="you@email.com" />
            </div>
            <div className="mb-3">
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Phone</label>
                <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition" placeholder="+91 9999999999" />
            </div>
            <div className="mb-5">
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition" placeholder="Min 6 characters" />
            </div>
            <button onClick={doRegister} disabled={isLoading} className="w-full py-3 bg-brand-espresso hover:bg-black text-white rounded-xl text-sm font-bold transition active:scale-[0.98] mb-4 shadow-sm disabled:opacity-70">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-[13px] font-medium text-gray-500">Already have an account? <span onClick={() => setIsLogin(true)} className="text-gray-900 font-bold cursor-pointer">Sign in</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
