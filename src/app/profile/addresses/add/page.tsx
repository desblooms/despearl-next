'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function AddAddressPage() {
  const router = useRouter();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pin: '',
    lat: '',
    lng: '',
    is_default: false
  });

  useEffect(() => {
    if (!user) {
      router.push('/profile');
    }
  }, [user, router]);

  const getToken = () => {
    // Use token directly from context user object (most reliable)
    if (user?.token) return user.token;
    // Fallback: read from localStorage
    try {
      const raw = localStorage.getItem('foxa_user');
      return raw ? JSON.parse(raw)?.token : null;
    } catch { return null; }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
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
            street: newStreet || prev.street,
            lat: latitude.toString(),
            lng: longitude.toString()
          }));
        }
      } catch (e) {
        alert('Failed to get address from location.');
      }
      setLocLoading(false);
    }, () => {
      setLocLoading(false);
      alert('Location access denied or unavailable.');
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.street || !formData.city || !formData.pin) {
      alert('Please fill out: Name, Address, City, and Pincode');
      return;
    }
    const token = getToken();
    console.log('[AddAddress] token:', token ? 'found' : 'MISSING');
    console.log('[AddAddress] payload:', formData);
    if (!token) {
      alert('Session expired. Please log in again.');
      router.push('/profile');
      return;
    }
    setLoading(true);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/addresses.php`;
    console.log('[AddAddress] posting to:', apiUrl);
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...formData, is_default: formData.is_default ? 1 : 0 })
    })
    .then(r => r.json())
    .then(data => {
      console.log('[AddAddress] response:', data);
      if (data.status === 'success') {
        router.push('/profile/addresses');
      } else {
        alert(data.message || data.error || JSON.stringify(data));
      }
    })
    .catch((err) => {
      console.error('[AddAddress] error:', err);
      alert('Network error. Please try again.');
    })
    .finally(() => setLoading(false));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Compact Header */}
      <div className="bg-white px-4 md:px-8 py-3 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-20">
        <Link href="/profile/addresses" className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </Link>
        <h1 className="text-lg font-black font-outfit text-brand-espresso">Add New Address</h1>
      </div>

      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-5">

            {/* Name + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy transition-all outline-none"
                  placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy transition-all outline-none"
                  placeholder="10-digit mobile number" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email (Optional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy transition-all outline-none"
                placeholder="For delivery updates" />
            </div>

            {/* Use My Location */}
            <button type="button" onClick={handleGetLocation} disabled={locLoading}
              className="w-full text-xs font-bold text-[#c78f4e] bg-[#c78f4e]/10 hover:bg-[#c78f4e]/20 px-3 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50">
              {locLoading
                ? <div className="w-3.5 h-3.5 border-2 border-[#c78f4e]/30 border-t-[#c78f4e] rounded-full animate-spin" />
                : <MapPin className="w-3.5 h-3.5" />}
              {locLoading ? 'Fetching Location...' : 'Use My Current Location'}
            </button>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Complete Address *</label>
              <textarea name="street" value={formData.street} onChange={handleChange} rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy transition-all outline-none resize-none"
                placeholder="House No, Building, Street, Area" />
            </div>

            {/* City + Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">City/Town *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy transition-all outline-none"
                  placeholder="e.g. Kochi" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Pincode *</label>
                <input type="text" name="pin" value={formData.pin} onChange={handleChange} maxLength={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy transition-all outline-none"
                  placeholder="6-digit code" />
              </div>
            </div>

            {/* Default checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="peer sr-only" />
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:bg-brand-burgundy peer-checked:border-brand-burgundy transition-colors"></div>
                  <svg className="absolute w-4 h-4 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-burgundy transition-colors">Make this my default address</span>
              </label>
            </div>

          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className="w-full bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-extrabold uppercase tracking-wide py-3.5 px-4 rounded-xl shadow-lg shadow-brand-burgundy/20 flex justify-center items-center gap-2 transition-all disabled:opacity-70"
        >
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save Address</>}
        </button>
      </div>
    </div>
  );
}
