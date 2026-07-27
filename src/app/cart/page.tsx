'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Tag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty } = useStore();
  const router = useRouter();

  const checkout = () => {
    if (cart.length === 0) return;
    router.push('/checkout');
  };

  const hasDiscount = false; // Mock for now if we want to show generic discount
  const discountAmount = 0;
  const shippingFee = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal - discountAmount + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-lg border border-gray-200 flex flex-col items-center max-w-md w-full text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Bag is Empty!</h2>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything to your bag yet.</p>
          <Link href="/shop" className="bg-brand-burgundy text-white font-bold py-3 px-8 rounded-sm hover:bg-brand-burgundy/90 transition-colors w-full">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] pb-24 md:pb-12">
      <div className="max-w-[1200px] mx-auto px-0 md:px-4 py-4 md:py-8">
        
        {/* Desktop Header */}
        <h1 className="hidden md:block text-2xl font-black text-gray-900 mb-6 px-4 md:px-0">Shopping Bag ({cart.length} items)</h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          
          {/* Left Column: Items */}
          <div className="md:w-2/3 flex flex-col gap-3">
            <div className="bg-white md:rounded-sm border border-gray-200 overflow-hidden">
              
              {/* Header for Mobile */}
              <div className="md:hidden p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">Items in Bag</span>
                <span className="text-xs font-medium text-gray-500">{cart.length} Items</span>
              </div>

              {cart.map((item, index) => (
                <div key={item.id} className={`p-4 flex gap-4 ${index !== cart.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="w-[90px] h-[120px] shrink-0 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
                    <img 
                      src={item.image || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='120' viewBox='0 0 90 120'%3E%3Crect width='90' height='120' fill='%23f1f5f9'/%3E%3Ctext x='45' y='60' text-anchor='middle' fill='%2394a3b8' font-size='20'%3E📦%3C/text%3E%3C/svg%3E`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight mb-1 hover:text-brand-burgundy cursor-pointer">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-2 truncate">{item.brand || item.category_name || 'Premium Product'}</p>
                        
                        {/* Mock Attributes */}
                        <div className="flex items-center gap-2 mb-3">
                           <div className="text-[11px] font-semibold text-gray-600 bg-brand-cream/20 px-2 py-0.5 border border-brand-rose/20 rounded-sm">Size: M</div>
                           <div className="text-[11px] font-semibold text-gray-600 bg-brand-cream/20 px-2 py-0.5 border border-brand-rose/20 rounded-sm flex items-center gap-1">
                             Color: <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-inner"></span>
                           </div>
                        </div>

                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-gray-900 transition-colors shrink-0 p-1 -m-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-brand-rose/20 rounded-sm bg-white overflow-hidden h-7">
                        <button className="w-7 h-full flex items-center justify-center text-gray-600 hover:bg-brand-cream/50 transition active:bg-gray-200" onClick={() => updateQty(item.id, -1)}><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900 border-x border-brand-cream/50 h-full flex items-center justify-center">{item.qty}</span>
                        <button className="w-7 h-full flex items-center justify-center text-gray-600 hover:bg-brand-cream/50 transition active:bg-gray-200" onClick={() => updateQty(item.id, 1)}><Plus className="w-3 h-3" /></button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-[16px] font-black text-gray-900">₹{(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className="bg-white md:rounded-sm border border-gray-200 p-3 flex flex-wrap justify-center md:justify-between items-center gap-3 text-[11px] font-medium text-gray-600 px-4 md:px-6">
               <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gray-900" /> Genuine Products</div>
               <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gray-900" /> Secure Payments</div>
               <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gray-900" /> Easy Returns</div>
            </div>
          </div>

          {/* Right Column: Price Details */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 sticky top-[80px] md:self-start">
            
            {/* Coupons */}
            <div className="bg-white md:rounded-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-900" />
                <span className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">Coupons</span>
              </div>
              <button className="w-full flex items-center justify-between border border-brand-rose/20 border-dashed rounded-sm p-3 hover:bg-brand-cream/20 transition-colors">
                <span className="text-[13px] font-bold text-brand-burgundy">Apply Coupons</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Price Summary */}
            <div className="bg-white md:rounded-sm border border-gray-200 p-4">
              <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-4">Price Details ({cart.length} Items)</h2>
              
              <div className="flex flex-col gap-3 text-[13px] border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Bag MRP</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between items-center text-gray-900">
                    <span>Bag Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-gray-900 font-medium">Free</span>
                  ) : (
                    <span>₹{shippingFee.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[16px] font-black text-gray-900">You Pay</span>
                <span className="text-lg font-black text-gray-900">₹{grandTotal.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={checkout}
                className="hidden md:flex w-full py-3.5 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-sm text-sm font-bold items-center justify-center transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between z-40 md:hidden">
        <div>
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Grand Total</div>
          <div className="text-lg font-black text-gray-900 leading-none">₹{grandTotal.toFixed(2)}</div>
        </div>
        <button 
          onClick={checkout}
          className="bg-brand-burgundy text-white font-bold py-3 px-8 rounded-sm text-sm active:scale-95 transition-transform"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
