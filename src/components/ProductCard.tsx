'use client';

import React from 'react';
import { Heart, Plus, ShoppingBag } from 'lucide-react';
import { useStore, Product } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export default function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const { toggleWishlist, isWished, addToCart, isInCart, toast } = useStore();
  const router = useRouter();

  const wished = isWished(product.id);
  const inCart = isInCart(product.id);
  const inStock = Number(product.stock_quantity || 0) > 0;
  
  const getImageUrl = (url: string | undefined) => {
    if (!url) return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='%2394a3b8' font-size='36'%3E📦%3C/text%3E%3C/svg%3E`;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `https://app.votee.in${url}`;
    if (url.startsWith('uploads/')) return `https://app.votee.in/${url}`;
    if (url.startsWith('gallery_')) return `https://app.votee.in/uploads/products/gallery/${url}`;
    // If it's just a filename from ERP
    return `https://app.votee.in/uploads/products/${url}`;
  };

  const img = getImageUrl(product.image);
  
  const wrapperClass = horizontal ? "w-[150px] md:w-[200px] shrink-0 snap-start" : "";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) {
      toast('Out of stock', 'alert-circle');
      return;
    }
    if (inCart) {
      router.push('/cart');
      return;
    }
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className={`bg-white border border-brand-cream/50 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-rose/20 group relative flex flex-col ${wrapperClass}`}>
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="aspect-[4/5] bg-[#f8f9fa] relative overflow-hidden">
          <img 
            src={img} 
            alt={product.name} 
            loading="lazy" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f8f9fa%22/%3E%3Ctext x=%22100%22 y=%22100%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2236%22%3E📦%3C/text%3E%3C/svg%3E`;
            }}
          />
          {!inStock && (
            <span className="absolute top-2 left-2 bg-brand-espresso text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-sm z-10">Sold Out</span>
          )}
        </div>
      </Link>
      
      <button 
        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white/90 backdrop-blur-sm border border-brand-cream/50 shadow-sm z-10 ${wished ? 'text-brand-burgundy' : 'text-gray-400'} hover:scale-110 active:scale-95`} 
        onClick={handleWishlist}
      >
        <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-brand-burgundy' : ''}`} />
      </button>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="block flex-1">
          <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1 truncate font-outfit">
            {product.brand ? product.brand : (product.category_name || 'Premium Product')}
          </div>
          <div className="text-[13px] font-semibold leading-snug mb-2 line-clamp-2 text-gray-900 hover:text-brand-burgundy transition-colors min-h-[36px]">
            {product.name}
          </div>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-1">
            <div className="text-[15px] font-black text-gray-950 tracking-tight font-mono">₹{Number(product.price || 0).toFixed(2)}</div>
            {!horizontal && (
              <button 
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all active:scale-90 shadow-xs disabled:opacity-30 disabled:cursor-not-allowed ${
                  inCart 
                    ? 'bg-brand-burgundy border border-brand-burgundy text-white hover:bg-brand-burgundy/90' 
                    : 'bg-white border border-brand-rose/30 hover:border-brand-burgundy text-gray-900 hover:text-brand-burgundy hover:bg-brand-burgundy/5 group-hover:border-brand-burgundy group-hover:text-brand-burgundy'
                }`} 
                onClick={handleQuickAdd}
                disabled={!inStock}
                title={inCart ? "Go to Cart" : "Add to Bag"}
              >
                {inCart ? <ShoppingBag className="w-4 h-4" /> : <Plus className="w-4.5 h-4.5" />}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
