'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Tag, ShieldCheck, Timer, Percent, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty, toast } = useStore();
  const router = useRouter();

  // Urgency Timer state (15 minutes countdown)
  const [timeLeft, setTimeLeft] = useState(900);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Coupons State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Re-validate applied coupon if total changes
  useEffect(() => {
    const stored = localStorage.getItem('foxa_applied_coupon');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const val = validateCoupon(parsed.code, cartTotal);
        if (val.valid) {
          setAppliedCoupon({ code: parsed.code, discount: val.discount });
        } else {
          localStorage.removeItem('foxa_applied_coupon');
          setAppliedCoupon(null);
        }
      } catch (e) {
        localStorage.removeItem('foxa_applied_coupon');
      }
    }
  }, [cartTotal]);

  const validateCoupon = (code: string, total: number) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'WELCOME50') {
      if (total >= 500) {
        return { valid: true, discount: 50 };
      }
      return { valid: false, discount: 0, error: 'Minimum order for WELCOME50 is ₹500' };
    }
    if (cleanCode === 'DEAL10') {
      if (total >= 1000) {
        return { valid: true, discount: Math.round(total * 0.10) };
      }
      return { valid: false, discount: 0, error: 'Minimum order for DEAL10 is ₹1000' };
    }
    return { valid: false, discount: 0, error: 'Invalid Coupon Code' };
  };

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    const val = validateCoupon(code, cartTotal);
    if (val.valid) {
      const couponObj = { code: code.toUpperCase().trim(), discount: val.discount };
      setAppliedCoupon(couponObj);
      localStorage.setItem('foxa_applied_coupon', JSON.stringify(couponObj));
      toast(`Coupon ${code.toUpperCase()} applied!`, 'check');
    } else {
      setCouponError(val.error || 'Invalid Coupon');
      toast(val.error || 'Invalid Coupon', 'alert-circle');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('foxa_applied_coupon');
    toast('Coupon removed', 'info');
  };

  const checkout = () => {
    if (cart.length === 0) return;
    router.push('/checkout');
  };

  // Pricing constants
  const shippingThreshold = 1000;
  const shippingFee = cartTotal >= shippingThreshold ? 0 : 50;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  // Progressive shipping bar calculations
  const progressPercent = Math.min((cartTotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = shippingThreshold - cartTotal;

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-brand-rose/10 flex flex-col items-center max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-brand-cream/50 rounded-full flex items-center justify-center mb-5 border border-brand-rose/10">
            <ShoppingBag className="w-8 h-8 text-brand-burgundy" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 font-outfit">Your Bag is Empty!</h2>
          <p className="text-xs text-gray-700 mb-6 max-w-[240px]">Add standard premium items to your bag to experience instant checkout.</p>
          <Link href="/shop" className="bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200 w-full shadow-sm active:scale-[0.98]">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-[calc(100vh-64px)] pb-24 md:pb-12">
      
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-white border-b border-gray-150 sticky top-0 z-30 px-3 py-2.5 flex items-center gap-3">
        <Link href="/shop" className="p-1 -m-1 hover:bg-gray-100 rounded-full transition text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-black text-gray-900 text-[15px] font-outfit">Shopping Bag ({cart.length})</span>
      </div>

      <div className="max-w-[1100px] mx-auto px-0 md:px-4 py-2 md:py-6">
        
        {/* Desktop Header */}
        <h1 className="hidden md:block text-2xl font-black text-gray-900 mb-5 px-4 md:px-0 font-outfit flex items-center gap-2">
          Shopping Bag <span className="text-sm font-bold text-gray-700 bg-gray-100 py-1 px-2.5 rounded-full">{cart.length} items</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Left Column: Items and Progressive Shipping & Timer */}
          <div className="flex-1 flex flex-col gap-3">
            
            {/* Urgency countdown and Progressive delivery indicator grouped */}
            <div className="bg-white md:rounded-xl border border-brand-rose/10 p-3 md:p-4 shadow-sm flex flex-col gap-2.5">
              {/* Urgency Message */}
              <div className="flex items-center gap-2 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-100 px-2.5 py-1.5 rounded-lg">
                <Timer className="w-3.5 h-3.5 text-rose-600 animate-pulse shrink-0" />
                <p>
                  High demand! Items in your bag are reserved for <span className="font-black font-mono bg-rose-200 text-rose-955 px-1 py-0.5 rounded-sm">{formatTime(timeLeft)}</span> mins.
                </p>
              </div>

              {/* Progressive Delivery bar */}
              <div className="text-[11.5px] font-bold text-gray-800">
                <div className="flex justify-between items-center mb-1">
                  <span>
                    {remainingForFreeShipping > 0 ? (
                      <>Add <span className="font-black text-brand-burgundy">₹{remainingForFreeShipping}</span> more for <span className="font-black text-green-700">FREE Delivery</span>! 🚚</>
                    ) : (
                      <span className="text-green-700 font-black flex items-center gap-1">🎉 You have unlocked FREE Delivery!</span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-600 font-black">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-gray-150 h-1.5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="bg-brand-burgundy h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List Container */}
            <div className="bg-white md:rounded-xl border border-brand-rose/10 overflow-hidden shadow-sm">
              <div className="hidden md:flex p-3 border-b border-gray-100 bg-gray-50 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                <span className="flex-1">Products</span>
                <span className="w-24 text-center">Quantity</span>
                <span className="w-24 text-right">Subtotal</span>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 md:p-4 flex gap-3 md:gap-4 items-center">
                    
                    {/* Compact Image */}
                    <div className="w-[64px] h-[80px] md:w-[72px] md:h-[96px] shrink-0 bg-gray-50 border border-brand-rose/10 rounded-lg overflow-hidden relative shadow-sm">
                      <img 
                        src={item.image || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='80' viewBox='0 0 64 80'%3E%3Crect width='64' height='80' fill='%23f8f9fa'/%3E%3C/svg%3E`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Metadata & Info */}
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <h3 className="text-xs md:text-[13px] font-black text-gray-900 line-clamp-1 leading-snug hover:text-brand-burgundy cursor-pointer font-outfit">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-gray-650 font-bold mb-1 hover:underline truncate">
                          {item.brand || item.category_name || 'Premium Product'}
                        </p>
                        
                        {/* Compact Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-black text-gray-700 bg-gray-100/60 px-1.5 py-0.5 border border-brand-rose/10 rounded-md">Size: M</span>
                          <span className="text-[9px] font-black text-gray-700 bg-gray-100/60 px-1.5 py-0.5 border border-brand-rose/10 rounded-md flex items-center gap-1">
                            Color: <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shadow-inner"></span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Controls and Price unified row */}
                      <div className="flex items-center justify-between md:gap-8 mt-1 md:mt-0">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-brand-rose/20 rounded-lg bg-gray-100 overflow-hidden h-6.5">
                          <button 
                            className="w-6 h-full flex items-center justify-center text-gray-750 hover:bg-gray-200 transition active:bg-gray-300" 
                            onClick={() => updateQty(item.id, -1)}
                            aria-label="Decrease Qty"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-gray-900 border-x border-brand-rose/10 h-full flex items-center justify-center bg-white font-mono">
                            {item.qty}
                          </span>
                          <button 
                            className="w-6 h-full flex items-center justify-center text-gray-750 hover:bg-gray-200 transition active:bg-gray-300" 
                            onClick={() => updateQty(item.id, 1)}
                            aria-label="Increase Qty"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price & Delete Column */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-[14px] md:text-[15px] font-black text-gray-900 font-mono">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-450 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-full"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick trust badges for mobile */}
            <div className="bg-white md:rounded-xl border border-brand-rose/10 p-2.5 flex justify-around items-center text-[10px] font-bold text-gray-600 shadow-sm">
               <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-gray-700" /> 100% Genuine</div>
               <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-gray-700" /> Secure checkout</div>
               <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-gray-700" /> Easy returns</div>
            </div>

          </div>

          {/* Right Column: Checkout Pricing Summary & Coupon Card */}
          <div className="w-full md:w-[350px] flex flex-col gap-3 sticky top-[80px] md:self-start">
            
            {/* Interactive Coupon Picker */}
            <div className="bg-white md:rounded-xl border border-brand-rose/10 p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Tag className="w-4 h-4 text-brand-burgundy" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest font-outfit">Coupons & Offers</span>
              </div>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between border-2 border-green-200 bg-green-50/40 rounded-xl p-2.5">
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-green-700 tracking-wider flex items-center gap-1 uppercase">
                      <Percent className="w-3 h-3 shrink-0" /> Applied: {appliedCoupon.code}
                    </div>
                    <div className="text-[10px] text-gray-600 font-bold mt-0.5">
                      Flat discount of ₹{appliedCoupon.discount} saved!
                    </div>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    className="text-[9px] font-black text-rose-700 hover:text-rose-900 uppercase px-2 py-1 bg-white border border-rose-200 rounded-lg active:scale-95 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Enter promo code" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-black text-gray-950 bg-gray-50 uppercase focus:bg-white focus:outline-none focus:border-brand-burgundy/60"
                    />
                    <button 
                      onClick={() => { handleApplyCoupon(couponInput); setCouponInput(''); }}
                      className="bg-brand-burgundy text-white font-extrabold text-xs px-3 py-1.5 rounded-lg active:scale-95 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-700 font-bold px-0.5">{couponError}</p>}
                  
                  {/* Selectable Badges */}
                  <div className="border-t border-gray-50 pt-2.5 flex flex-col gap-1.5">
                    <div 
                      onClick={() => handleApplyCoupon('WELCOME50')}
                      className="flex items-center justify-between p-2 border border-brand-rose/10 hover:border-brand-burgundy/30 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition active:scale-[0.99]"
                    >
                      <div>
                        <span className="inline-block text-[8.5px] font-black bg-brand-burgundy text-white px-1.5 py-0.5 rounded-md mb-0.5">WELCOME50</span>
                        <div className="text-[10px] font-bold text-gray-700">Save ₹50 on orders above ₹500</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div 
                      onClick={() => handleApplyCoupon('DEAL10')}
                      className="flex items-center justify-between p-2 border border-brand-rose/10 hover:border-brand-burgundy/30 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition active:scale-[0.99]"
                    >
                      <div>
                        <span className="inline-block text-[8.5px] font-black bg-brand-burgundy text-white px-1.5 py-0.5 rounded-md mb-0.5">DEAL10</span>
                        <div className="text-[10px] font-bold text-gray-700">Save 10% on orders above ₹1000</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Details summary */}
            <div className="bg-white md:rounded-xl border border-brand-rose/10 p-4 shadow-sm">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3.5 font-outfit">Price Summary</h2>
              
              <div className="flex flex-col gap-2.5 text-xs border-b border-gray-100 pb-3 mb-3.5 font-bold text-gray-750">
                <div className="flex justify-between items-center">
                  <span>Bag Price Total</span>
                  <span className="text-gray-900 font-mono">₹{cartTotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-700 font-black">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-700">
                  <span>Delivery Charges</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-700 font-black uppercase text-[10px] bg-green-50 px-1.5 py-0.5 rounded-sm">Free</span>
                  ) : (
                    <span className="text-gray-900 font-mono">₹{shippingFee.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-5">
                <span className="text-sm font-black text-gray-900 font-outfit">Amount Payable</span>
                <span className="text-lg font-black text-brand-burgundy font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={checkout}
                className="hidden md:flex w-full py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-xl text-xs font-black uppercase tracking-widest items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.98]"
              >
                Proceed to Checkout <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 px-4 py-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] flex items-center justify-between z-40 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div>
          <div className="text-[9px] font-black text-gray-600 uppercase tracking-wider">Grand Total</div>
          <div className="text-lg font-black text-brand-burgundy leading-none font-mono">₹{grandTotal.toFixed(2)}</div>
        </div>
        <button 
          onClick={checkout}
          className="bg-brand-burgundy text-white font-black py-2.5 px-7 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-1 shadow-sm"
        >
          Checkout <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
