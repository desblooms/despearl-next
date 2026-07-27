import React from 'react';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { PackageOpen } from 'lucide-react';

async function fetchProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products.php?id=${id}`, { 
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : null;
  } catch (e) {
    return null;
  }
}

async function fetchRelatedProducts(categoryId?: string) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE}/products.php?limit=15`;
    if (categoryId) url += `&category_id=${categoryId}`;
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const relatedProducts = product ? await fetchRelatedProducts(product.category_id) : [];

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white w-full flex items-center justify-center" id="product-detail-wrap">
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
          <PackageOpen className="w-16 h-16 mb-4 opacity-30" />
          <h3 className="text-xl font-black text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-500 font-medium text-sm">The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
