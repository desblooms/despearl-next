"use client";

import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getOptimizedImageUrl } from '@/utils/image';

export const DEFAULT_HERO_BANNERS = [
  {
    id: 1,
    image: 'https://admin.despearl.com/public/images/banner-1789217259-8116.png',
    title: 'Modern Sofas',
    subtitle: 'Elegant Design, Premium Comfort & Timeless Style.',
    button_text: 'Shop Now',
    link: '/categories',
    sort_order: 0
  },
  {
    id: 2,
    image: 'https://admin.despearl.com/public/images/banner-1789199784-2464.webp',
    title: 'Dining Tables',
    subtitle: 'Modern Design, Lasting Quality & Elegant Style.',
    button_text: 'Shop Now',
    link: '/categories',
    sort_order: 1
  },
  {
    id: 3,
    image: 'https://admin.despearl.com/public/images/banner-1789202089-1810.webp',
    title: 'Premium Bed Frames',
    subtitle: 'Elegant Design, Comfort & Timeless Luxury.',
    button_text: 'Shop Now',
    link: '/categories',
    sort_order: 2
  }
];

export default function HeroCarousel({ banners = [] }: { banners?: any[] }) {
  const activeBanners = useMemo(() => {
    return (banners && banners.length > 0) ? banners : DEFAULT_HERO_BANNERS;
  }, [banners]);

  // Stable Autoplay plugin reference (5s interval, pauses on hover, resumes on interaction)
  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      duration: 25,
      skipSnaps: false
    }, 
    [autoplay.current]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [progressKey, setProgressKey] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const snapIndex = emblaApi.selectedScrollSnap();
    setCurrentIndex(snapIndex);
    setProgressKey(prev => prev + 1);
  }, [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi, onInit, onSelect]);

  // Re-init whenever banner data changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, activeBanners]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      autoplay.current?.reset();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      autoplay.current?.reset();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      autoplay.current?.reset();
    }
  }, [emblaApi]);

  return (
    <div className="w-full relative aspect-[16/9] md:aspect-[1920/900] bg-brand-espresso overflow-hidden group select-none">
      
      {/* Embla Viewport */}
      <div className="w-full h-full overflow-hidden" ref={emblaRef}>
        
        {/* Embla Flex Container (Supports touch-pan-y and mouse drag) */}
        <div className="flex h-full touch-pan-y select-none">
          {activeBanners.map((banner, index) => {
            const isFirst = index === 0;
            const bannerSrc = getOptimizedImageUrl(banner.image, 1920, 85);

            return (
              <div
                key={banner.id || index}
                className="relative flex-[0_0_100%] min-w-0 h-full w-full select-none"
              >
                {/* Background Banner Image */}
                <img
                  src={bannerSrc}
                  alt={banner.title || 'Featured collection preview'}
                  draggable={false}
                  loading={isFirst ? 'eager' : 'lazy'}
                  decoding={isFirst ? 'sync' : 'async'}
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=1920';
                  }}
                />

                {/* Dark Vignette Overlay for High-Contrast Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent md:from-black/70 md:via-black/30 md:to-transparent md:to-60% pointer-events-none" />

                {/* Text Content Overlay */}
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6">
                    <div className="w-[60%] sm:w-[50%] md:w-full md:max-w-xl text-left relative z-10 flex flex-col items-start pointer-events-auto">
                      
                      <div className="inline-flex items-center gap-1.5 bg-[#A67C2E] text-white rounded px-2 py-0.5 text-[8px] md:text-[9px] font-semibold mb-1.5 md:mb-4 tracking-[0.2em] uppercase shadow-sm">
                        New Collection
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-bold md:font-light md:text-5xl lg:text-7xl leading-tight md:leading-none mb-1 md:mb-2 tracking-wide md:tracking-[-0.04em] text-white whitespace-pre-line drop-shadow-md">
                        {banner.title || 'Elevate Your\nLiving Space'}
                      </h1>

                      <p className="hidden md:block text-base lg:text-lg text-white/90 mb-6 font-normal leading-relaxed drop-shadow-sm max-w-lg">
                        {banner.subtitle || 'Discover premium furniture pieces designed to bring comfort, elegance, and modern aesthetics to your home.'}
                      </p>

                      <Link 
                        href={banner.link || '/categories'} 
                        className="mt-2 md:mt-4 bg-brand-burgundy text-white hover:bg-brand-burgundy/90 px-4 py-2 md:px-8 md:py-3.5 rounded-full md:rounded-xl text-[10px] md:text-sm font-extrabold md:font-semibold uppercase md:capitalize tracking-wider md:tracking-normal w-max flex items-center gap-1.5 md:gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(110,25,36,0.45)] group/btn cursor-pointer"
                      >
                        <span>{banner.button_text || 'Shop Collection'}</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>

                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Arrows */}
      {activeBanners.length > 1 && (
        <>
          {/* Previous Slide Button */}
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-black/35 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90 border border-white/10 opacity-70 group-hover:opacity-100 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-black/35 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90 border border-white/10 opacity-70 group-hover:opacity-100 hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Indicators / Dots */}
          <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="p-1 focus:outline-none cursor-pointer flex items-center justify-center"
              >
                <div
                  className={`transition-all duration-300 rounded-full ${
                    i === currentIndex
                      ? 'w-6 sm:w-8 h-2 bg-[#D4AF37] shadow-sm'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Subtle Dynamic Progress Bar for Autoplay Interval */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
            <div
              key={progressKey}
              className="h-full bg-[#D4AF37] transition-all"
              style={{
                animation: 'heroProgress 5s linear forwards'
              }}
            />
          </div>
        </>
      )}

      {/* Hero Progress Bar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes heroProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />

    </div>
  );
}
