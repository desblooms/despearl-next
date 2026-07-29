import React from 'react';
import Link from 'next/link';

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories.php`, { 
      next: { revalidate: 300 },
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {categories.map((c: any) => (
          <Link 
            key={c.id} 
            href={`/shop/${c.id}`}
            className="group relative flex flex-col items-center justify-end overflow-hidden bg-brand-cream/50 shadow-sm aspect-[4/5] md:aspect-[4/5] hover:shadow-md transition-all duration-300 rounded-sm"
          >
            <img 
              src={c.banner || c.thumb || "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=500"} 
              alt={c.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay similar to the reference image */}
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply opacity-80 group-hover:opacity-90 transition-opacity"></div>
            
            <div className="relative z-10 w-full p-3 md:p-4 flex flex-col items-center text-center">
              <h3 className="text-white font-black font-outfit text-lg md:text-xl leading-tight mb-2 tracking-wide uppercase drop-shadow-sm">
                {c.name}
              </h3>
              
              <div className="bg-[#dfa054] hover:bg-[#c38944] text-white text-[9px] md:text-[10px] font-bold px-3 py-1 shadow-sm uppercase tracking-widest rounded-sm transition-colors">
                Explore Now
              </div>
            </div>
            
            {/* Border glow effect on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#dfa054]/50 transition-colors duration-300 pointer-events-none rounded-sm"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
