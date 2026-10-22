import React from 'react';
import CategoriesGrid from '@/components/CategoriesGrid';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://app.votee.in/api/ecommerce';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://despearl.com';

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories.php`, { 
      next: { revalidate: 300 },
      headers: { 'Origin': SITE_URL }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

export default async function CategoriesBannersPage() {
  const categories = await fetchCategories();

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black font-outfit text-gray-900 tracking-tight mb-1">Shop by Category</h1>
        <p className="text-[11px] text-gray-500 font-medium">Explore our wide range of collections</p>
      </div>
      <CategoriesGrid categories={categories} />
    </div>
  );
}
