'use client';

import React from 'react';

export default function SmoothImage({ src, alt, className, ...props }: any) {
  return (
    <img
      src={src}
      alt={alt}
      className={`opacity-0 transition-opacity duration-700 text-transparent ${className || ''}`}
      onLoad={(e) => {
        e.currentTarget.classList.remove('opacity-0');
        e.currentTarget.parentElement?.classList.remove('skel');
      }}
      {...props}
    />
  );
}
