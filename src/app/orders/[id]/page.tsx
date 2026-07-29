'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Package, Calendar, ShoppingBag, Box, MapPin, User, Phone, Map, CreditCard, Clock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

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
  Pending: 'bg-amber-100',
  Confirmed: 'bg-blue-100',
  Processing: 'bg-indigo-100',
  Ready: 'bg-purple-100',
  Shipped: 'bg-purple-100',
  Delivered: 'bg-gray-100',
  Cancelled: 'bg-red-100',
  Returned: 'bg-red-100',
  Hold: 'bg-slate-100'
};

const statBgDark: Record<string, string> = {
  Pending: 'bg-amber-500',
  Confirmed: 'bg-blue-500',
  Processing: 'bg-indigo-500',
  Ready: 'bg-purple-500',
  Shipped: 'bg-purple-500',
  Delivered: 'bg-gray-900',
  Cancelled: 'bg-red-500',
  Returned: 'bg-red-500',
  Hold: 'bg-slate-500'
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  
  const { user } = useStore();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        setLoading(false);
        setError('Unauthorized');
        return;
      }

      const fetchOrder = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders.php?order_id=${orderId}`);
          const data = await res.json();
          if (data.status === 'success' && data.data) {
            setOrder(data.data);
          } else {
            setError(data.message || 'Order not found');
          }
        } catch (e) {
          setError('Network error');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [user, mounted, orderId]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-brand-cream/50">
            <AlertCircle className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-xl font-black font-outfit text-gray-900 mb-2">Order Not Found</h3>
        <p className="text-[13px] mb-6 max-w-[250px] font-medium text-gray-500">{error || 'This order does not exist or you do not have permission to view it.'}</p>
        <button onClick={() => router.push('/orders')} className="px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-sm text-[13px] font-bold shadow-sm transition active:scale-95">Back to Orders</button>
      </div>
    );
  }

  const sc = statColors[order.status] || 'text-slate-600';
  const sb = statBg[order.status] || 'bg-slate-100';
  const items = order.items || [];
  const history = order.status_history || [];

  // Resolve phone — API returns customer_mobile from DB
  const customerPhone = order.customer_mobile || order.customer_phone || '—';

  // Resolve address — may be JSON string {name, phone, address} or plain text
  let deliveryAddressText = '—';
  try {
    const da = order.delivery_address;
    if (da && typeof da === 'string') {
      const parsed = JSON.parse(da);
      deliveryAddressText = parsed.address || da;
    } else if (da && typeof da === 'object') {
      deliveryAddressText = da.address || '—';
    }
  } catch {
    deliveryAddressText = order.delivery_address || '—';
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <div className="md:max-w-4xl md:mx-auto md:p-6 pb-24">
        {/* Status Banner */}
        <div className="bg-brand-burgundy md:rounded-sm p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
          <div className="absolute right-[-20px] top-[-20px] opacity-[0.05]">
            <Package className="w-48 h-48" />
          </div>
          <div className="relative z-10">
              <div className="text-[11px] font-bold tracking-widest uppercase text-white/70 mb-1">Order #{order.order_number || order.id}</div>
              <div className="text-2xl md:text-3xl font-black font-outfit mb-1 flex items-center gap-3">
                  {order.status}
                  <span className={`inline-flex ${sb} ${sc} text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold self-center relative -top-1 shadow-sm`}>
                    Current
                  </span>
              </div>
              <div className="text-[13px] font-medium text-white/80 flex items-center gap-1.5 mt-2">
                <Calendar className="w-4 h-4 opacity-70" /> 
                {new Date(order.created_at).toLocaleString('en-IN', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
              </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white md:rounded-sm border border-brand-cream/50 shadow-sm mt-4 md:mt-6 overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-50 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-burgundy" />
              <h2 className="text-[16px] font-extrabold text-gray-900">Order Items</h2>
          </div>
          <div className="px-5">
              {items.map((i: any, idx: number) => (
                <div key={idx} className={`flex items-center gap-4 py-4 ${idx < items.length-1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-12 h-12 bg-brand-cream/20 rounded-sm flex items-center justify-center shrink-0 border border-brand-cream/50">
                      <Box className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate mb-0.5">{i.product_name}</div>
                    <div className="text-xs font-semibold text-gray-500">Qty: {i.quantity} &times; ₹{parseFloat(i.unit_price||'0').toFixed(2)}</div>
                  </div>
                  <div className="font-black text-sm text-gray-900">₹{parseFloat(i.total_price||'0').toFixed(2)}</div>
                </div>
              ))}
          </div>
          <div className="bg-brand-cream/20 p-5 flex justify-between items-center border-t border-brand-cream/50">
            <span className="text-sm font-bold text-gray-600">Total Amount</span>
            <span className="text-xl font-black text-gray-900">₹{parseFloat(order.total_amount||'0').toFixed(2)}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6 px-4 md:px-0">
            {/* Delivery Info */}
            <div className="bg-white rounded-sm border border-brand-cream/50 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-4 md:p-5 border-b border-gray-50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-burgundy" />
                  <h2 className="text-[16px] font-extrabold text-gray-900">Delivery Details</h2>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-cream/20 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-gray-900" /></div>
                  <div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Customer</div><div className="text-sm font-semibold text-gray-800">{order.customer_name}</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-cream/20 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-gray-900" /></div>
                  <div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</div><div className="text-sm font-semibold text-gray-800">{customerPhone}</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-cream/20 flex items-center justify-center shrink-0"><Map className="w-4 h-4 text-gray-900" /></div>
                  <div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</div><div className="text-sm font-semibold text-gray-800 leading-tight">{deliveryAddressText}</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-cream/20 flex items-center justify-center shrink-0"><CreditCard className="w-4 h-4 text-gray-900" /></div>
                  <div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Payment Method</div><div className="text-sm font-semibold text-gray-800">{order.payment_method||'COD'}</div></div>
                </div>
              </div>
            </div>
      
            {/* Status Timeline */}
            {history.length > 0 && (
            <div className="bg-white rounded-sm border border-brand-cream/50 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-4 md:p-5 border-b border-gray-50 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-burgundy" />
                  <h2 className="text-[16px] font-extrabold text-gray-900">Order Timeline</h2>
              </div>
              <div className="p-5 flex-1 relative pl-8">
                <div className="absolute left-[31px] top-8 bottom-8 w-0.5 bg-brand-cream/50 rounded-full"></div>
                <div className="flex flex-col gap-6 relative z-10">
                {history.map((h: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start relative">
                    <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm mt-0.5 shrink-0 ${statBgDark[h.status] || 'bg-slate-400'}`} style={{ marginLeft: '-2px' }}></div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${statColors[h.status] || 'text-gray-900'}`}>{h.status}</div>
                      {h.comments && <div className="text-xs font-medium text-gray-600 mt-1">{h.comments}</div>}
                      <div className="text-[11px] font-semibold text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> 
                        {new Date(h.created_at).toLocaleString('en-IN', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
            )}
        </div>

        {/* Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-brand-cream/50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-40 md:relative md:bg-transparent md:border-t-0 md:shadow-none md:p-0 md:mt-6 flex flex-col sm:flex-row gap-3 md:justify-end pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-0">
          <button onClick={() => router.push('/orders')} className="w-full sm:w-auto py-3 px-6 bg-white border border-brand-rose/20 hover:bg-brand-cream/20 text-gray-700 rounded-sm text-[13px] font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </button>
          <Link href="/" className="w-full sm:w-auto py-3 px-6 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-sm text-[13px] font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm">
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
