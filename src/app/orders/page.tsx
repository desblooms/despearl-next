'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Order = {
  id: number;
  order_number: string;
  created_at: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Ready' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Hold';
  item_count: number;
  payment_method: string;
  total_amount: string;
};

const statColors: Record<string, string> = {
  Pending: 'text-amber-600',
  Confirmed: 'text-blue-600',
  Processing: 'text-indigo-600',
  Ready: 'text-purple-600',
  Shipped: 'text-purple-600',
  Delivered: 'text-gray-900',
  Cancelled: 'text-red-600',
  Returned: 'text-red-600',
  Hold: 'text-slate-600'
};

const statBg: Record<string, string> = {
  Pending: 'bg-amber-50 border-amber-100',
  Confirmed: 'bg-blue-50 border-blue-100',
  Processing: 'bg-indigo-50 border-indigo-100',
  Ready: 'bg-purple-50 border-purple-100',
  Shipped: 'bg-purple-50 border-purple-100',
  Delivered: 'bg-gray-50 border-gray-200',
  Cancelled: 'bg-red-50 border-red-100',
  Returned: 'bg-red-50 border-red-100',
  Hold: 'bg-slate-50 border-slate-100'
};

export default function OrdersPage() {
  const { user, setAuthOpen } = useStore();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        setLoading(false);
        return;
      }

      const fetchOrders = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders.php?email=${encodeURIComponent(user.email)}`);
          const data = await res.json();
          if (data.status === 'success') {
            setOrders(data.data || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user, mounted]);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-brand-cream/50">
            <Lock className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-xl font-black font-outfit text-gray-900 mb-2">Sign In Required</h3>
        <p className="text-[13px] mb-6 max-w-[250px] font-medium text-gray-500">Please sign in to view your order history</p>
        <button 
          onClick={() => setAuthOpen(true)} 
          className="px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-sm text-[13px] font-bold shadow-sm transition active:scale-95"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-brand-cream/50">
            <ShoppingBag className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-xl font-black font-outfit text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-[13px] mb-6 max-w-[250px] font-medium text-gray-500">You haven't placed any orders. Start shopping now!</p>
        <Link href="/" className="px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-sm text-[13px] font-bold shadow-sm transition active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] pb-20">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/profile')} className="w-9 h-9 rounded-full bg-white border border-brand-rose/20 flex items-center justify-center hover:bg-brand-cream/20 transition active:scale-95 shrink-0">
            <ArrowLeft className="w-4 h-4 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-outfit text-gray-900">My Orders</h1>
            <p className="text-[10px] md:text-xs font-bold text-brand-burgundy uppercase tracking-wider">{orders.length} orders found</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {orders.map((o) => {
            const sc = statColors[o.status] || 'text-slate-600';
            const sb = statBg[o.status] || 'bg-slate-50 border-slate-100';
            
            let prog = 1;
            if (['Confirmed', 'Processing'].includes(o.status)) prog = 2;
            if (['Shipped', 'Ready'].includes(o.status)) prog = 3;
            if (o.status === 'Delivered') prog = 4;
            if (['Cancelled', 'Returned'].includes(o.status)) prog = 0;

            return (
              <div 
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="bg-white border border-brand-cream/50 rounded-sm overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition hover:border-brand-burgundy/30 group"
              >
                <div className="p-4 flex items-center justify-between border-b border-gray-50">
                  <div>
                    <div className="font-extrabold text-[13px] text-gray-900 mb-0.5 group-hover:text-brand-burgundy transition">
                      #{o.order_number || o.id}
                    </div>
                    <div className="text-[11px] font-semibold text-gray-400">
                      {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-wide uppercase border ${sb} ${sc}`}>
                    {o.status}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 mb-0.5">Items & Payment</div>
                      <div className="text-[13px] font-semibold text-gray-800">{o.item_count || '—'} items &bull; {o.payment_method || 'COD'}</div>
                    </div>
                    <div className="text-base font-black font-outfit text-gray-900">₹{parseFloat(o.total_amount || '0').toFixed(2)}</div>
                  </div>
                  
                  {prog > 0 && (
                    <div className="flex gap-1 mt-2">
                      <div className={`flex-1 h-1 rounded-sm ${prog >= 1 ? 'bg-[#dfa054]' : 'bg-brand-cream/50'}`}></div>
                      <div className={`flex-1 h-1 rounded-sm ${prog >= 2 ? 'bg-[#dfa054]' : 'bg-brand-cream/50'}`}></div>
                      <div className={`flex-1 h-1 rounded-sm ${prog >= 3 ? 'bg-[#dfa054]' : 'bg-brand-cream/50'}`}></div>
                      <div className={`flex-1 h-1 rounded-sm ${prog >= 4 ? 'bg-[#dfa054]' : 'bg-brand-cream/50'}`}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
