"use client";

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getOptimizedImageUrl } from '@/utils/image';

const ALLOWED_IMAGE_HOSTS = [
  'admin.despearl.com',
  'app.votee.in',
  'images.unsplash.com',
  'despearl.com',
];

function isAllowedDomain(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  try {
    const parsed = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

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

  const autoplayPlugin = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false }), []);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [autoplayPlugin]);
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

  return (
    <div className="w-full relative aspect-[16/9] md:aspect-[1920/900] bg-brand-espresso overflow-hidden group">
      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container flex w-full h-full">
          {activeBanners.map((banner, index) => {
            const isFirst = index === 0;
            const bannerSrc = getOptimizedImageUrl(banner.image, 1920, 85);
            const canOptimize = isAllowedDomain(bannerSrc);

            return (
              <div
                key={banner.id || index}
                className={`embla__slide relative aspect-[16/9] md:aspect-[1920/900] flex-[0_0_100%] min-w-0 ${isFirst ? '' : 'skel'}`}
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
              >
                <Image
                  src={bannerSrc}
                  alt={banner.title || 'Featured collection preview'}
                  fill
                  priority={isFirst}
                  loading={isFirst ? 'eager' : 'lazy'}
                  fetchPriority={isFirst ? 'high' : 'auto'}
                  decoding={isFirst ? 'sync' : 'async'}
                  sizes="100vw"
                  unoptimized={true}
                  className="object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:from-black/60 md:via-black/30 md:to-transparent md:to-60% pointer-events-none"></div>

                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6">
                    <div className="w-[55%] sm:w-[50%] md:w-full md:max-w-xl text-left relative z-10 flex flex-col items-start">
                      <div className="inline-flex items-center gap-1.5 bg-[#A67C2E] text-white rounded px-2 py-0.5 text-[8px] md:text-[9px] font-medium mb-1.5 md:mb-4 tracking-[0.2em] uppercase shadow-sm">
                        New Collection
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold md:font-light md:text-5xl lg:text-7xl leading-tight md:leading-none mb-1 md:mb-2 tracking-wide md:tracking-[-0.04em] text-white whitespace-pre-line drop-shadow-md">
                        {banner.title || 'Elevate Your\nLiving Space'}
                      </h1>
                      <p className="hidden md:block text-lg text-white/90 mb-8 font-normal leading-relaxed drop-shadow-sm">
                        {banner.subtitle || 'Discover premium furniture pieces designed to bring comfort, elegance, and modern aesthetics to your home.'}
                      </p>
                      <Link href={banner.link || '/categories'} className="mt-[20px] bg-brand-burgundy text-white hover:bg-brand-burgundy/90 px-3 py-1.5 md:px-8 md:py-4 rounded-full md:rounded-xl text-[9px] md:text-sm font-extrabold md:font-medium uppercase md:capitalize tracking-wider md:tracking-normal w-max flex items-center gap-1.5 md:gap-2 transition active:scale-95 shadow-[0_4px_12px_rgba(110,25,36,0.35)] group/btn">
                        {banner.button_text || 'Shop Collection'} <ArrowRight className="w-2.5 h-2.5 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi && emblaApi.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all rounded-full ${i === currentIndex ? 'w-2 h-2 bg-[#A67C2E] shadow-sm scale-110' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
