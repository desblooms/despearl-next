'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  User, 
  ListTodo, 
  Truck, 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

// ── Static Keywords & Data ──

const KERALA_DISTRICTS = [
  { name: 'Kochi (Cochin)', query: 'Kochi' },
  { name: 'Ernakulam', query: 'Ernakulam' },
  { name: 'Kozhikode (Calicut)', query: 'Calicut' },
  { name: 'Thiruvananthapuram (Trivandrum)', query: 'Trivandrum' },
  { name: 'Thrissur', query: 'Thrissur' },
  { name: 'Malappuram', query: 'Malappuram' },
  { name: 'Kannur', query: 'Kannur' },
  { name: 'Kottayam', query: 'Kottayam' },
  { name: 'Kollam', query: 'Kollam' },
  { name: 'Palakkad', query: 'Palakkad' },
  { name: 'Alappuzha (Alleppey)', query: 'Alappuzha' },
  { name: 'Kasaragod', query: 'Kasaragod' },
  { name: 'Wayanad', query: 'Wayanad' },
  { name: 'Pathanamthitta', query: 'Pathanamthitta' },
  { name: 'Idukki', query: 'Idukki' }
];

const KERALA_POPULAR_SEARCHES = [
  { text: 'Online Furniture Store Kerala', query: 'Furniture Kerala' },
  { text: 'Best Furniture Shop in Kochi', query: 'Furniture Kochi' },
  { text: 'Wooden Furniture in Kozhikode', query: 'Wooden Furniture Calicut' },
  { text: 'Luxury Sofa Sets Ernakulam', query: 'Sofa Ernakulam' },
  { text: 'Teak Wood Cot Kerala Price', query: 'Teak Wood Bed' },
  { text: 'Dining Table Sets Thrissur', query: 'Dining Table Thrissur' },
  { text: 'Customized Wardrobes Kannur', query: 'Wardrobe Kannur' },
  { text: 'Home Furnishing Showroom Trivandrum', query: 'Home Decor Trivandrum' },
  { text: 'Modular Kitchen & Wardrobe Malappuram', query: 'Wardrobe Malappuram' },
  { text: 'Apartment Furniture Packages Kochi', query: 'Apartment Furniture' },
  { text: 'Resort & Homestay Furniture Wayanad', query: 'Resort Furniture' },
  { text: 'Solid Wood Cot with Storage Kerala', query: 'Storage Bed' },
  { text: 'Traditional Kerala Style Woodwork', query: 'Traditional Wooden' },
  { text: 'Doorstep Furniture Delivery All Kerala', query: 'Furniture Kerala' }
];

const CATEGORY_KEYWORDS = [
  {
    category: 'Living Room Furniture',
    keywords: [
      { text: 'L-Shape Corner Sofas', query: 'L-Shape Sofa' },
      { text: '3+2 Wooden Sofa Sets', query: 'Wooden Sofa' },
      { text: 'Recliner Chairs', query: 'Recliner' },
      { text: 'Chesterfield Couches', query: 'Chesterfield Sofa' },
      { text: 'Solid Teak Coffee Tables', query: 'Coffee Table' },
      { text: 'Minimalist TV Units', query: 'TV Unit' },
      { text: 'Wall Mounted Entertainment Centers', query: 'Entertainment Unit' },
      { text: 'Accent Lounge Chairs', query: 'Accent Chair' },
      { text: 'Shoe Racks with Padded Seat', query: 'Shoe Rack' },
      { text: 'Designer Center Tables', query: 'Center Table' }
    ]
  },
  {
    category: 'Bedroom Furniture',
    keywords: [
      { text: 'King Size Wooden Beds', query: 'King Size Bed' },
      { text: 'Queen Size Hydraulic Storage Beds', query: 'Hydraulic Bed' },
      { text: 'Solid Teak Wood Cots', query: 'Teak Cot' },
      { text: '3-Door & 4-Door Wardrobes', query: 'Wardrobe' },
      { text: 'Sliding Door Wardrobes with Mirror', query: 'Sliding Wardrobe' },
      { text: 'Dressing Tables with LED Mirror', query: 'Dressing Table' },
      { text: 'Bedside Nightstand Tables', query: 'Bedside Table' },
      { text: 'Orthopedic Memory Foam Mattresses', query: 'Mattress' },
      { text: 'Chest of Drawers & Storage', query: 'Chest of Drawers' }
    ]
  },
  {
    category: 'Dining & Kitchen Furniture',
    keywords: [
      { text: '6-Seater Solid Wood Dining Sets', query: '6 Seater Dining' },
      { text: '4-Seater Compact Dining Tables', query: '4 Seater Dining' },
      { text: 'Italian Marble Top Dining Tables', query: 'Marble Dining Table' },
      { text: 'Cushioned Wooden Dining Chairs', query: 'Dining Chair' },
      { text: 'Glass Top Modern Dining Sets', query: 'Dining Table' },
      { text: 'Crockery Display Cabinets', query: 'Crockery Unit' },
      { text: 'Kitchen Breakfast Bar Stools', query: 'Bar Stool' }
    ]
  },
  {
    category: 'Study & Home Office',
    keywords: [
      { text: 'Ergonomic High-Back Office Chairs', query: 'Office Chair' },
      { text: 'Work-From-Home Computer Desks', query: 'Computer Desk' },
      { text: 'Solid Wood Study Tables with Bookshelf', query: 'Study Table' },
      { text: 'Executive Office Desks', query: 'Executive Desk' },
      { text: 'Compact Writing Tables', query: 'Office Desk' },
      { text: 'Modern Book Shelves & Racks', query: 'Book Shelf' }
    ]
  },
  {
    category: 'Balcony, Outdoor & Accents',
    keywords: [
      { text: 'Weatherproof Balcony Bistro Sets', query: 'Balcony Furniture' },
      { text: 'Garden Swing Chairs (Jhula)', query: 'Swing Chair' },
      { text: 'Cane & Rattan Outdoor Chairs', query: 'Outdoor Chair' },
      { text: 'Full Length Floor Dressing Mirrors', query: 'Mirror' },
      { text: 'Aesthetic Wall Art & Decor Panels', query: 'Wall Decor' },
      { text: 'Entryway Decorative Console Tables', query: 'Console Table' }
    ]
  }
];

const AUDIENCE_TYPE_KEYWORDS = [
  {
    audience: 'New Home Builders & Housewarming (Gruhapravesam)',
    description: 'Complete home packages curated for traditional and modern Kerala homes.',
    keywords: [
      { text: 'Complete 3BHK Home Furnishing Package', query: 'Home Package' },
      { text: '4BHK Luxury Villa Furniture Set', query: 'Villa Furniture' },
      { text: 'Gruhapravesam Special Furniture Offers', query: 'Offers' },
      { text: 'Traditional Kerala Woodwork & Nalukettu Style', query: 'Traditional Wooden' },
      { text: 'Custom Master Bedroom Sets', query: 'Bedroom Set' }
    ]
  },
  {
    audience: 'Apartment & Flat Dwellers (Kochi, Calicut, Trivandrum)',
    description: 'Smart, compact, and modular designs tailored for high-rise apartment living.',
    keywords: [
      { text: 'Space-Saving Furniture for Apartments', query: 'Space Saving' },
      { text: 'Multifunctional Sofa Cum Bed', query: 'Sofa Bed' },
      { text: 'Compact Foldable Dining Sets', query: 'Dining Table' },
      { text: 'Sliding Wardrobes for Small Rooms', query: 'Sliding Wardrobe' },
      { text: 'Modular Living Room Storage', query: 'Storage Unit' }
    ]
  },
  {
    audience: 'NRI & Gulf Malayalee Families',
    description: 'Convenient online ordering for your family home in Kerala with doorstep installation.',
    keywords: [
      { text: 'Send Furniture to Kerala for Family (Gulf / NRI)', query: 'Furniture Kerala' },
      { text: 'NRI Online Furniture Booking with Delivery & Assembly', query: 'Home Delivery' },
      { text: 'Safe International Payment & Order Tracking', query: 'Orders' },
      { text: 'Kerala Village & Town Doorstep Furniture Delivery', query: 'Kerala Delivery' }
    ]
  },
  {
    audience: 'Architects, Interior Designers & Contractors',
    description: 'Commercial-grade durability, customizable finishes, and bulk project solutions.',
    keywords: [
      { text: 'Custom Dimensions Furniture Manufacturing', query: 'Custom Furniture' },
      { text: 'Boutique Resort & Homestay Furniture (Wayanad / Munnar)', query: 'Resort Furniture' },
      { text: 'Cafe & Restaurant Seating Kerala', query: 'Chairs' },
      { text: 'Corporate Office Fit-out Furniture Kochi', query: 'Office Furniture' }
    ]
  },
  {
    audience: 'Quality & Budget-Conscious Buyers',
    description: 'Direct manufacturer pricing, transparent material specs, and long-term warranties.',
    keywords: [
      { text: '100% Termite Treated Solid Wood', query: 'Solid Wood' },
      { text: 'Affordable Luxury Furniture with No-Cost EMI', query: 'Offers' },
      { text: '5-Year Structural Warranty Furniture', query: 'Quality' },
      { text: 'Water-Resistant Coastal Grade Plywood & Teak', query: 'Teak Wood' }
    ]
  }
];

export default function Footer() {
  const pathname = usePathname();
  const { cartCount } = useStore();

  const isHome = pathname === '/';
  const isCategories = pathname.startsWith('/categories');
  const isOrders = pathname.startsWith('/orders');
  const isProfile = pathname.startsWith('/profile');

  // Condition to hide the mobile floating bottom navigation
  const hideMobileNav = 
    pathname.startsWith('/product') || 
    pathname.startsWith('/cart') || 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/profile/addresses/add') || 
    pathname.startsWith('/profile/addresses/edit') || 
    Boolean(pathname.match(/\/orders\/\d+/));

  // Condition to hide the full site footer (on pure distraction-free checkout flow)
  const hideFullFooter = 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/profile/addresses/add') || 
    pathname.startsWith('/profile/addresses/edit');

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COMPREHENSIVE STATIC SITE FOOTER (DESKTOP & MOBILE)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!hideFullFooter && (
        <footer className="w-full bg-[#111215] text-gray-300 border-t border-white/10 pt-12 md:pt-16 pb-24 md:pb-12 text-xs md:text-sm select-none">
          
          {/* Trust Highlights Bar */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 pb-12 border-b border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">Kerala-Wide Delivery</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Direct doorstep delivery across all 14 districts in Kerala.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">100% Solid Wood</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Teak, Sheesham & Mahogany built to endure coastal climates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">Free In-Home Assembly</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Professional installation & quality check at your convenience.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">5-Year Structural Warranty</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Guaranteed peace of mind with dedicated post-purchase support.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Navigation Links */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 border-b border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Brand & Kerala Roots */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl tracking-tight text-white font-outfit">
                    DESPEARL
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-[#dfa054]/20 text-[#dfa054] border border-[#dfa054]/30">
                    Kerala
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-md">
                  Kerala’s premier destination for luxury furniture and contemporary home decor. From traditional solid teak craftsmanship to sleek apartment designs, we curate living spaces designed to bring enduring comfort, prestige, and aesthetic joy into your home.
                </p>

                <div className="pt-2 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#dfa054] shrink-0" />
                    <span>Serving Kochi, Kozhikode, Malappuram, Thrissur, Palakkad & All Kerala</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#dfa054] shrink-0" />
                    <span>Support: Mon – Sat (9:00 AM – 8:00 PM IST)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#dfa054] shrink-0" />
                    <span>Kerala & NRI Helpline: +91 98765 43210</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-outfit">
                  Quick Links
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Shop by Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/reels" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Video Showcase & Reels
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Shopping Bag
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Wishlist
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Popular Furniture Categories */}
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-outfit">
                  Top Categories
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/search?q=Sofa" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Living Room & Sofas
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Bed" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Bedroom Sets & Cots
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Dining" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Dining Tables & Chairs
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Wardrobe" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Solid Wood Wardrobes
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Office" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Study & Office Desks
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Decor" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Home Decor & Mirrors
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Care & Policies */}
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-outfit">
                  Customer Care
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/orders" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Track My Order
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> My Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Kerala" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Delivery Across 14 Districts
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Offers" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Special Festive Offers
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Custom" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Custom Furniture Orders
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Warranty" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Warranty & Returns Policy
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              STATIC SEO KEYWORDS SECTION: KERALA AUDIENCE & ALL CATEGORIES
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 border-b border-white/10 space-y-10">
            
            {/* Header for SEO Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#dfa054]"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfa054]">
                  Kerala Furniture Shopping Guide & Popular Searches
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black font-outfit text-white tracking-tight">
                Explore Popular Furniture & Decor Searches in Kerala
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-3xl">
                Statically indexed catalog for homeowners, villa owners, flat dwellers, architects, and NRI families seeking premier solid wood and modern furniture across Kerala.
              </p>
            </div>

            {/* BLOCK 1: KERALA AUDIENCE & LOCATIONS (KERALA AUFENCE) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dfa054]" />
                <h4 className="text-white font-bold text-sm tracking-wide font-outfit">
                  Kerala Locations & Major Service Hubs
                </h4>
              </div>
              
              {/* Districts Tag Cloud */}
              <div className="flex flex-wrap gap-2 text-xs">
                {KERALA_DISTRICTS.map((dist, i) => (
                  <Link
                    key={i}
                    href={`/search?q=${encodeURIComponent(dist.query + ' Furniture')}`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-[#dfa054]/40 transition duration-200"
                    title={`Buy furniture online in ${dist.name}`}
                  >
                    Furniture {dist.name}
                  </Link>
                ))}
              </div>

              {/* Kerala Popular Search Phrases */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Popular Kerala Search Queries:
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-400 leading-relaxed">
                  {KERALA_POPULAR_SEARCHES.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <Link
                        href={`/search?q=${encodeURIComponent(item.query)}`}
                        className="hover:text-[#dfa054] hover:underline transition"
                      >
                        {item.text}
                      </Link>
                      {idx < KERALA_POPULAR_SEARCHES.length - 1 && (
                        <span className="text-white/20 select-none">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* BLOCK 2: ALL CATEGORY KEYWORDS (All Category) */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#dfa054]" />
                <h4 className="text-white font-bold text-sm tracking-wide font-outfit">
                  All Furniture Categories & Product Types
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORY_KEYWORDS.map((catGroup, cIdx) => (
                  <div key={cIdx} className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-2.5">
                    <h5 className="text-white font-bold text-xs uppercase tracking-wider text-[#dfa054] flex items-center justify-between">
                      <span>{catGroup.category}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </h5>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {catGroup.keywords.map((kw, kIdx) => (
                        <Link
                          key={kIdx}
                          href={`/search?q=${encodeURIComponent(kw.query)}`}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-[#dfa054]/20 hover:text-[#dfa054] text-gray-300 transition duration-150"
                        >
                          {kw.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK 3: AUDIENCE TYPE KEYWORDS (Type Audience) */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#dfa054]" />
                <h4 className="text-white font-bold text-sm tracking-wide font-outfit">
                  Tailored Collections by Audience & Buyer Type
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AUDIENCE_TYPE_KEYWORDS.map((audGroup, aIdx) => (
                  <div key={aIdx} className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-white font-bold text-xs tracking-wide mb-1 font-outfit">
                        {audGroup.audience}
                      </h5>
                      <p className="text-[11px] text-gray-400 mb-3 leading-snug">
                        {audGroup.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {audGroup.keywords.map((kw, kIdx) => (
                        <Link
                          key={kIdx}
                          href={`/search?q=${encodeURIComponent(kw.query)}`}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition"
                        >
                          {kw.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Info */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div className="text-center md:text-left">
              <p>© {new Date().getFullYear()} DESPEARL (FoxaCart Global). All Rights Reserved.</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Handcrafted premium furniture designed for Kerala homes, apartments, and villas.
              </p>
            </div>

            <div className="flex items-center gap-6 text-[11px]">
              <Link href="/categories" className="hover:text-white transition">All Categories</Link>
              <Link href="/search" className="hover:text-white transition">Search Catalog</Link>
              <Link href="/orders" className="hover:text-white transition">Order Tracking</Link>
              <Link href="/profile" className="hover:text-white transition">Account</Link>
            </div>
          </div>

        </footer>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE FLOATING BOTTOM NAVIGATION (md:hidden)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!hideMobileNav && (
        <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
          <nav 
            id="app-nav" 
            className="pointer-events-auto w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.15)] p-2.5 flex items-center select-none transition-all duration-300 border border-gray-100"
          >
            {/* Bottom Tab Options Row */}
            <div className="flex items-center justify-between w-full">
              
              {/* Home Tab */}
              <Link 
                href="/" 
                className="flex flex-col items-center justify-center gap-1 flex-1 transition"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isHome ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Home className="w-4.5 h-4.5" />
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isHome ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                  Home
                </span>
              </Link>

              {/* Categories Tab */}
              <Link 
                href="/categories" 
                className="flex flex-col items-center justify-center gap-1 flex-1 transition"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isCategories ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  <LayoutGrid className="w-4.5 h-4.5" />
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isCategories ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                  Categories
                </span>
              </Link>

              {/* Centerpiece Floating Action Button (Cart Trigger) */}
              <Link 
                href="/cart" 
                className="relative flex items-center justify-center w-[56px] h-[56px] -mt-8 rounded-full bg-brand-burgundy hover:opacity-95 active:scale-95 shadow-md shadow-brand-burgundy/40 transition duration-300 mx-2 shrink-0 border-[4px] border-white z-50"
              >
                <ShoppingBag className="w-6 h-6 text-white stroke-[2.5px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 px-1 bg-brand-espresso text-white rounded-full text-[9px] font-black flex items-center justify-center border-[1.5px] border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Orders Tab */}
              <Link 
                href="/orders" 
                className="flex flex-col items-center justify-center gap-1 flex-1 transition"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isOrders ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  <ListTodo className="w-4.5 h-4.5" />
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isOrders ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                  Orders
                </span>
              </Link>

              {/* Account Profile Tab */}
              <Link 
                href="/profile" 
                className="flex flex-col items-center justify-center gap-1 flex-1 transition"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition duration-300 ${isProfile ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  <User className="w-4.5 h-4.5" />
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isProfile ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                  Account
                </span>
              </Link>

            </div>
          </nav>
        </div>
      )}
    </>
  );
}
