'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  logoUrl?: string;
}

export default function MainLayout({ children, logoUrl }: MainLayoutProps) {
  const pathname = usePathname();
  const isReels = pathname?.startsWith('/reels');

  // Reels page layout: completely distraction-free, 100% standalone page
  // No Header, No Footer, No Mobile Bottom Navigation, No layout paddings
  if (isReels) {
    return (
      <div id="app" className="w-full min-h-screen bg-black relative m-0 p-0 overflow-hidden">
        <main id="app-main" className="w-full h-full min-h-screen p-0 m-0 bg-black">
          {children}
        </main>
      </div>
    );
  }

  // Standard e-commerce store layout with Header, Main with bottom nav padding, and Footer
  return (
    <div id="app" className="flex flex-col min-h-screen w-full mx-auto bg-white relative transition-all duration-300">
      <Header logoUrl={logoUrl} />
      <main id="app-main" className="flex-1 overflow-x-hidden relative pb-[96px] md:pb-0">
        {children}
      </main>
      <Footer logoUrl={logoUrl} />
    </div>
  );
}
