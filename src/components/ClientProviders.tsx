'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AuthSheet = dynamic(() => import('@/components/AuthSheet'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/ToastProvider'), { ssr: false });
const PlaceSelectorModal = dynamic(() => import('@/components/PlaceSelectorModal'), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <AuthSheet />
      <ToastProvider />
      <PlaceSelectorModal />
    </>
  );
}
