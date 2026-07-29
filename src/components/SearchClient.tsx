'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, ArrowRight, SearchX, AlertCircle, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/StoreContext';
import { useSearchParams, useRouter } from 'next/navigation';

const SUGGESTED_PLACEHOLDERS = [
  "Search luxury velvet sofas...",
  "Search minimalist dining tables...",
  "Search modern accent chairs...",
  "Search solid oak dressers...",
  "Search designer pendant lights...",
  "Search elegant coffee tables...",
  "Search home accessories..."
];

const TRENDING_SEARCHES = [
  "Sofa",
  "Dining Table",
  "Accent Chair",
  "Bed",
  "Sideboard",
  "Lighting",
  "Coffee Table"
];

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
  const [placeholder, setPlaceholder] = useState("");

  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    let curWordIdx = 0;
    let curCharIdx = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      const fullWord = SUGGESTED_PLACEHOLDERS[curWordIdx];
      if (!isDeleting) {
        setPlaceholder(fullWord.substring(0, curCharIdx + 1));
        curCharIdx++;
        if (curCharIdx === fullWord.length) {
          isDeleting = true;
          timer = setTimeout(tick, 2500); // Pause on full word
        } else {
          timer = setTimeout(tick, 50); // Typing speed
        }
      } else {
        setPlaceholder(fullWord.substring(0, curCharIdx - 1));
        curCharIdx--;
        if (curCharIdx === 0) {
          isDeleting = false;
          curWordIdx = (curWordIdx + 1) % SUGGESTED_PLACEHOLDERS.length;
          timer = setTimeout(tick, 500); // Pause before typing next word
        } else {
          timer = setTimeout(tick, 30); // Deleting speed
        }
      }
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleClear = () => {
    setQuery('');
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    doSearch('', activeCat);
    router.replace('/search');
    inputRef.current?.focus();
  };

  const handleCatClick = (catId: number | null) => {
    setActiveCat(catId);
    setQuery('');
    router.replace('/search');
    doSearch('', catId);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    router.replace(`/search?q=${encodeURIComponent(tag)}`);
    doSearch(tag, activeCat);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full pb-16">
      {/* Immersive Welcome Header when not actively searching */}
      {!searchedQuery && (
        <div className="text-center pt-8 pb-4 md:pt-14 md:pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 font-outfit">
            Explore <span className="text-brand-burgundy font-serif font-bold">Despearl.</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto font-medium">
            Search across our luxury furniture collections, curated lighting, and modern home accessories.
          </p>
        </div>
      )}

      {/* Big Search Input Sticky Bar */}
      <div className="sticky top-[62px] md:top-[68px] py-6 bg-white/95 backdrop-blur-md z-30 border-b border-brand-rose/10 mb-8 transition-all duration-300">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3.5 w-full">
            <div className="flex-1 relative group">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-burgundy transition-colors duration-300" />
              <input 
                ref={inputRef}
                type="text" 
                className="w-full bg-white border border-gray-200/80 focus:border-brand-burgundy/40 focus:ring-8 focus:ring-brand-burgundy/5 rounded-2xl py-4 md:py-4.5 pl-13 pr-12 text-md md:text-lg outline-none transition-all duration-300 font-medium text-gray-900 shadow-sm hover:shadow-md focus:shadow-md font-outfit" 
                placeholder={placeholder}
                value={query}
                onChange={handleInput}
                autoFocus
              />
              {query && (
                <button 
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => doSearch(query, activeCat)} 
              className="p-4 md:p-4.5 bg-brand-burgundy hover:bg-brand-wine text-white rounded-2xl transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center cursor-pointer shrink-0"
              title="Search"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trending Searches Tag List */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-400 mr-1 uppercase tracking-wider text-[10px]">Trending:</span>
            {TRENDING_SEARCHES.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white hover:bg-brand-burgundy hover:text-white border border-gray-200 hover:border-transparent text-gray-600 font-medium transition-all duration-300 cursor-pointer shadow-3xs hover:shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Collection Filter Chips */}
          <div className="flex justify-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1" id="filter-chips">
            <button 
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border cursor-pointer whitespace-nowrap transition-all duration-300 ${
                activeCat === null 
                  ? 'border-brand-burgundy bg-brand-burgundy text-white shadow-sm' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-burgundy/40 hover:text-brand-burgundy'
              }`} 
              onClick={() => handleCatClick(null)}
            >
              All Collections
            </button>
            {categories.map(c => (
              <button 
                key={c.id}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border cursor-pointer whitespace-nowrap transition-all duration-300 ${
                  activeCat === c.id 
                    ? 'border-brand-burgundy bg-brand-burgundy text-white shadow-sm' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-burgundy/40 hover:text-brand-burgundy'
                }`} 
                onClick={() => handleCatClick(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div id="search-results" className="min-h-[50vh] animate-in fade-in duration-500">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pt-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white border border-brand-cream/50 rounded-xl overflow-hidden"><div className="skel aspect-square"></div><div className="p-3"><div className="skel h-3 w-full rounded-full mb-2"></div><div className="skel h-3 w-2/3 rounded-full"></div></div></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 mt-8">
            <AlertCircle className="w-16 h-16 mb-4 text-brand-burgundy opacity-70 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-outfit">Error during search</h3>
            <p className="text-gray-500 text-sm max-w-xs font-medium">Please check your network connection and try again.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 mt-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 border border-brand-cream/80 shadow-xs">
                <SearchX className="w-9 h-9 text-brand-burgundy opacity-70" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-outfit">No Results Found</h3>
            <p className="text-gray-500 font-medium max-w-[280px] text-sm">{searchedQuery ? `We couldn't find any products matching "${searchedQuery}"` : 'No products in this category yet'}</p>
          </div>
        ) : (
          <>
            <div className="pt-2 pb-4 text-sm font-semibold text-gray-500 tracking-wide font-outfit">{total} Products Found{searchedQuery ? ` for "${searchedQuery}"` : ''}</div>
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
