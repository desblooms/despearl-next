'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setIsVisible(true);
    setProgress(15);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        // Smooth exponential deceleration
        const step = (90 - prev) * 0.15;
        return Math.min(85, prev + Math.max(0.5, step));
      });
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);

    completeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setProgress(0), 200);
    }, 300);
  };

  // Listen to Next.js route transitions
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept click on internal links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const isBlank = target.getAttribute('target') === '_blank';
      const isDownload = target.hasAttribute('download');
      const isModifierKey = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (!href || isBlank || isDownload || isModifierKey) return;

      // Only handle internal routes
      if (href.startsWith('/') && !href.startsWith('/#') && href !== pathname) {
        startProgress();
      }
    };

    window.addEventListener('click', handleAnchorClick, { capture: true });
    window.addEventListener('popstate', startProgress);
    window.addEventListener('toploader-start', startProgress);
    window.addEventListener('toploader-complete', completeProgress);

    return () => {
      window.removeEventListener('click', handleAnchorClick, { capture: true });
      window.removeEventListener('popstate', startProgress);
      window.removeEventListener('toploader-start', startProgress);
      window.removeEventListener('toploader-complete', completeProgress);
      if (timerRef.current) clearInterval(timerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, [pathname]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[999999] pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-[3px] bg-gradient-to-r from-[#710014] via-[#B38F6F] to-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.85)] transition-all duration-200 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Glowing Head Particle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full blur-[1.5px] opacity-100 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37]" />
        
        {/* Trailing Shimmer Flare */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/40" />
      </div>
    </div>
  );
}
