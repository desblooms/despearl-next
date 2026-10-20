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
  ChevronRight,
  MessageCircle,
  Factory,
  Palette,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getOptimizedImageUrl } from '@/utils/image';

// ── Static Keywords & Data ──

const KERALA_DISTRICTS = [
  { name: 'Kochi (Cochin)', query: 'Kochi' },
  { name: 'Ernakulam', query: 'Ernakulam' },
  { name: 'Kozhikode (Calicut)', query: 'Calicut' },
  { name: 'Malappuram', query: 'Malappuram' },
  { name: 'Thrissur', query: 'Thrissur' },
  { name: 'Palakkad', query: 'Palakkad' },
  { name: 'Thiruvananthapuram (Trivandrum)', query: 'Trivandrum' },
  { name: 'Kannur', query: 'Kannur' },
  { name: 'Kottayam', query: 'Kottayam' },
  { name: 'Kollam', query: 'Kollam' },
  { name: 'Alappuzha (Alleppey)', query: 'Alappuzha' },
  { name: 'Kasaragod', query: 'Kasaragod' },
  { name: 'Wayanad', query: 'Wayanad' },
  { name: 'Pathanamthitta', query: 'Pathanamthitta' },
  { name: 'Idukki', query: 'Idukki' }
];

const KERALA_POPULAR_SEARCHES = [
  // Kerala City & High-Intent Popular Searches
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
  { text: 'Solid Wood Cot with Storage Kerala', query: 'Storage Bed' },
  { text: 'Traditional Kerala Style Woodwork', query: 'Traditional Wooden' },
  { text: 'Doorstep Furniture Delivery All Kerala', query: 'Furniture Kerala' },
  
  // Factory Direct & Custom Pinterest Searches
  { text: 'Kerala Largest Furniture Factory', query: 'Furniture Factory Kerala' },
  { text: 'Custom Sofa Manufacturers Kerala', query: 'Custom Sofa' },
  { text: 'Pinterest Furniture Makers Kerala', query: 'Pinterest Furniture' },
  { text: 'Nilambur Teak Wood Furniture Online', query: 'Nilambur Teak' },
  { text: 'Furniture Shop Near Me (Kerala)', query: 'Furniture Kerala' },
  { text: 'Best Sofa Factory in Calicut & Malappuram', query: 'Sofa Factory' },
  { text: 'Direct Factory Furniture in Kochi & Ernakulam', query: 'Furniture Kochi' },
  { text: 'Custom Wooden Sofa Manufacturers Thrissur', query: 'Wooden Sofa' },
  { text: 'Gruhapravesam 3BHK Home Packages', query: 'Gruhapravesam' },
  { text: 'NRI Online Furniture Booking to Kerala (Gulf / UAE)', query: 'Furniture Kerala' },
  { text: 'Apartment Space-Saving Furniture Kochi', query: 'Space Saving' },
  { text: 'Traditional Kerala Kattil & Woodcraft', query: 'Traditional Wooden' }
];

const CATEGORY_KEYWORDS = [
  {
    category: 'Custom Sofas & Living Room (Factory Direct)',
    keywords: [
      { text: 'Custom Made L-Shape Sofas', query: 'L-Shape Sofa' },
      { text: 'Pinterest Trending Sectionals', query: 'Pinterest Sofa' },
      { text: '3+2 Wooden Sofa Sets', query: 'Wooden Sofa' },
      { text: 'Luxury Recliner Chairs', query: 'Recliner' },
      { text: 'Chesterfield Velvet Couches', query: 'Chesterfield Sofa' },
      { text: 'Accent Chairs', query: 'Accent Chair' },
      { text: 'Solid Teak Coffee Tables', query: 'Coffee Table' },
      { text: 'Minimalist TV Entertainment Units', query: 'TV Unit' },
      { text: 'Shoe Racks', query: 'Shoe Rack' },
      { text: 'Bespoke Center Tables', query: 'Center Table' }
    ]
  },
  {
    category: 'Bedroom Furniture & Solid Teak Cots',
    keywords: [
      { text: 'King Size Beds', query: 'King Size Bed' },
      { text: 'Queen Size Beds', query: 'Queen Size Bed' },
      { text: 'Hydraulic Storage Beds', query: 'Hydraulic Bed' },
      { text: 'Solid Teak Wood Cots', query: 'Teak Cot' },
      { text: '3-Door Wardrobes', query: '3-Door Wardrobe' },
      { text: 'Sliding Wardrobes', query: 'Sliding Wardrobe' },
      { text: 'Dressing Tables with LED Mirror', query: 'Dressing Table' },
      { text: 'Orthopedic Mattresses', query: 'Mattress' },
      { text: 'Nilambur Teak Wood Cots', query: 'Teak Cot' },
      { text: 'Bedside Nightstand Tables', query: 'Bedside Table' }
    ]
  },
  {
    category: 'Dining Room & Kitchen Furniture',
    keywords: [
      { text: 'Dining Room Furniture', query: 'Dining Room Furniture' },
      { text: '6 Seater Dining Tables', query: '6 Seater Dining' },
      { text: '4 Seater Dining Sets', query: '4 Seater Dining' },
      { text: 'Italian Marble Dining Tables', query: 'Marble Dining Table' },
      { text: 'Wooden Dining Chairs', query: 'Dining Chair' },
      { text: 'Crockery Units', query: 'Crockery Unit' },
      { text: 'Kitchen Breakfast Bar Stools', query: 'Bar Stool' }
    ]
  },
  {
    category: 'Home Office & Study Furniture',
    keywords: [
      { text: 'Home Office Desks', query: 'Office Desk' },
      { text: 'Ergonomic Office Chairs', query: 'Office Chair' },
      { text: 'Computer Study Tables', query: 'Study Table' },
      { text: 'Bookshelves', query: 'Book Shelf' },
      { text: 'Executive Office Desks', query: 'Executive Desk' },
      { text: 'Work-From-Home Computer Desks', query: 'Computer Desk' }
    ]
  },
  {
    category: 'Balcony, Outdoor & Home Decor',
    keywords: [
      { text: 'Balcony Furniture', query: 'Balcony Furniture' },
      { text: 'Garden Swing Chairs', query: 'Swing Chair' },
      { text: 'Full Length Floor Mirrors', query: 'Mirror' },
      { text: 'Home Decor Kerala', query: 'Home Decor' },
      { text: 'Cane & Rattan Outdoor Chairs', query: 'Outdoor Chair' },
      { text: 'Weatherproof Balcony Bistro Sets', query: 'Balcony Furniture' },
      { text: 'Entryway Decorative Console Tables', query: 'Console Table' }
    ]
  }
];

const AUDIENCE_TYPE_KEYWORDS = [
  {
    audience: 'Pinterest & Custom Furniture Lovers',
    description: 'Send us any photo or Pinterest link & we will custom manufacture it to your exact room size.',
    keywords: [
      { text: 'Pinterest Custom Sofa Manufacturing', query: 'Custom Sofa' },
      { text: 'Bespoke Instagram Furniture Kerala', query: 'Pinterest Furniture' },
      { text: 'Interior Designer Furniture Kerala', query: 'Interior Designer Furniture' },
      { text: '100% Solid Wood Anti-Termite Furniture', query: 'Solid Wood Furniture' },
      { text: '5-Year Structural Warranty Furniture Kerala', query: 'Warranty Furniture' },
      { text: 'Affordable Luxury Furniture EMI Kerala', query: 'Furniture EMI' }
    ]
  },
  {
    audience: 'New Home Builders & Gruhapravesam',
    description: 'Complete home packages curated for traditional and modern Kerala homes.',
    keywords: [
      { text: 'New Home Furnishing Packages Kerala', query: 'Home Furnishing Package' },
      { text: 'Gruhapravesam Furniture Offers', query: 'Gruhapravesam Offers' },
      { text: 'Kerala Villa Furniture Packages', query: 'Villa Furniture' },
      { text: 'Complete 3BHK Home Furnishing Package', query: '3BHK Package' },
      { text: 'Traditional Kerala Style Woodwork', query: 'Traditional Wooden' }
    ]
  },
  {
    audience: 'Apartment & Flat Dwellers (Kochi, Calicut, Trivandrum)',
    description: 'Smart, compact, and modular designs tailored for high-rise apartment living.',
    keywords: [
      { text: 'Apartment Space Saving Furniture', query: 'Space Saving' },
      { text: 'Multipurpose Sofa Cum Bed', query: 'Sofa Cum Bed' },
      { text: 'Apartment Furniture Packages Kochi', query: 'Apartment Furniture' },
      { text: 'Sliding Wardrobes for Small Rooms', query: 'Sliding Wardrobe' },
      { text: 'Compact Foldable Dining Sets', query: 'Dining Table' }
    ]
  },
  {
    audience: 'NRI & Gulf Malayalee Families',
    description: 'Direct factory orders for your family home in Kerala with doorstep installation.',
    keywords: [
      { text: 'Send Furniture to Kerala for Family', query: 'Send Furniture Kerala' },
      { text: 'NRI Online Furniture Booking Kerala', query: 'NRI Furniture Booking' },
      { text: 'WhatsApp Factory Consultation (+91 9895363788)', query: 'WhatsApp Consultation' },
      { text: 'Doorstep Furniture Delivery All Kerala', query: 'Furniture Delivery' }
    ]
  },
  {
    audience: 'Resorts, Homestays & Commercial Projects',
    description: 'Factory-direct commercial manufacturing, customizable finishes, and bulk project solutions.',
    keywords: [
      { text: 'Boutique Resort Furniture Kerala', query: 'Resort Furniture' },
      { text: 'Interior Designer Furniture Kerala', query: 'Designer Furniture' },
      { text: 'Direct Factory Bulk Furniture Kerala', query: 'Factory Furniture' },
      { text: 'Corporate Office Fit-out Furniture Kochi', query: 'Office Furniture' }
    ]
  }
];

export default function Footer({ logoUrl }: { logoUrl?: string }) {
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

  const phoneDisplay = "+91 9895363788";
  const phoneTel = "tel:+919895363788";
  const whatsappUrl = "https://wa.me/919895363788?text=Hello%20Despearl!%20I%20have%20a%20Pinterest%20or%20custom%20sofa/furniture%20design%20to%20manufacture.";

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COMPREHENSIVE STATIC SITE FOOTER (DESKTOP & MOBILE)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!hideFullFooter && (
        <footer className="w-full bg-[#111215] text-gray-300 border-t border-white/10 pt-12 md:pt-16 pb-24 md:pb-12 text-xs md:text-sm select-none">
          
          {/* 🌟 PINTEREST CUSTOM FURNITURE & KERALA'S LARGEST SOFA FACTORY HERO BANNER */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#1c1815] via-[#241a15] to-[#161311] border border-[#dfa054]/30 p-6 md:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#dfa054]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa054]/20 border border-[#dfa054]/40 text-[#dfa054] text-[11px] font-bold uppercase tracking-wider">
                    <Factory className="w-3.5 h-3.5" />
                    <span>Kerala's Largest Furniture & Custom Sofa Factory</span>
                  </div>

                  <h3 className="text-xl md:text-3xl font-black font-outfit text-white tracking-tight leading-tight">
                    Saw a Design on Pinterest or Instagram? <br />
                    <span className="text-[#dfa054]">We Custom-Manufacture Any Furniture For You!</span>
                  </h3>

                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    Share any picture, sketch, or Pinterest link with our factory master craftsmen. We manufacture custom luxury sofas, solid teak wood cots, dining tables, and modular interiors to your exact room dimensions &mdash; with 100% solid wood and direct factory pricing (zero showroom middleman markups).
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-gray-300 font-medium">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#dfa054]" /> Direct Factory Prices</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#dfa054]" /> Custom Sizes & Colors</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#dfa054]" /> 100% Solid Teak Guarantee</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#dfa054]" /> Delivery Across All Kerala</span>
                  </div>
                </div>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-95 group"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>WhatsApp Your Pinterest Design</span>
                  </a>

                  <a
                    href={phoneTel}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs md:text-sm transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 text-[#dfa054]" />
                    <span>Call Factory: {phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Highlights Bar */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 pb-12 border-b border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">Direct Factory Pricing</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Kerala's largest direct sofa & furniture factory. Zero middleman markup.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">All Pinterest Designs</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Send us any photo; we custom manufacture to your exact room size.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">100% Solid Wood</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Authentic Teak, Mahogany & Rosewood treated for coastal longevity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfa054] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">Kerala-Wide Delivery</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Free doorstep delivery & assembly across all 14 districts in Kerala.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Navigation Links */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 border-b border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Brand & Factory Identity with Logo */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* 🏷️ LOGO IN FOOTER */}
                <Link href="/" className="inline-flex items-center gap-2 group">
                  {logoUrl ? (
                    <img 
                      src={getOptimizedImageUrl(logoUrl, 220, 90)} 
                      alt="Despearl – Kerala's Largest Furniture & Custom Sofa Factory" 
                      className="h-10 md:h-14 object-contain brightness-0 invert group-hover:opacity-90 transition" 
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <img 
                        src="/despearl.png" 
                        alt="Despearl Logo" 
                        className="h-9 md:h-12 object-contain brightness-0 invert group-hover:opacity-90 transition"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <span className="font-black text-2xl md:text-3xl tracking-tight text-white font-outfit">
                        DESPEARL
                      </span>
                    </div>
                  )}
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-[#dfa054]/20 text-[#dfa054] border border-[#dfa054]/30">
                    Factory Direct
                  </span>
                </Link>

                <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-md">
                  <strong className="text-white">Despearl is Kerala’s largest and best direct furniture factory and custom sofa manufacturer.</strong> Specializing in all types of trending Pinterest-inspired furniture, bespoke luxury sofa sets, solid Nilambur teak cots, and marble dining sets &mdash; handcrafted in-house to your custom dimensions at direct factory prices.
                </p>

                <div className="pt-2 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#dfa054] shrink-0" />
                    <span className="text-white font-semibold">Direct Factory Orders: </span>
                    <a href={phoneTel} className="text-[#dfa054] hover:underline font-bold text-sm tracking-wide">
                      {phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp Designs: </span>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold">
                      +91 9895363788 (Instant Photo Quote)
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#dfa054] shrink-0" />
                    <span>Factory & Showrooms serving Kochi, Calicut, Malappuram, Thrissur, Palakkad & All Kerala</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#dfa054] shrink-0" />
                    <span>Support: Mon – Sat (9:00 AM – 8:30 PM IST)</span>
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

              {/* Top Furniture Categories */}
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-outfit">
                  Factory Categories
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/search?q=Custom+Sofa" className="hover:text-white transition flex items-center gap-1.5 font-semibold text-[#dfa054]">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Custom Sofa Manufacturing
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Pinterest+Furniture" className="hover:text-white transition flex items-center gap-1.5 font-semibold text-[#dfa054]">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Pinterest Furniture Designs
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Sofa" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Living Room & Couches
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Bed" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Solid Teak Cots & Beds
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Dining" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Marble Dining Sets
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Wardrobe" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Custom Wardrobes
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Office" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Ergonomic Office Chairs
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Care & Direct Orders */}
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-outfit">
                  Factory Support
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <a href={phoneTel} className="text-white font-bold hover:text-[#dfa054] transition flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#dfa054]" /> Call: {phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline transition flex items-center gap-1.5">
                      <MessageCircle className="w-3 h-3 text-emerald-400" /> WhatsApp Custom Order
                    </a>
                  </li>
                  <li>
                    <Link href="/orders" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Track My Order
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Gruhapravesam" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> Gruhapravesam Offers
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Kerala" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> All 14 Districts Delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Warranty" className="hover:text-white transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#dfa054]" /> 5-Year Factory Warranty
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
                  Kerala's Premier Furniture & Sofa Factory &bull; Popular Searches
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black font-outfit text-white tracking-tight">
                Kerala’s Best Custom Sofa Manufacturers & Solid Wood Furniture Factory
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-3xl">
                Direct factory prices on all Pinterest-inspired couches, Nilambur teak beds, and luxury dining tables. Serving Kochi, Calicut, Malappuram, Thrissur, Palakkad, Trivandrum, and all 14 districts across Kerala. Call/WhatsApp: <a href={phoneTel} className="text-[#dfa054] underline font-bold">{phoneDisplay}</a>.
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
                    href={`/search?q=${encodeURIComponent(dist.query + ' Furniture Factory')}`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-[#dfa054]/40 transition duration-200"
                    title={`Buy custom furniture & sofas in ${dist.name}`}
                  >
                    Furniture {dist.name}
                  </Link>
                ))}
              </div>

              {/* Kerala Popular Search Phrases */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Popular Kerala Factory & Custom Searches:
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
                  All Furniture Categories & Custom Manufacturing Types
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
                Kerala's Largest Furniture & Custom Sofa Factory &bull; Direct Manufacturer Prices &bull; Helpline: <a href={phoneTel} className="text-[#dfa054] underline">{phoneDisplay}</a>
              </p>
            </div>

            <div className="flex items-center gap-6 text-[11px]">
              <a href={phoneTel} className="text-[#dfa054] font-bold hover:underline">Direct Call: {phoneDisplay}</a>
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
