import React from 'react';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/StoreContext';
async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories.php`, { 
      next: { revalidate: 300 },
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

async function fetchProducts(catId?: string) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE}/products.php?limit=100`;
    if (catId) url += `&category_id=${catId}`;
    const res = await fetch(url, { 
      next: { revalidate: 60 },
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

export default async function ShopPage({ params }: { params: Promise<{ catId?: string[] }> }) {
  const { catId } = await params;
  const activeCatId = catId?.[0] || '0';

  const [categories, { products, total }] = await Promise.all([
    fetchCategories(),
    fetchProducts(activeCatId !== '0' ? activeCatId : undefined)
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black font-outfit text-gray-900 tracking-tight mb-0.5">Collections</h1>
          <p className="text-[11px] text-gray-500 font-medium">Browse our exclusive furniture ranges</p>
        </div>
      </div>

      <div className="sticky top-[60px] md:top-[64px] bg-white/95 backdrop-blur-md border-b border-brand-cream/50 z-30 py-3 mb-6 shadow-sm -2xl md:">
        <div className="flex gap-2 overflow-x-auto no-scrollbar" id="cat-filter-row">
          <Link 
            href="/shop"
            className={`px-3 py-1 text-[11px] md:text-[12px] font-bold border-2 cursor-pointer whitespace-nowrap transition-all shadow-sm rounded-sm ${activeCatId === '0' ? 'border-brand-burgundy bg-brand-burgundy text-white' : 'border-brand-rose/20 bg-white text-gray-600 hover:border-brand-rose/30 hover:text-gray-900'}`}
          >
            All Collections
          </Link>
          {categories.map((c: any) => (
            <Link
              key={c.id}
              href={`/shop/${c.id}`}
              className={`px-3 py-1 text-[11px] md:text-[12px] font-bold border-2 cursor-pointer whitespace-nowrap transition-all shadow-sm rounded-sm ${activeCatId === String(c.id) ? 'border-brand-burgundy bg-brand-burgundy text-white' : 'border-brand-rose/20 bg-white text-gray-600 hover:border-brand-rose/30 hover:text-gray-900'}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
      
      <div id="categories-content" className="min-h-[50vh]">
        {!products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 mt-8">
            <PackageOpen className="w-16 h-16 mb-4 opacity-30" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 font-medium text-sm">There are no products in this collection yet.</p>
          </div>
        ) : (
          <>
            <div className="pt-2 pb-4 text-sm font-bold text-gray-500 tracking-wide">{total || products.length} Products Found</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {products.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="h-12"></div>
          </>
        )}
      </div>
    </div>
  );
}
