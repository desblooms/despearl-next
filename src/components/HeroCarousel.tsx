"use client";

import React, { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function HeroCarousel({ banners = [] }: { banners: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setCurrentIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative h-[400px] md:h-[600px] bg-brand-espresso overflow-hidden group">
      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container flex w-full h-full">
          {banners.map((banner, index) => (
            <div
              key={banner.id || index}
              className="embla__slide flex-[0_0_100%] min-w-0 relative w-full h-full"
            >
              <img 
                src={banner.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000'} 
                className="absolute inset-0 w-full h-full object-cover" 
                alt={banner.title || "Hero Banner"} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6">
                  <div className="max-w-xl text-left relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white text-gray-900 rounded-md px-3 py-1 text-[10px] font-bold mb-4 tracking-widest uppercase shadow-sm">
                      New Collection
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-4 tracking-tighter text-white whitespace-pre-line">
                      {banner.title || 'Elevate Your\nLiving Space'}
                    </h1>
                    <p className="text-sm md:text-lg text-white/90 mb-8 font-medium leading-relaxed drop-shadow-sm">
                      {banner.subtitle || 'Discover premium furniture pieces designed to bring comfort, elegance, and modern aesthetics to your home.'}
                    </p>
                    <Link href={banner.link || '/categories'} className="bg-white hover:bg-brand-cream/50 text-gray-900 px-8 py-4 rounded-xl text-sm font-bold w-max flex items-center gap-2 transition active:scale-95 shadow-lg inline-flex group/btn">
                      {banner.button_text || 'Shop Collection'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={scrollPrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi && emblaApi.scrollTo(i)}
                className={`transition-all rounded-full ${
                  i === currentIndex ? 'w-8 h-1.5 bg-white' : 'w-2 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
