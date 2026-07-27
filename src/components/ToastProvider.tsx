'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle, AlertCircle, Heart, HeartCrack } from 'lucide-react';

export default function ToastProvider() {
  const { toastMessage } = useStore();

  const getIcon = () => {
    if (!toastMessage) return <CheckCircle className="w-4 h-4" />;
    switch (toastMessage.icon) {
      case 'alert-circle': return <AlertCircle className="w-4 h-4" />;
      case 'heart': return <Heart className="w-4 h-4" />;
      case 'heart-crack': return <HeartCrack className="w-4 h-4" />;
      case 'check-circle':
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div id="toast" className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-brand-espresso text-white px-4 py-2 rounded-lg text-sm font-bold z-[9999] transition-all duration-300 flex items-center gap-2 shadow-lg transform ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      {getIcon()}
      {toastMessage?.msg}
    </div>
  );
}
