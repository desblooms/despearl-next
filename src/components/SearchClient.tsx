'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, ArrowRight, SearchX, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/StoreContext';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState(initialQuery);

  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories.php`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') setCategories(d.data || []);
      })
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (q: string, cat: number | null) => {
    setLoading(true);
    setError(false);
    setSearchedQuery(q);
    try {
      let url = '';
      if (q) {
        url = `${process.env.NEXT_PUBLIC_API_BASE}/search.php?q=${encodeURIComponent(q)}&limit=60`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_BASE}/products.php?limit=50`;
        if (cat) url += `&category_id=${cat}`;
      }
      const res = await fetch(url);
      const d = await res.json();
      setProducts(d.data || []);
      setTotal(q ? (d.data?.length || 0) : (d.total || 0));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(initialQuery, activeCat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(() => {
      doSearch(val, activeCat);
      router.replace(val ? `/search?q=${encodeURIComponent(val)}` : '/search');
    }, 400);
  };

  const handleCatClick = (catId: number | null) => {
    setActiveCat(catId);
    setQuery('');
    router.replace('/search');
    doSearch('', catId);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
      <div className="sticky top-[60px] md:top-[64px] py-4 bg-white/95 backdrop-blur-md z-30 border-b border-brand-cream/50 shadow-sm rounded-b-2xl md:rounded-none mb-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-[16px] outline-none transition font-bold text-gray-900" 
                placeholder="Search furniture, categories..." 
                value={query}
                onChange={handleInput}
                autoFocus
              />
          </div>
          <button onClick={() => doSearch(query, activeCat)} className="p-2.5 bg-brand-espresso hover:bg-black text-white rounded-xl transition active:scale-95 shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-4 overflow-x-auto no-scrollbar" id="filter-chips">
          <div 
            className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold border-2 cursor-pointer whitespace-nowrap transition-all shadow-sm ${activeCat === null ? 'border-brand-espresso bg-brand-espresso text-white' : 'border-brand-rose/20 bg-white text-gray-600 hover:border-brand-espresso hover:text-gray-900'}`} 
            onClick={() => handleCatClick(null)}
          >
            All
          </div>
          {categories.map(c => (
            <div 
              key={c.id}
              className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold border-2 cursor-pointer whitespace-nowrap transition-all shadow-sm ${activeCat === c.id ? 'border-brand-espresso bg-brand-espresso text-white' : 'border-brand-rose/20 bg-white text-gray-600 hover:border-brand-espresso hover:text-gray-900'}`} 
              onClick={() => handleCatClick(c.id)}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>

      <div id="search-results" className="min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pt-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white border border-brand-cream/50 rounded-xl overflow-hidden"><div className="skel aspect-square"></div><div className="p-3"><div className="skel h-3 w-full rounded-full mb-2"></div><div className="skel h-3 w-2/3 rounded-full"></div></div></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 mt-8">
            <AlertCircle className="w-16 h-16 mb-4 opacity-30" />
            <h3 className="text-xl font-black text-gray-900 mb-2">Error during search</h3>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 mt-8">
            <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500 font-medium max-w-[250px] text-sm">{searchedQuery ? `We couldn't find any products matching "${searchedQuery}"` : 'No products in this category yet'}</p>
          </div>
        ) : (
          <>
            <div className="pt-2 pb-4 text-sm font-bold text-gray-500 tracking-wide">{total} Products Found{searchedQuery ? ` for "${searchedQuery}"` : ''}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="h-12"></div>
          </>
        )}
      </div>
    </div>
  );
}
