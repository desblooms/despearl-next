'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash,
  ArrowRight,
  BagSimple,
  Basket,
  Truck,
  SealCheck,
  Tag,
} from '@phosphor-icons/react';
import { useStore } from '@/context/StoreContext';
import { getOptimizedImageUrl } from '@/utils/image';

export default function CartDrawer() {
  const { cart, cartTotal, cartCount, updateQty, removeFromCart, drawerOpen, setDrawerOpen } = useStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setDrawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const subtotal = cartTotal;
  const FREE_THRESHOLD = 499;
  const shipping = subtotal >= FREE_THRESHOLD ? 0 : 49;
  const total = subtotal + shipping;
  const progressPct = Math.min((subtotal / FREE_THRESHOLD) * 100, 100);
  const remaining = FREE_THRESHOLD - subtotal;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-full z-[61] w-full max-w-[390px] flex flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* ━━ HEADER ━━ */}
        <div className="shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-burgundy/8 flex items-center justify-center">
                <BagSimple weight="duotone" className="w-5 h-5 text-brand-burgundy" />
              </div>
              <div>
                <h2 className="text-[15px] font-black font-outfit text-gray-900 leading-none tracking-tight">Your Bag</h2>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                  {cartCount === 0 ? 'No items yet' : `${cartCount} item${cartCount !== 1 ? 's' : ''} added`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer"
              aria-label="Close cart"
            >
              <X weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Shipping progress bar */}
          {cart.length > 0 && (
            <div className="mt-4 bg-gray-50 rounded-xl px-3.5 py-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Truck weight="duotone" className="w-3.5 h-3.5 text-brand-burgundy" />
                  <span className="text-[11px] font-semibold text-gray-600">
                    {shipping === 0
                      ? <span className="text-emerald-600 font-bold">🎉 Free delivery unlocked!</span>
                      : <>Add <span className="text-brand-burgundy font-black">₹{remaining.toFixed(0)}</span> for free delivery</>
                    }
                  </span>
                </div>
                {shipping === 0 && <SealCheck weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />}
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: progressPct >= 100
                      ? 'linear-gradient(90deg,#10b981,#34d399)'
                      : 'linear-gradient(90deg,#710014,#a3001e)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ━━ EMPTY STATE ━━ */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Basket weight="duotone" className="w-10 h-10 text-gray-300" />
            </div>
            <div>
              <p className="font-black font-outfit text-gray-800 text-lg mb-1 tracking-tight">Your bag is empty</p>
              <p className="text-[13px] text-gray-400 leading-relaxed">Add items to get started. We'll save them here for you.</p>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="inline-flex items-center gap-2 bg-brand-burgundy text-white font-bold text-[13px] px-6 py-3 rounded-xl hover:bg-[#5a000f] transition-all cursor-pointer shadow-lg shadow-brand-burgundy/25"
            >
              Browse Collection <ArrowRight weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            {/* ━━ ITEMS ━━ */}
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3 overscroll-contain">
              {cart.map((item) => {
                const img = getOptimizedImageUrl(item.image, 160, 75);
                return (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-150 transition-all duration-200 animate-in fade-in slide-in-from-right-2 duration-300"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.id}`}
                      onClick={() => setDrawerOpen(false)}
                      className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={img}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      {/* Name & brand */}
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          onClick={() => setDrawerOpen(false)}
                          className="text-[12.5px] font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-brand-burgundy transition-colors block"
                        >
                          {item.name}
                        </Link>
                        {item.brand && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Tag weight="fill" className="w-2.5 h-2.5 text-gray-300" />
                            <span className="text-[9.5px] text-gray-400 uppercase tracking-[0.14em] font-medium">{item.brand}</span>
                          </div>
                        )}
                      </div>

                      {/* Controls row */}
                      <div className="flex items-center justify-between mt-auto">
                        {/* Qty stepper */}
                        <div className="flex items-center h-7 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQty(item.cartItemId, -1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Decrease"
                          >
                            <Minus weight="bold" className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-[12px] font-black font-outfit text-gray-900 select-none">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.cartItemId, 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Increase"
                          >
                            <Plus weight="bold" className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Price + delete */}
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-black font-outfit text-brand-burgundy">
                            ₹{(Number(item.price) * item.qty).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition cursor-pointer"
                            aria-label="Remove"
                          >
                            <Trash weight="duotone" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ━━ FOOTER ━━ */}
            <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-4 pt-4 pb-safe-6 pb-6">
              {/* Summary */}
              <div className="space-y-2 text-[13px] mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-700">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  {shipping === 0
                    ? <span className="text-emerald-600 font-bold flex items-center gap-1"><SealCheck weight="fill" className="w-3.5 h-3.5" />Free</span>
                    : <span className="font-semibold text-gray-700">₹{shipping.toFixed(2)}</span>
                  }
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 mt-1">
                  <span className="font-black font-outfit text-[14px] text-gray-800">Order Total</span>
                  <span className="font-black font-outfit text-[20px] text-brand-burgundy leading-none">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-brand-burgundy text-white font-black font-outfit text-[13px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#5a000f] transition-all duration-300 cursor-pointer shadow-lg shadow-brand-burgundy/20 group active:scale-[0.98]"
                >
                  Checkout Now
                  <ArrowRight weight="bold" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-white border border-gray-200 text-gray-600 font-semibold text-[13px] py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all cursor-pointer active:scale-[0.98]"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
