'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import TopLoader from '@/components/TopLoader';

const AuthSheet = dynamic(() => import('@/components/AuthSheet'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/ToastProvider'), { ssr: false });
const PlaceSelectorModal = dynamic(() => import('@/components/PlaceSelectorModal'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <Suspense fallback={null}>
        <TopLoader />
      </Suspense>
      <AuthSheet />
      <ToastProvider />
      <PlaceSelectorModal />
      <CartDrawer />
    </>
  );
}
