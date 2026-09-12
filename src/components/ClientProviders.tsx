'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AuthSheet = dynamic(() => import('@/components/AuthSheet'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/ToastProvider'), { ssr: false });
const PlaceSelectorModal = dynamic(() => import('@/components/PlaceSelectorModal'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <AuthSheet />
      <ToastProvider />
      <PlaceSelectorModal />
      <CartDrawer />
    </>
  );
}
