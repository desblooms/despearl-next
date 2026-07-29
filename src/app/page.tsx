import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/StoreContext';
import HeroCarousel from '@/components/HeroCarousel';
import { getOptimizedImageUrl } from '@/utils/image';

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories.php`, { 
      next: { revalidate: 3600 },
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
      next: { revalidate: 1800 },
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
      next: { revalidate: 300 },
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
      next: { revalidate: 3600 },
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
      next: { revalidate: 1800 },
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const [categories, offers, { products, total }, settings, heroBanners] = await Promise.all([
    fetchCategories(),
    fetchOffers(),
    fetchProducts(24, 0),
    fetchSettings(),
    fetchHeroBanners()
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
          href={getOptimizedImageUrl(firstHeroBannerImage, 1024, 85)} 
          imageSrcSet={`${getOptimizedImageUrl(firstHeroBannerImage, 640, 80)} 640w, ${getOptimizedImageUrl(firstHeroBannerImage, 1024, 80)} 1024w, ${getOptimizedImageUrl(firstHeroBannerImage, 1440, 85)} 1440w`}
          imageSizes="(max-width: 768px) 100vw, 1440px"
          fetchPriority="high" 
        />
      )}

      {/* Hero Slider */}
      {showHero && (
        <HeroCarousel banners={heroBanners} />
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
      {/* Offers Banner Grid */}
      {showOffers && offers && offers.length > 0 && (
        <div id="offers-row" className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {offers.slice(0, 3).map((o: any) => {
            const hasText = !!o.display_title;
            const imageUrl = o.banner || o.banner_image || o.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800';
            
            return (
              <div key={o.id} className="w-full relative rounded-2xl bg-brand-cream flex items-center shadow-lg shadow-gray-900/10 cursor-pointer overflow-hidden group">
                <img 
                  src={getOptimizedImageUrl(imageUrl)} 
                  alt={o.title || 'Special Offer'} 
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-700" 
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
            <Link key={c.id} href={`/shop/${c.id}`} className="flex flex-col items-center gap-2.5 shrink-0 snap-start cursor-pointer group">
                 <div className="p-[3px] bg-brand-burgundy rounded-full transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 group-active:scale-95 shadow-sm">
                   <div className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center bg-white border border-white">
                     <img src={getOptimizedImageUrl(c.thumb, 200, 75)} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={c.name} />
                   </div>
                 </div>
               <div className="text-[11px] font-bold text-gray-800 text-center leading-tight max-w-[70px] truncate">{c.name}</div>
             </Link>
           ))}
         </div>

         {/* Featured Banner */}
         {categories.length >= 4 && (
           <div className="flex gap-4 pt-8 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" id="featured-row">
             {categories.slice(0, 4).map((c: any) => (
               <Link key={c.id} href={`/shop/${c.id}`} className="w-[240px] md:w-[320px] h-[140px] md:h-[180px] rounded-2xl overflow-hidden relative shrink-0 snap-start cursor-pointer group shadow-md shadow-gray-200/50 border border-brand-cream/50">
                 <img src={getOptimizedImageUrl(c.banner, 400, 75)} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Featured category ${c.name}`} />
                <div className="absolute inset-0 bg-black/50 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">
                  <div className="text-white/80 font-bold text-[9px] mb-1 uppercase tracking-widest">Featured</div>
                  <div className="text-white font-black font-outfit text-lg md:text-xl leading-tight">{c.name}</div>
                </div>
              </Link>
            ))}
            </div>
          )}
        </>
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
