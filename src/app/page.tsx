import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/StoreContext';
import HeroCarousel from '@/components/HeroCarousel';
import { getOptimizedImageUrl } from '@/utils/image';
import SmoothImage from '@/components/SmoothImage';
import ReelsSection from '@/components/ReelsSection';

export const dynamic = 'force-dynamic';
async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories.php`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

async function fetchOffers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/offers.php`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

async function fetchProducts(limit = 24, offset = 0) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products.php?limit=${limit}&offset=${offset}`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    if (data.status === 'success') {
      const uniqueProducts = [];
      const seen = new Set();
      for (const p of data.data || []) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          uniqueProducts.push(p);
        }
      }
      return { products: uniqueProducts, total: uniqueProducts.length };
    }
    return { products: [], total: 0 };
  } catch (e) {
    return { products: [], total: 0 };
  }
}

async function fetchSettings() {
  try {
    const res = await fetch(`https://admin.despearl.com/api/settings`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : null;
  } catch (e) {
    return null;
  }
}

async function fetchHeroBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/hero_banners.php`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

async function fetchReels() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reels.php`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const [categories, offers, { products, total }, settings, heroBanners, reels] = await Promise.all([
    fetchCategories(),
    fetchOffers(),
    fetchProducts(24, 0),
    fetchSettings(),
    fetchHeroBanners(),
    fetchReels()
  ]);

  const newArrivals = products.slice(0, 8);
  const homeConfig = settings?.homepage || {};

  const showHero = homeConfig.show_hero !== false;
  const showOffers = homeConfig.show_offers !== false;
  const showCategories = homeConfig.show_categories !== false;
  const showNewArrivals = homeConfig.show_new_arrivals !== false;

  const firstHeroBannerImage = (heroBanners && heroBanners.length > 0 && heroBanners[0].image) ? heroBanners[0].image : (homeConfig.hero_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000');

  return (
    <>
      {/* Preload Primary LCP Hero Image for HTML scanner */}
      {showHero && firstHeroBannerImage && (
        <link
          rel="preload"
          as="image"
          href={getOptimizedImageUrl(firstHeroBannerImage, 1920, 100)}
          imageSrcSet={`${getOptimizedImageUrl(firstHeroBannerImage, 640, 100)} 640w, ${getOptimizedImageUrl(firstHeroBannerImage, 1024, 100)} 1024w, ${getOptimizedImageUrl(firstHeroBannerImage, 1920, 100)} 1920w`}
          imageSizes="100vw"
          fetchPriority="high"
        />
      )}

      {/* Hero Slider */}
      {showHero && (
        <HeroCarousel banners={heroBanners} />
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
        {/* Offers Banner Grid */}

        {/* Category Circles */}
        {showCategories && (
          <>
            <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
              <div>
                <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 tracking-tight mb-0.5">Shop By Categories</h2>
                <p className="text-[11px] text-gray-700 font-medium">Explore furniture tailored for every space</p>
              </div>
              <Link href="/categories" className="text-[12px] font-bold text-brand-burgundy hover:text-brand-burgundy/90 flex items-center gap-1 transition">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-4 md:gap-8 pt-6 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" id="home-cats">
              {categories.slice(0, 10).map((c: any) => (
                <Link key={c.id} href={`/shop/${c.id}`} className="w-[23vw] md:w-auto flex flex-col items-center gap-2.5 shrink-0 snap-start cursor-pointer group">
                  <div className="w-full p-[1px] bg-gradient-to-br from-[#E8D48B] via-[#F7EDBC] to-[#C9A84C] rounded-[20px] transition-all duration-500 group-hover:scale-105 group-active:scale-95">
                    <div className="w-full aspect-square md:w-40 md:h-40 rounded-[20px] overflow-hidden flex items-center justify-center relative skel">
                      <SmoothImage 
                        src={getOptimizedImageUrl(c.thumb, 200, 75)} 
                        loading="lazy" 
                        decoding="async" 
                        className="w-full h-full object-cover" 
                        alt={c.name}
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="text-[13px] font-bold text-gray-800 text-center leading-tight max-w-[80px] truncate">{c.name}</div>
                </Link>
              ))}
            </div>

          </>
        )}

        {showOffers && offers && offers.length > 0 && (
          <div id="offers-row" className="mt-8 md:mt-12 flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:gap-6 md:grid md:grid-cols-3 pb-2 md:pb-0">
            {offers.slice(0, 3).map((o: any) => {
              const hasText = !!o.display_title;
              const imageUrl = o.banner || o.banner_image || o.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800';

              return (
                <div key={o.id} className="w-[calc(50%-6px)] md:w-full shrink-0 snap-start relative aspect-[3/4] rounded-2xl bg-brand-cream border border-gray-200/70 cursor-pointer overflow-hidden group skel">
                  <SmoothImage
                    src={getOptimizedImageUrl(imageUrl)}
                    alt={o.title || 'Special Offer'}
                    className="absolute inset-0 w-full h-full object-cover object-right group-hover:scale-105"
                  />

                  {hasText && (
                    <>
                      <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                      <div className="relative z-10 w-full px-5 md:px-6 flex flex-col justify-center h-full">
                        {o.display_title && <strong className="block text-xl lg:text-2xl font-black text-white leading-tight mb-1.5 tracking-tight drop-shadow-md">{o.display_title}</strong>}
                        {o.description && <p className="text-xs lg:text-sm text-white/90 font-medium max-w-[85%] line-clamp-2 drop-shadow-md mb-3">{o.description}</p>}

                        {o.discount_percentage && (
                          <div className="bg-white text-gray-900 rounded-xl px-4 py-2 w-max text-center font-black leading-none shadow-md">
                            <span className="text-xl lg:text-2xl block mb-0.5">{Number(o.discount_percentage)}%</span>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">OFF</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}


        {/* New Arrivals */}
        {showNewArrivals && (
          <>
            <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
              <div>
                <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 tracking-tight mb-0.5">New Arrivals</h2>
                <p className="text-[11px] text-gray-700 font-medium">Fresh pieces just added</p>
              </div>
              <Link href="/search" className="text-[12px] font-bold text-brand-burgundy hover:text-brand-burgundy/90 flex items-center gap-1 transition">
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-4 pt-6 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" id="new-arrivals">
              {newArrivals.map((p: Product) => (
                <ProductCard key={p.id} product={p} horizontal />
              ))}
            </div>
          </>
        )}

        {/* Featured Categories Banners — only shown if categories have a custom banner */}
        {showCategories && (() => {
          const overlays = [
            'bg-gradient-to-tr from-[#1a1209] via-[#2e1f0e]/80 to-[#2e1f0e]/20',   // warm espresso
            'bg-gradient-to-tr from-[#0e0e0e] via-[#1c1c1c]/80 to-[#1c1c1c]/20',   // pure charcoal
            'bg-gradient-to-tr from-[#1a0d0d] via-[#2d1515]/80 to-[#2d1515]/20',   // deep wine
            'bg-gradient-to-tr from-[#111318] via-[#1e2330]/80 to-[#1e2330]/20',   // dark slate navy
          ];
          const featuredCats = categories.filter((c: any) => !!c.banner).slice(0, 4);
          if (featuredCats.length === 0) return null;
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-8 pb-2" id="featured-row">
              {featuredCats.map((c: any, index: number) => (
                <Link key={c.id} href={`/shop/${c.id}`} className="h-[140px] md:h-[180px] rounded-2xl overflow-hidden relative cursor-pointer group border border-white/10 skel">
                  <SmoothImage
                    src={getOptimizedImageUrl(c.banner, 400, 75)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={`Featured category ${c.name}`}
                  />
                  <div className={`absolute inset-0 ${overlays[index % overlays.length]} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">
                    <div className="text-white/70 font-bold text-[9px] mb-1 uppercase tracking-widest">Featured</div>
                    <div className="text-white font-black font-outfit text-base md:text-lg leading-tight">{c.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          );
        })()}

        {/* Reels Section */}
        {reels && reels.length > 0 && (
          <div className="-mx-4 md:-mx-6 px-4 md:px-6">
            <ReelsSection reels={reels} />
          </div>
        )}

        {/* All Products Grid */}
        <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
          <div>
            <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 tracking-tight mb-0.5">Just For You</h2>
            <p className="text-[11px] text-gray-700 font-medium">Curated pieces you'll love</p>
          </div>
          <span id="prod-count" className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{total} Products</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pt-6" id="all-products">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {total > 24 && (
          <div id="load-more-wrap" className="p-6 text-center mt-4">
            <Link href="/search" className="px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-[13px] font-bold rounded-xl transition-colors mx-auto active:scale-95 shadow-sm inline-flex">
              View All Products
            </Link>
          </div>
        )}

        <div className="h-12"></div>
      </div>
    </>
  );
}
