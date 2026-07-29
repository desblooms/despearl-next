'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { MapPin, CreditCard, Banknote, Receipt, Truck, Lock, ShieldCheck, RotateCcw, Check, List, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type SavedAddress = {
  id: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  pin: string;
  lat?: string;
  lng?: string;
  label: string;
};

export default function CheckoutPage() {
  const { cart, user, clearCart, toast } = useStore();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  
  // Checkout Steps
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Saved Address States
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [saveAddressEnabled, setSaveAddressEnabled] = useState(true);
  const [newAddressLabel, setNewAddressLabel] = useState('Home');
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pin: '',
    lat: '',
    lng: '',
    notes: ''
  });
  const [paymentMode, setPaymentMode] = useState('Cash On Delivery');
  const [successOrderNum, setSuccessOrderNum] = useState('');

  // Initial load
  useEffect(() => {
    setMounted(true);
    
    // Load user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }

    // Load saved addresses
    const fetchAddresses = async () => {
      const token = user?.token || (() => { try { const r = localStorage.getItem('foxa_user'); return r ? JSON.parse(r)?.token : null; } catch { return null; } })();
      if (token && user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/addresses.php`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.status === 'success' && data.data) {
            const mapped = data.data.map((a: any) => ({
              id: a.id.toString(),
              name: a.name,
              phone: a.phone || '',
              email: a.email || '',
              street: a.street,
              city: a.city,
              pin: a.pin,
              lat: a.latitude || '',
              lng: a.longitude || '',
              label: a.is_default == 1 ? 'Default' : 'Saved'
            }));
            setSavedAddresses(mapped);
            const defaultAddr = mapped.find((a: SavedAddress) => a.label === 'Default') || mapped[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
              setFormData(prev => ({
                ...prev,
                name: defaultAddr.name,
                phone: defaultAddr.phone,
                email: defaultAddr.email,
                street: defaultAddr.street,
                city: defaultAddr.city,
                pin: defaultAddr.pin,
                lat: defaultAddr.lat || '',
                lng: defaultAddr.lng || '',
              }));
              setCheckoutStep(2);
            }
            return;
          }
        } catch (e) {}
      }
      
      // Fallback for guests
      const storedAddrs = localStorage.getItem('foxa_saved_addresses');
      if (storedAddrs) {
        try {
          const parsed = JSON.parse(storedAddrs);
          setSavedAddresses(parsed);
          if (parsed.length > 0) {
            const addr = parsed[0];
            setSelectedAddressId(addr.id);
            setFormData({
              name: addr.name,
              phone: addr.phone,
              email: addr.email,
              street: addr.street,
              city: addr.city,
              pin: addr.pin,
              lat: addr.lat || '',
              lng: addr.lng || '',
              notes: ''
            });
            setCheckoutStep(2);
          }
        } catch (e) {}
      }
    };
    fetchAddresses();

    // Load applied coupon
    const storedCoupon = localStorage.getItem('foxa_applied_coupon');
    if (storedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(storedCoupon));
      } catch (e) {}
    }
  }, [user]);

  const selectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setFormData(prev => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      email: addr.email,
      street: addr.street,
      city: addr.city,
      pin: addr.pin,
      lat: addr.lat || '',
      lng: addr.lng || ''
    }));
    toast(`Delivery address set to: ${addr.label}`, 'map-pin');
  };

  const handleSaveAndContinue = () => {
    if (!formData.name.trim()) return toast('Please enter your name', 'alert-circle');
    if (!formData.phone.trim()) return toast('Please enter your phone number', 'alert-circle');
    if (!formData.street.trim()) return toast('Please enter your street address', 'alert-circle');
    if (!formData.city.trim()) return toast('Please enter your city', 'alert-circle');
    if (!formData.pin.trim() || formData.pin.trim().length < 6) return toast('Please enter valid 6-digit Pincode', 'alert-circle');

    const newId = `new-${Date.now()}`;
    const newAddr: SavedAddress = {
      id: newId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      pin: formData.pin.trim(),
      lat: formData.lat,
      lng: formData.lng,
      label: newAddressLabel
    };

    setSavedAddresses(prev => [newAddr, ...prev]);
    setSelectedAddressId(newId);
    setIsAddingNewAddress(false);
    setCheckoutStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast("Geolocation is not supported by your browser", 'alert-circle');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data && data.address) {
          const newCity = data.address.city || data.address.town || data.address.village || data.address.county || '';
          const newPin = data.address.postcode || '';
          const newStreet = data.display_name || data.address.road || data.address.suburb || '';
          
          setFormData(prev => ({
            ...prev,
            city: newCity || prev.city,
            pin: newPin || prev.pin,
            street: newStreet ? (prev.street ? `${prev.street}, ${newStreet}` : newStreet) : prev.street,
            lat: latitude.toString(),
            lng: longitude.toString()
          }));
          toast("Location fetched successfully!", 'map-pin');
        }
      } catch (e) {
        console.error("Location fetch failed", e);
        toast("Failed to get address from location.", 'alert-circle');
      }
      setLocLoading(false);
    }, (error) => {
      setLocLoading(false);
      toast("Location access denied or unavailable.", 'alert-circle');
    });
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const shippingThreshold = 1000;
  const shippingFee = subtotal >= shippingThreshold ? 0 : 50;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const placeOrder = async () => {
    if (!formData.name.trim()) return toast('Please enter your name', 'alert-circle');
    if (!formData.phone.trim()) return toast('Please enter your phone number', 'alert-circle');
    if (!formData.street.trim()) return toast('Please enter your street address', 'alert-circle');
    if (!formData.city.trim()) return toast('Please enter your city', 'alert-circle');
    if (!formData.pin.trim() || formData.pin.trim().length < 6) return toast('Please enter valid 6-digit Pincode', 'alert-circle');

    setLoading(true);
    
    const payload = {
      customer_name: formData.name.trim(),
      customer_phone: formData.phone.trim(),
      customer_email: formData.email.trim() || user?.email || '',
      shipping_address: `${formData.street.trim()}, ${formData.city.trim()} - ${formData.pin.trim()}`,
      payment_method: paymentMode,
      notes: formData.notes.trim(),
      coupon_code: appliedCoupon ? appliedCoupon.code : '',
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
        // Save address for future if checked
        if (saveAddressEnabled) {
          const token = user?.token || (() => { try { const r = localStorage.getItem('foxa_user'); return r ? JSON.parse(r)?.token : null; } catch { return null; } })();
          if (token && user) {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/addresses.php`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                  name: formData.name.trim(),
                  phone: formData.phone.trim(),
                  email: formData.email.trim(),
                  street: formData.street.trim(),
                  city: formData.city.trim(),
                  pin: formData.pin.trim(),
                  is_default: savedAddresses.length === 0 ? 1 : 0
                })
              });
            } catch (e) {}
          } else {
            // Guest fallback
            const isAlreadySaved = savedAddresses.some(a => 
              a.street.toLowerCase().trim() === formData.street.toLowerCase().trim() &&
              a.city.toLowerCase().trim() === formData.city.toLowerCase().trim()
            );
            if (!isAlreadySaved) {
              const newAddr: SavedAddress = {
                id: `addr-${Date.now()}`,
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                street: formData.street.trim(),
                city: formData.city.trim(),
                pin: formData.pin.trim(),
                lat: formData.lat,
                lng: formData.lng,
                label: newAddressLabel
              };
              const updated = [newAddr, ...savedAddresses];
              setSavedAddresses(updated);
              localStorage.setItem('foxa_saved_addresses', JSON.stringify(updated));
            }
          }
        }

        // Cleanup
        clearCart();
        localStorage.removeItem('foxa_applied_coupon');
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

  // Order success screen
  if (successOrderNum) {
    return (
      <div className="fixed inset-0 bg-background z-[300] flex flex-col overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 bg-white border border-brand-rose/10 rounded-full flex items-center justify-center mb-5 shadow-sm text-brand-burgundy">
              <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-1.5 font-outfit">Order Placed! 🎉</h2>
          <p className="text-xs font-bold text-gray-700 mb-6 leading-relaxed max-w-[280px]">Your order is received and is being prepared. We will call you shortly to confirm delivery details.</p>
          
          <div className="bg-brand-burgundy/5 border border-brand-burgundy/15 rounded-xl py-2 px-4 mb-6 inline-flex items-center gap-2 text-brand-burgundy font-black text-xs font-mono">
              <Receipt className="w-4 h-4" /> ORDER #{successOrderNum}
          </div>
          
          <div className="w-full flex flex-col gap-2.5">
            <Link href="/orders" className="w-full py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-sm">
              <List className="w-4 h-4" /> Track My Order
            </Link>
            <Link href="/shop" className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-[0.98]">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] pb-12">
      
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-white border-b border-gray-150 sticky top-0 z-30 px-3 py-2.5 flex items-center gap-3">
        <Link href="/cart" className="p-1 -m-1 hover:bg-gray-100 rounded-full transition text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-black text-gray-900 text-[15px] font-outfit">Secure Checkout</span>
      </div>

      <div className="max-w-[1100px] mx-auto px-0 md:px-4 py-2 md:py-6">
        <div className="md:grid md:grid-cols-12 md:gap-6 md:items-start">
          
          {/* Left Column: Delivery & Payment (7 cols) */}
          {/* Left Column: Delivery & Payment (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className={`bg-white border ${checkoutStep === 1 ? 'border-brand-burgundy/40 shadow-sm ring-1 ring-brand-burgundy/10' : 'border-gray-200'} md:rounded-xl overflow-hidden transition-all`}>
              <div className={`px-4 py-3.5 flex items-center justify-between ${checkoutStep === 1 ? 'bg-brand-burgundy/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${checkoutStep === 1 ? 'bg-brand-burgundy text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                  <h2 className="text-[13px] font-black font-outfit text-gray-900 tracking-wide uppercase">Delivery Address</h2>
                </div>
                {checkoutStep === 2 && (
                  <button onClick={() => setCheckoutStep(1)} className="text-brand-burgundy text-[11px] font-bold uppercase hover:underline tracking-wider px-2 py-1">Change</button>
                )}
              </div>
              
              {checkoutStep === 1 && (
                <div className="p-4 bg-white border-t border-brand-burgundy/10">
                  {savedAddresses.length > 0 && !isAddingNewAddress ? (
                    <div className="flex flex-col gap-3">
                      {savedAddresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          onClick={() => selectAddress(addr)}
                          className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all flex flex-col ${selectedAddressId === addr.id ? 'border-brand-burgundy bg-brand-burgundy/5' : 'border-gray-100 hover:border-brand-burgundy/30 bg-white'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'border-brand-burgundy' : 'border-gray-300'}`}>
                              {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-brand-burgundy" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-black text-gray-900">{addr.name}</span>
                                {addr.label && (
                                  <span className="text-[9px] font-black bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{addr.label}</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-700 leading-snug mb-0.5">{addr.street}</p>
                              <p className="text-xs font-bold text-gray-800">{addr.city} - <span className="font-mono">{addr.pin}</span></p>
                              {addr.phone && <p className="text-xs text-gray-500 mt-1 font-medium">{addr.phone}</p>}
                            </div>
                          </div>
                          
                          {selectedAddressId === addr.id && (
                            <div className="mt-4 ml-7">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setCheckoutStep(2); }}
                                className="bg-brand-burgundy text-white px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-brand-burgundy/90 transition-colors w-full sm:w-auto"
                              >
                                Deliver Here
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="mt-2 border-t border-gray-100 pt-4">
                        <button 
                          onClick={() => {
                            setIsAddingNewAddress(true);
                            setFormData(prev => ({
                              ...prev,
                              name: user?.name || '',
                              phone: user?.phone || '',
                              email: user?.email || '',
                              street: '',
                              city: '',
                              pin: '',
                              lat: '',
                              lng: '',
                              notes: prev.notes || ''
                            }));
                          }} 
                          className="flex items-center gap-2 text-brand-burgundy font-black text-[13px] hover:underline"
                        >
                          <span className="text-lg leading-none">+</span> ADD A NEW ADDRESS
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Form Container */}
                      <div className="bg-[#FAF8F5] border border-gray-100 rounded-xl p-4">
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Enter Delivery Details</h3>
                        <div className="flex flex-col gap-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1">Full Name *</label>
                              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-bold text-gray-900 outline-none transition" placeholder="Enter full name" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1">Phone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-bold text-gray-900 outline-none transition" placeholder="10-digit number" required />
                              </div>
                              <div>
                                <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-bold text-gray-900 outline-none transition" placeholder="Optional" />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center my-1">
                            <button type="button" onClick={handleGetLocation} disabled={locLoading} className="w-full sm:w-auto text-[10px] font-extrabold tracking-wide text-[#c78f4e] bg-[#c78f4e]/10 hover:bg-[#c78f4e]/20 px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50">
                              {locLoading ? <div className="w-3.5 h-3.5 border-2 border-[#c78f4e]/30 border-t-[#c78f4e] rounded-full animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                              {locLoading ? 'LOCATING...' : '📍 USE MY CURRENT LOCATION'}
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1">Street Address *</label>
                            <textarea name="street" value={formData.street} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-bold text-gray-900 outline-none transition resize-none" placeholder="House No, Building Name, Street, Area" required rows={2} />
                          </div>

                          <div className="grid grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1">City *</label>
                              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-bold text-gray-900 outline-none transition" placeholder="City / Town" required />
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1">Pincode *</label>
                              <input type="text" name="pin" value={formData.pin} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-bold text-gray-900 outline-none transition" placeholder="6-digit PIN" maxLength={6} required />
                            </div>
                          </div>
                          
                          {/* Address Type/Label */}
                          <div className="mt-2">
                            <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-2">Save Address As</label>
                            <div className="flex gap-2.5">
                              {['Home', 'Work', 'Other'].map(lbl => (
                                <button 
                                  key={lbl} 
                                  type="button" 
                                  onClick={() => setNewAddressLabel(lbl)} 
                                  className={`text-[11px] font-black px-4 py-1.5 rounded-full border transition-all ${newAddressLabel === lbl ? 'bg-brand-burgundy border-brand-burgundy text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                >
                                  {lbl}
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button 
                          onClick={handleSaveAndContinue} 
                          className="bg-brand-burgundy text-white px-8 py-3.5 rounded-xl text-[13px] font-black uppercase tracking-wider shadow-md hover:bg-brand-burgundy/90 transition-all w-full sm:w-auto"
                        >
                          Save & Deliver Here
                        </button>
                        {savedAddresses.length > 0 && (
                          <button 
                            onClick={() => setIsAddingNewAddress(false)} 
                            className="text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wide px-4 py-3 w-full sm:w-auto"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-start gap-3">
                   {/* Summary of selected address */}
                   <div className="text-gray-800 w-full">
                     <p className="text-[13px] font-black text-black">{formData.name} <span className="font-bold text-gray-600 text-xs ml-2">{formData.phone}</span></p>
                     <p className="text-xs text-gray-700 mt-1 leading-snug">{formData.street}, {formData.city} - {formData.pin}</p>
                   </div>
                </div>
              )}
            </div>
            
            {/* STEP 2: PAYMENT OPTIONS */}
            <div className={`bg-white border ${checkoutStep === 2 ? 'border-brand-burgundy/40 shadow-sm ring-1 ring-brand-burgundy/10' : 'border-gray-200'} md:rounded-xl overflow-hidden transition-all`}>
              <div className={`px-4 py-3.5 flex items-center justify-between ${checkoutStep === 2 ? 'bg-brand-burgundy/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${checkoutStep === 2 ? 'bg-brand-burgundy text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                  <h2 className="text-[13px] font-black font-outfit text-gray-900 tracking-wide uppercase">Payment Options</h2>
                </div>
              </div>
              
              {checkoutStep === 2 && (
                <div className="p-4 bg-white border-t border-brand-burgundy/10">
                  <div className="flex flex-col gap-3">
                    <div 
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMode === 'Cash On Delivery' ? 'border-brand-burgundy bg-brand-burgundy/5' : 'border-gray-100 bg-white hover:border-gray-300'}`} 
                      onClick={() => setPaymentMode('Cash On Delivery')}
                    >
                      <input type="radio" className="w-4 h-4 accent-brand-burgundy shrink-0" name="payment" value="Cash On Delivery" checked={paymentMode === 'Cash On Delivery'} readOnly />
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Banknote className={`w-5 h-5 ${paymentMode === 'Cash On Delivery' ? 'text-brand-burgundy' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-sm text-gray-900">Cash on Delivery (COD)</div>
                        <div className="text-xs text-gray-500 mt-0.5">Pay in cash or UPI when order gets delivered</div>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMode === 'Card On Delivery' ? 'border-brand-burgundy bg-brand-burgundy/5' : 'border-gray-100 bg-white hover:border-gray-300'}`} 
                      onClick={() => setPaymentMode('Card On Delivery')}
                    >
                      <input type="radio" className="w-4 h-4 accent-brand-burgundy shrink-0" name="payment" value="Card On Delivery" checked={paymentMode === 'Card On Delivery'} readOnly />
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        <CreditCard className={`w-5 h-5 ${paymentMode === 'Card On Delivery' ? 'text-brand-burgundy' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-sm text-gray-900">Card on Delivery</div>
                        <div className="text-xs text-gray-500 mt-0.5">Swipe your card at the time of delivery</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Notes */}
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-widest mb-1.5">Order Notes (optional)</label>
                    <textarea 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleChange} 
                      className="w-full bg-[#FAF8F5] border border-gray-200 focus:border-brand-burgundy focus:ring-2 focus:ring-brand-burgundy/10 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-900 outline-none transition resize-none" 
                      rows={2} 
                      placeholder="E.g. Delivery timings, landmark, leave at gate..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Order Summary (5 cols) */}
          <div className="md:col-span-5 md:mt-0">
            <div className="bg-white border border-brand-rose/10 md:rounded-xl p-4 shadow-sm sticky top-[80px]">
              <h2 className="text-[14px] font-black font-outfit text-gray-900 mb-3.5 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Receipt className="w-4.5 h-4.5 text-brand-burgundy" /> ORDER SUMMARY
              </h2>
              
              {/* Tight Compact Cart Items list */}
              <div className="mb-4 max-h-[220px] overflow-y-auto no-scrollbar pr-1 flex flex-col gap-2.5">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
                    <img 
                      src={item.image || `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22%3E%3Crect width=%2232%22 height=%2232%22 fill=%22%23f8f9fa%22/%3E%3C/svg%3E`} 
                      className="w-8 h-8 rounded-md object-cover bg-gray-50 shrink-0 border border-brand-rose/10" 
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22%3E%3Crect width=%2232%22 height=%2232%22 fill=%22%23f8f9fa%22/%3E%3C/svg%3E`;
                      }} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black text-gray-900 truncate font-outfit leading-tight">{item.name}</div>
                      <div className="text-[9.5px] font-bold text-gray-600 mt-0.5">Qty: {item.qty}</div>
                    </div>
                    <div className="font-black text-xs text-gray-900 font-mono">₹{(Number(item.price) * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              {/* Billing Breakdowns */}
              <div className="space-y-2.5 pt-3.5 border-t border-gray-100 text-xs font-bold text-gray-700">
                <div className="flex justify-between items-center">
                  <span>Items Subtotal ({count} items)</span>
                  <span className="text-gray-900 font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-[#c78f4e] font-black">
                    <span>Coupon Savings ({appliedCoupon.code})</span>
                    <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping Charges</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-700 font-black uppercase text-[10px] bg-green-50 px-1.5 py-0.5 rounded-sm">Free</span>
                  ) : (
                    <span className="text-gray-900 font-mono">₹{shippingFee.toFixed(2)}</span>
                  )}
                </div>
              </div>
              
              {/* Payable Grand Total */}
              <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-gray-100 mb-5">
                <span className="text-sm font-black text-gray-900 font-outfit">Total Payable</span>
                <span className="text-xl font-black text-brand-burgundy font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
              
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50 md:static md:p-0 md:bg-transparent md:border-t-0 md:z-auto mt-4">
                <button 
                  type="button"
                  disabled={loading}
                  onClick={placeOrder}
                  className="w-full bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-extrabold uppercase tracking-wide py-3.5 px-4 rounded-xl shadow-lg shadow-brand-burgundy/20 flex justify-center items-center gap-2 group transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Place Order — <span className="font-mono">₹{grandTotal.toFixed(2)}</span></>
                  )}
                </button>
              </div>
              
              {/* Trust assurances */}
              <div className="flex justify-center items-center gap-2.5 mt-4 text-[9px] font-black text-gray-600 tracking-wider uppercase">
                <span className="flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Secure Pay</span>
                <span>&bull;</span>
                <span className="flex items-center gap-0.5"><Truck className="w-3 h-3" /> Fast Delivery</span>
                <span>&bull;</span>
                <span className="flex items-center gap-0.5"><RotateCcw className="w-3 h-3" /> Easy Returns</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
