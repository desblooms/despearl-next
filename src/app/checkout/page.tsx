'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, CartItem } from '@/context/StoreContext';
import { MapPin, CreditCard, Banknote, Receipt, Truck, Lock, ShieldCheck, RotateCcw, Check, List, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, user, clearCart, toast } = useStore();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pin: '',
    notes: ''
  });
  const [paymentMode, setPaymentMode] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const [successOrderNum, setSuccessOrderNum] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const count = cart.reduce((acc, item) => acc + item.qty, 0);

  const placeOrder = async () => {
    if (!formData.name.trim()) return toast('Please enter your name', 'alert-circle');
    if (!formData.phone.trim()) return toast('Please enter your phone number', 'alert-circle');
    if (!formData.street.trim()) return toast('Please enter your street address', 'alert-circle');
    if (!formData.city.trim()) return toast('Please enter your city', 'alert-circle');

    setLoading(true);
    
    const payload = {
      customer_name: formData.name.trim(),
      customer_phone: formData.phone.trim(),
      customer_email: formData.email.trim(),
      shipping_address: `${formData.street.trim()}, ${formData.city.trim()}${formData.pin.trim() ? ', ' + formData.pin.trim() : ''}`,
      payment_method: paymentMode,
      notes: formData.notes.trim(),
      items: cart.map(i => ({ product_id: i.id, quantity: i.qty }))
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        clearCart();
        setSuccessOrderNum(data.data.order_number);
      } else {
        toast(data.message || 'Order failed. Please try again.', 'alert-circle');
      }
    } catch (e) {
      toast('Network error. Please try again.', 'alert-circle');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (successOrderNum) {
    return (
      <div className="fixed inset-0 bg-white z-[300] flex flex-col overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 shadow-sm text-gray-900 border border-gray-200">
              <Check className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
          <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">Your order has been received and is being reviewed by our team. We'll call you shortly to confirm.</p>
          
          <div className="bg-brand-cream/20 border border-brand-cream/50 rounded-xl py-2 px-4 mb-6 inline-flex items-center gap-2 text-gray-900 font-bold text-sm">
              <Receipt className="w-4 h-4" /> Order #{successOrderNum}
          </div>
          
          <div className="w-full flex flex-col gap-2.5">
            <Link href="/" className="w-full py-3 bg-brand-espresso hover:bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-sm">
              <List className="w-4 h-4" /> Track My Order
            </Link>
            <Link href="/" className="w-full py-3 bg-[#f8f9fa] hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition active:scale-[0.98]">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#f8f9fa] min-h-[calc(100vh-64px)] pb-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 mt-10 max-w-sm mx-auto">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-brand-cream/50">
              <ShoppingBag className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Cart is Empty</h3>
          <p className="text-sm mb-5">Add products to your cart before checking out</p>
          <Link href="/" className="px-6 py-2.5 bg-brand-espresso text-white rounded-xl font-bold shadow-sm">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-64px)] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 md:grid md:grid-cols-12 md:gap-8 md:items-start pt-6 md:pt-10">
        
        {/* Left Column (Delivery & Payment) */}
        <div className="md:col-span-7 flex flex-col gap-5 md:gap-6">
            
            {/* Delivery Details */}
            <div className="bg-white border border-brand-cream/50 rounded-sm p-4 md:p-5 shadow-sm">
              <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 mb-5 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-burgundy" /> Delivery Details</h2>
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" placeholder="Enter your full name" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" placeholder="+91 9999999999" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" placeholder="you@email.com" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Street Address *</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" placeholder="House No, Street, Area" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" placeholder="City" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pincode *</label>
                  <input type="text" name="pin" value={formData.pin} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" placeholder="500001" maxLength={6} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Order Notes (optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-brand-burgundy focus:ring-4 focus:ring-brand-burgundy/10 focus:bg-white rounded-xl py-3 px-4 text-[16px] font-bold text-gray-900 outline-none transition" rows={2} placeholder="Any special instructions..."></textarea>
              </div>
            </div>
            
            <div className="bg-white border border-brand-cream/50 rounded-sm p-4 md:p-5 shadow-sm mt-4">
              <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 mb-5 flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-burgundy" /> Payment Method</h2>
              
              <div className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer mb-3 transition shadow-sm ${paymentMode === 'Cash On Delivery' ? 'border-brand-espresso bg-brand-cream/20' : 'border-brand-cream/50 hover:border-brand-rose/20 bg-white'}`} onClick={() => setPaymentMode('Cash On Delivery')}>
                <div className="w-10 h-10 rounded-full bg-white border border-brand-rose/20 flex items-center justify-center shrink-0 shadow-sm"><Banknote className={`w-5 h-5 ${paymentMode === 'Cash On Delivery' ? 'text-gray-900' : 'text-gray-500'}`} /></div>
                <div className="flex-1">
                  <div className="font-bold text-[14px] text-gray-900">Cash on Delivery</div>
                  <div className="text-[12px] text-gray-500 font-medium">Pay when your order arrives</div>
                </div>
                <input type="radio" className="w-4 h-4 accent-gray-900" name="payment" value="Cash On Delivery" checked={paymentMode === 'Cash On Delivery'} readOnly />
              </div>
              
              <div className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${paymentMode === 'Card On Delivery' ? 'border-brand-espresso bg-brand-cream/20' : 'border-brand-cream/50 hover:border-brand-rose/20 bg-white'}`} onClick={() => setPaymentMode('Card On Delivery')}>
                <div className="w-10 h-10 rounded-full bg-white border border-brand-rose/20 flex items-center justify-center shrink-0 shadow-sm"><CreditCard className={`w-5 h-5 ${paymentMode === 'Card On Delivery' ? 'text-gray-900' : 'text-gray-500'}`} /></div>
                <div className="flex-1">
                  <div className="font-bold text-[14px] text-gray-900">Card on Delivery</div>
                  <div className="text-[12px] text-gray-500 font-medium">Pay by card when delivered</div>
                </div>
                <input type="radio" className="w-4 h-4 accent-gray-900" name="payment" value="Card On Delivery" checked={paymentMode === 'Card On Delivery'} readOnly />
              </div>
            </div>
            
        </div>
        
        {/* Right Column (Order Summary) */}
        <div className="md:col-span-5 md:mt-0">
            <div className="bg-white border border-brand-cream/50 rounded-sm p-4 md:p-5 shadow-sm sticky top-[80px]">
              <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 mb-5 flex items-center gap-2"><Receipt className="w-5 h-5 text-brand-burgundy" /> Order Summary</h2>
              
              <div className="mb-5 max-h-[300px] overflow-y-auto no-scrollbar pr-2 flex flex-col gap-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <img 
                      src={item.image || `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23f1f5f9%22/%3E%3C/svg%3E`} 
                      className="w-10 h-10 rounded-xl object-cover bg-[#f8f9fa] shrink-0 border border-brand-cream/50" 
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23f1f5f9%22/%3E%3C/svg%3E`;
                      }} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">{item.name}</div>
                      <div className="text-[11px] font-semibold text-gray-500">Qty: {item.qty}</div>
                    </div>
                    <div className="font-extrabold text-xs text-gray-900">₹{(Number(item.price) * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-5 border-t border-brand-cream/50">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Subtotal (<span>{count}</span> items)</span>
                    <span className="text-base font-bold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500 flex items-center gap-1.5"><Truck className="w-4 h-4" /> Delivery</span>
                    <span className="text-[14px] font-bold text-gray-900 uppercase">Free</span>
                  </div>
              </div>
              
              <div className="flex justify-between items-center mt-5 pt-5 border-t border-brand-cream/50 mb-6">
                <span className="text-base font-black text-gray-900">Grand Total</span>
                <span className="text-2xl font-black text-gray-900">₹{total.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={placeOrder} 
                disabled={loading}
                className="w-full py-3.5 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-sm text-[16px] font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : <><Lock className="w-4 h-4" /> Place Order — <span>₹{total.toFixed(2)}</span></>}
              </button>
              
              <div className="flex justify-center items-center gap-3 mt-4 text-[10px] font-semibold text-gray-400">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Returns</span>
              </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
