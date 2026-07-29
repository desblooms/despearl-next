import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/StoreContext';
import HeroCarousel from '@/components/HeroCarousel';

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
        <link rel="preload" as="image" href={firstHeroBannerImage} fetchPriority="high" />
      )}

      {/* Hero Slider */}
      {showHero && (
        <HeroCarousel banners={heroBanners} />
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
        {/* Offers Banner */}
        {showOffers && offers && offers.length > 0 && (
          <div id="offers-row" className="mt-8 md:mt-12">
            {offers.slice(0, 1).map((o: any) => (
              <div key={o.id} className="-2xl overflow-hidden relative h-[140px] md:h-[160px] bg-brand-espresso flex items-center px-6 md:px-8 shadow-lg shadow-gray-900/10 group cursor-pointer hover:shadow-gray-900/20 transition-shadow">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="flex-1 relative z-10">
                  <strong className="block text-xl md:text-3xl font-black text-white leading-tight mb-1">{o.title}</strong>
                  <p className="text-xs md:text-sm text-white/70 font-medium max-w-sm line-clamp-2">{o.description || ''}</p>
                </div>
                {o.discount_percentage && (
                  <div className="relative z-10 bg-white text-gray-900  px-4 py-3 md:px-6 md:py-4 text-center font-black leading-none shadow-md">
                    <span className="text-2xl md:text-3xl block mb-1">{Number(o.discount_percentage)}%</span>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-500">OFF</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Category Circles */}
        {showCategories && (
          <>
            <div className="flex items-end justify-between pt-10 pb-4 border-b border-brand-cream/50">
          <div>
            <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 tracking-tight mb-0.5">Shop by Room</h2>
            <p className="text-[11px] text-gray-500 font-medium">Explore furniture tailored for every space</p>
          </div>
          <Link href="/categories" className="text-[12px] font-bold text-brand-burgundy hover:text-brand-burgundy/90 flex items-center gap-1 transition">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex gap-4 md:gap-8 pt-6 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" id="home-cats">
          {categories.slice(0, 10).map((c: any) => (
            <Link key={c.id} href={`/shop/${c.id}`} className="flex flex-col items-center gap-2 md:gap-3 shrink-0 snap-start cursor-pointer group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-active:scale-95 bg-[#f8f9fa] border-2 border-white shadow-sm">
                 <img src={c.thumb || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=250"} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={c.name} />
              </div>
              <div className="text-[11px] font-bold text-gray-800 text-center leading-tight max-w-[70px]">{c.name}</div>
            </Link>
          ))}
        </div>

        {/* Featured Banner */}
        {categories.length >= 4 && (
          <div className="flex gap-4 pt-8 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" id="featured-row">
            {categories.slice(0, 4).map((c: any) => (
              <Link key={c.id} href={`/shop/${c.id}`} className="w-[240px] md:w-[320px] h-[140px] md:h-[180px]  overflow-hidden relative shrink-0 snap-start cursor-pointer group shadow-md shadow-gray-200/50 border border-brand-cream/50">
                <img src={c.banner || "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=500"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
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
            <p className="text-[11px] text-gray-500 font-medium">Fresh pieces just added</p>
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
            <p className="text-[11px] text-gray-500 font-medium">Curated pieces you'll love</p>
          </div>
          <span id="prod-count" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{total} Products</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pt-6" id="all-products">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        
        {total > 24 && (
          <div id="load-more-wrap" className="p-6 text-center mt-4">
            <Link href="/search" className="px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-[13px] font-bold rounded-sm transition-colors mx-auto active:scale-95 shadow-sm inline-flex">
              View All Products
            </Link>
          </div>
        )}
        
        <div className="h-12"></div>
      </div>
    </>
  );
}
