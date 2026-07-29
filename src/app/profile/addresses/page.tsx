'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { ArrowLeft, Plus, MapPin, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SavedAddress {
  id: number;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  pin: string;
  is_default: number;
}

export default function AddressesPage() {
  const { user } = useStore();
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (user?.token) return user.token;
    try {
      const raw = localStorage.getItem('foxa_user');
      return raw ? JSON.parse(raw)?.token : null;
    } catch { return null; }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/addresses.php`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setAddresses(data.data || []);
        }
      } catch (e) {}
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      router.push('/profile');
      return;
    }
    fetchAddresses();
  }, [user, router]);

  const deleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/addresses.php?id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setAddresses(prev => prev.filter(a => a.id !== id));
        }
      } catch (e) {}
    }
  };

  const setAsDefault = async (addr: SavedAddress) => {
    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/addresses.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...addr, is_default: 1 })
        });
        const data = await res.json();
        if (data.status === 'success') {
          fetchAddresses();
        }
      } catch (e) {}
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 md:px-8 py-3 border-b border-gray-100 flex items-center justify-center relative sticky top-0 z-20">
        <Link href="/profile" className="absolute left-4 md:left-8 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </Link>
        <h1 className="text-lg font-black font-outfit text-brand-espresso text-center">Saved Addresses</h1>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-brand-burgundy rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <Link href="/profile/addresses/add" className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-burgundy hover:bg-brand-burgundy/5 transition-colors min-h-[160px] group">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-brand-burgundy/10 flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-brand-burgundy transition-colors" />
              </div>
              <h3 className="font-bold text-gray-700 group-hover:text-brand-burgundy transition-colors">Add New Address</h3>
              <p className="text-xs text-gray-500 mt-1">Deliver to a different location</p>
            </Link>

            {addresses.map(addr => (
              <div key={addr.id} className={`bg-white border rounded-2xl p-5 shadow-sm relative flex flex-col transition-all ${addr.is_default == 1 ? 'border-brand-burgundy shadow-brand-burgundy/10' : 'border-gray-100'}`}>
                {addr.is_default == 1 && (
                  <div className="absolute top-0 right-0 bg-brand-burgundy text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-2xl flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> Default
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-cream/50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{addr.name}</h3>
                    {addr.phone && <p className="text-xs text-gray-500 mt-0.5 font-medium">{addr.phone}</p>}
                  </div>
                </div>

                <div className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                  <p>{addr.street}</p>
                  <p className="mt-0.5">{addr.city} - <span className="font-mono font-semibold text-gray-800">{addr.pin}</span></p>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                  {addr.is_default == 0 && (
                    <button onClick={() => setAsDefault(addr)} className="text-[11px] font-bold text-brand-burgundy hover:text-brand-rose transition-colors uppercase tracking-wider mr-auto">
                      Make Default
                    </button>
                  )}
                  <Link href={`/profile/addresses/edit/${addr.id}`} className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center transition-colors ml-auto">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deleteAddress(addr.id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
