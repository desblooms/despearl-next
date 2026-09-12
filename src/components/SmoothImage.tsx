'use client';

import React, { useRef, useEffect } from 'react';

export default function SmoothImage({ src, alt, className, ...props }: any) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      imgRef.current.classList.remove('opacity-0');
      imgRef.current.parentElement?.classList.remove('skel');
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      {...props}
      className={`opacity-0 transition-opacity duration-700 text-transparent ${className || ''}`}
      onLoad={(e) => {
        e.currentTarget.classList.remove('opacity-0');
        e.currentTarget.parentElement?.classList.remove('skel');
        props.onLoad?.(e);
      }}
      onError={(e) => {
        e.currentTarget.classList.remove('opacity-0');
        e.currentTarget.parentElement?.classList.remove('skel');
        props.onError?.(e);
      }}
    />
  );
}
