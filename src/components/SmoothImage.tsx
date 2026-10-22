'use client';

import React, { useRef, useEffect, useState } from 'react';
import { getOptimizedImageUrl } from '@/utils/image';

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='%2394a3b8' font-size='36'%3E📦%3C/text%3E%3C/svg%3E`;

interface SmoothImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
}

export default function SmoothImage({ src, alt, className, onLoad, onError, ...props }: SmoothImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  // Resolve through proxy on client — src coming in may already be proxied by server component
  // But if it's a raw external URL (e.g., from localStorage cart), proxy it here
  const resolvedSrc = src ? getOptimizedImageUrl(src) : FALLBACK;
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  // Update if src prop changes (e.g., gallery navigation)
  useEffect(() => {
    const next = src ? getOptimizedImageUrl(src) : FALLBACK;
    setCurrentSrc(next);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      imgRef.current.classList.remove('opacity-0');
      imgRef.current.parentElement?.classList.remove('skel');
    }
  }, [currentSrc]);

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt ?? ''}
      {...props}
      className={`opacity-0 transition-opacity duration-700 text-transparent ${className || ''}`}
      onLoad={(e) => {
        e.currentTarget.classList.remove('opacity-0');
        e.currentTarget.parentElement?.classList.remove('skel');
        onLoad?.(e);
      }}
      onError={(e) => {
        // On error, show fallback SVG placeholder
        const target = e.currentTarget;
        if (target.src !== FALLBACK) {
          target.src = FALLBACK;
        }
        target.classList.remove('opacity-0');
        target.parentElement?.classList.remove('skel');
        onError?.(e);
      }}
    />
  );
}
