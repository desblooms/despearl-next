'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function AuthSheet() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, loginUser, toast } = useStore();
  const isLogin = authMode === 'login';
  const setIsLogin = (val: boolean) => setAuthMode(val ? 'login' : 'register');
  const [isLoading, setIsLoading] = useState(false);

  // Login fields — phone or email
  const [loginId, setLoginId] = useState(''); // phone or email
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // optional
  const [regPassword, setRegPassword] = useState('');

  const closeAuth = () => setAuthOpen(false);

  const doLogin = async () => {
    if (!loginId || !password) {
      toast('Please enter your phone/email and password', 'alert-circle');
      return;
    }
    setIsLoading(true);
    try {
      // Detect if loginId is a phone number or email
      const isPhone = /^\+?\d{7,15}$/.test(loginId.replace(/\s/g, ''));
      const body = isPhone
        ? { phone: loginId, password }
        : { email: loginId, password };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customer.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.status === 'success') {
        loginUser({
          name: data.name,
          email: data.email || '',
          phone: data.phone || loginId,
          token: data.token
        });
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
    if (!name || !phone || !regPassword) {
      toast('Name, Phone and Password are required', 'alert-circle');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customer.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: regPassword })
      });
      const data = await res.json();
      if (data.status === 'success') {
        loginUser({ name, email: email || '', phone, token: data.token });
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

  const inputCls = "w-full px-4 py-3 bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl text-[16px] font-bold text-gray-900 outline-none transition";
  const labelCls = "block text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-1.5";

  return (
    <div id="auth-sheet" className={`fixed inset-0 bg-black/50 z-[500] flex items-end justify-center backdrop-blur-sm transition-opacity duration-300 ${authOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}>
      <div className={`bg-white rounded-t-2xl p-6 w-full max-w-[400px] transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] auth-panel md:rounded-xl md:mb-auto md:mt-20 ${authOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden"></div>
        <h2 className="text-lg font-black mb-1 text-gray-900" id="auth-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        <p className="text-[13px] text-gray-500 font-medium mb-6" id="auth-subtitle">
          {isLogin ? 'Sign in with your phone number or email' : 'Create your account to track orders'}
        </p>

        {isLogin ? (
          <div id="auth-form-login">
            <div className="mb-3">
              <label className={labelCls}>Phone or Email</label>
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className={inputCls}
                placeholder="Phone number or email"
              />
            </div>
            <div className="mb-5">
              <label className={labelCls}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>
            <button onClick={doLogin} disabled={isLoading} className="w-full py-3 bg-brand-espresso hover:bg-black text-white rounded-xl text-sm font-bold transition active:scale-[0.98] mb-4 shadow-sm disabled:opacity-70">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-[13px] font-medium text-gray-500">Don't have an account? <span onClick={() => setIsLogin(false)} className="text-gray-900 font-bold cursor-pointer">Create one</span></p>
          </div>
        ) : (
          <div id="auth-form-register">
            <div className="mb-3">
              <label className={labelCls}>Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your Name" />
            </div>
            <div className="mb-3">
              <label className={labelCls}>Phone Number *</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="10-digit mobile number" />
            </div>
            <div className="mb-3">
              <label className={labelCls}>Email <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@email.com" />
            </div>
            <div className="mb-5">
              <label className={labelCls}>Password *</label>
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className={inputCls} placeholder="Min 6 characters" />
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
