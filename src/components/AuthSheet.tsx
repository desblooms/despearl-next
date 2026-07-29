'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

import { X, Sparkles, Star } from 'lucide-react';

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

  const inputCls = "w-full px-4 py-3.5 bg-[#f3f4f6] border border-transparent focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/20 focus:bg-white rounded-md text-[15px] font-semibold text-gray-900 outline-none transition placeholder:text-gray-400";
  const labelCls = "block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div id="auth-sheet" className={`fixed inset-0 bg-black/60 z-[500] flex items-end md:items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${authOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}>
      <div className={`relative bg-white rounded-t-2xl w-full max-w-[420px] transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] auth-panel md:rounded-2xl shadow-2xl flex flex-col ${authOpen ? 'translate-y-0 scale-100' : 'translate-y-full md:translate-y-10 md:scale-95'}`}>
        
        {/* Floating Close Button */}
        <button 
          onClick={closeAuth} 
          className="absolute -top-12 left-4 md:-left-12 md:top-0 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-20 text-gray-700 hover:scale-110"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Creative Top Banner */}
        <div className="relative bg-[#090e1f] overflow-hidden rounded-t-2xl p-8 pt-12 pb-10 text-center flex items-center justify-center">
          {/* Sparkles / Decorative Elements */}
          <Sparkles className="absolute top-6 right-8 text-purple-300 w-7 h-7 opacity-90 animate-pulse drop-shadow-md" />
          <Star className="absolute bottom-5 left-8 text-blue-200 w-4 h-4 opacity-60" />
          
          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-600/30 blur-[50px] rounded-full pointer-events-none"></div>
          
          {/* Curved Line decoration SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 150" preserveAspectRatio="none">
             <path d="M0,80 Q200,20 400,120" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          </svg>

          <h2 className="relative z-10 text-[26px] md:text-[28px] font-black text-white max-w-[250px] mx-auto leading-tight font-outfit tracking-wide drop-shadow-lg">
            Need tailored suggestions?
          </h2>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8 bg-white md:rounded-b-2xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1.5">{isLogin ? 'Log in or sign up' : 'Create an Account'}</h3>
            <p className="text-sm text-gray-500 font-medium">{isLogin ? 'Get personalised suggestions, offers & more' : 'Join us to track orders and get exclusive offers'}</p>
          </div>

          {isLogin ? (
            <div id="auth-form-login">
              <div className="mb-4">
                <input
                  type="text"
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  className={inputCls}
                  placeholder="Enter phone number or email"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doLogin()}
                  className={inputCls}
                  placeholder="Enter password"
                />
              </div>
              <button onClick={doLogin} disabled={isLoading} className="w-full py-3.5 bg-brand-burgundy hover:bg-brand-wine text-white rounded-md text-sm font-extrabold uppercase tracking-widest transition active:scale-[0.98] mb-5 shadow-sm disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <p className="text-center text-xs font-medium text-gray-500 mt-4">
                By continuing, I agree to the <br/>
                <span className="underline cursor-pointer">Terms & Conditions</span> and <span className="underline cursor-pointer">Privacy Policy</span>
              </p>
              
              <div className="mt-6 text-center">
                 <p className="text-[13px] font-medium text-gray-500">Don't have an account? <span onClick={() => setIsLogin(false)} className="text-brand-burgundy font-bold cursor-pointer hover:underline">Create one</span></p>
              </div>
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
              <button onClick={doRegister} disabled={isLoading} className="w-full py-3.5 bg-brand-burgundy hover:bg-brand-wine text-white rounded-md text-sm font-extrabold uppercase tracking-widest transition active:scale-[0.98] mb-5 shadow-sm disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
              
              <p className="text-center text-[13px] font-medium text-gray-500">Already have an account? <span onClick={() => setIsLogin(true)} className="text-brand-burgundy font-bold cursor-pointer hover:underline">Sign in</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
