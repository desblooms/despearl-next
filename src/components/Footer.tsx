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
import SeoEnhancer from '@/components/SeoEnhancer';

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
  { text: 'Kerala Best Furniture Factory', query: 'Best Furniture Factory Kerala' },
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
        <footer className="w-full bg-white text-gray-700 border-t border-gray-200 pt-12 md:pt-16 pb-24 md:pb-12 text-xs md:text-sm select-none">
          
          {/* PINTEREST CUSTOM FURNITURE & KERALA'S BEST SOFA FACTORY HERO BANNER */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FFF9F0] border border-[#E8DEC8] p-6 md:p-10 shadow-xs">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#dfa054]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                    <Factory className="w-3.5 h-3.5 text-amber-700" />
                    <span>Kerala's Best Furniture &amp; Custom Sofa Factory</span>
                  </div>

                  <h3 className="text-xl md:text-3xl font-black font-outfit text-gray-900 tracking-tight leading-tight">
                    Saw a Design on Pinterest or Instagram? <br />
                    <span className="text-[#a06822]">We Custom-Manufacture Any Furniture For You!</span>
                  </h3>

                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    Share any picture, sketch, or Pinterest link with our factory master craftsmen. We manufacture custom luxury sofas, solid teak wood cots, dining tables, and modular interiors to your exact room dimensions &mdash; with 100% solid wood and direct factory pricing (zero showroom middleman markups).
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-gray-700 font-medium">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct Factory Prices</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom Sizes &amp; Colors</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Solid Teak Guarantee</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivery Across All Kerala</span>
                  </div>
                </div>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-xs hover:shadow-emerald-600/20 transition-all active:scale-95 group"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>WhatsApp Your Pinterest Design</span>
                  </a>

                  <a
                    href={phoneTel}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold text-xs md:text-sm transition-all active:scale-95 shadow-3xs"
                  >
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>Call Factory: {phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Highlights Bar (Nykaa & Myntra Style) */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 pb-12 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAFAFA] border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-amber-700 shrink-0 shadow-3xs">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-sm mb-0.5">Direct Factory Pricing</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">Kerala's best direct sofa &amp; furniture factory. Zero middleman markup.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAFAFA] border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-amber-700 shrink-0 shadow-3xs">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-sm mb-0.5">All Pinterest Designs</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">Send us any photo; we custom manufacture to your exact room size.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAFAFA] border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-amber-700 shrink-0 shadow-3xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-sm mb-0.5">100% Solid Wood</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">Authentic Teak, Mahogany &amp; Rosewood treated for coastal longevity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAFAFA] border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-amber-700 shrink-0 shadow-3xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-sm mb-0.5">Kerala-Wide Delivery</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">Free doorstep delivery &amp; assembly across all 14 districts in Kerala.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Navigation Links (Nykaa / Myntra Directory Style) */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Brand & Factory Identity with Logo */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* LOGO IN FOOTER - Clean on White */}
                <Link href="/" className="inline-flex items-center gap-2 group">
                  {logoUrl ? (
                    <img 
                      src={getOptimizedImageUrl(logoUrl, 220, 90)} 
                      alt="Despearl – Kerala's Best Furniture & Custom Sofa Factory" 
                      className="h-10 md:h-14 object-contain group-hover:opacity-90 transition" 
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <img 
                        src="/despearl.png" 
                        alt="Despearl Logo" 
                        className="h-9 md:h-12 object-contain group-hover:opacity-90 transition"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <span className="font-black text-2xl md:text-3xl tracking-tight text-gray-900 font-outfit">
                        DESPEARL
                      </span>
                    </div>
                  )}
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300">
                    Factory Direct
                  </span>
                </Link>

                <p className="text-gray-700 text-xs md:text-sm leading-relaxed max-w-md">
                  <strong className="text-gray-900">Despearl is Kerala’s best direct furniture factory and custom sofa manufacturer.</strong> Specializing in all types of trending Pinterest-inspired furniture, bespoke luxury sofa sets, solid Nilambur teak cots, and marble dining sets &mdash; handcrafted in-house to your custom dimensions at direct factory prices.
                </p>

                <div className="pt-2 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-gray-900 font-semibold">Direct Factory Orders: </span>
                    <a href={phoneTel} className="text-amber-800 hover:underline font-bold text-sm tracking-wide">
                      {phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-gray-900 font-medium">WhatsApp Designs: </span>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-semibold">
                      +91 9895363788 (Instant Photo Quote)
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Factory &amp; Showrooms serving Kochi, Calicut, Malappuram, Thrissur, Palakkad &amp; All Kerala</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Support: Mon &ndash; Sat (9:00 AM &ndash; 8:30 PM IST)</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4 font-outfit">
                  Online Shopping
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Shop by Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/reels" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Video Showcase &amp; Reels
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Shopping Bag
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Wishlist
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Top Furniture Categories */}
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4 font-outfit">
                  Factory Collections
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/search?q=Custom+Sofa" className="text-amber-800 font-bold hover:underline transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Custom Sofa Manufacturing
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Pinterest+Furniture" className="text-amber-800 font-bold hover:underline transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Pinterest Furniture Designs
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Sofa" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Living Room &amp; Couches
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Bed" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Solid Teak Cots &amp; Beds
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Dining" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Marble Dining Sets
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Wardrobe" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Custom Wardrobes
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Office" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Ergonomic Office Chairs
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Policies & Direct Orders */}
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4 font-outfit">
                  Customer Policies
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <a href={phoneTel} className="text-gray-900 font-bold hover:text-amber-700 transition flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-amber-700" /> Call: {phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline transition flex items-center gap-1.5">
                      <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp Custom Order
                    </a>
                  </li>
                  <li>
                    <Link href="/orders" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Track My Order
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Gruhapravesam" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> Gruhapravesam Offers
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Kerala" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> All 14 Districts Delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Warranty" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> 5-Year Factory Warranty
                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs" className="text-amber-800 font-bold hover:underline transition flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-700" /> FAQs &amp; AI Help Guide
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* FACTORY DIRECT COMPARISON & BUYER GUIDE FAQ */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6">
            <SeoEnhancer />
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              STATIC SEO KEYWORDS SECTION: KERALA AUDIENCE & ALL CATEGORIES (NYKAA/MYNTRA DIRECTORY STYLE)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="w-full bg-[#FAFAFA] border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 space-y-10">
              
              {/* Header for SEO Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Kerala's Premier Furniture &amp; Sofa Factory &bull; Popular Searches
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black font-outfit text-gray-900 tracking-tight">
                  Kerala’s Best Custom Sofa Manufacturers &amp; Solid Wood Furniture Factory
                </h3>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed max-w-3xl">
                  Direct factory prices on all Pinterest-inspired couches, Nilambur teak beds, and luxury dining tables. Serving Kochi, Calicut, Malappuram, Thrissur, Palakkad, Trivandrum, and all 14 districts across Kerala. Call/WhatsApp: <a href={phoneTel} className="text-amber-800 underline font-bold">{phoneDisplay}</a>.
                </p>
              </div>

              {/* KERALA SERVICE HUBS & LOCATIONS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider font-outfit">
                    Kerala Locations &amp; Major Service Hubs
                  </h4>
                </div>
                
                {/* Districts Tag Cloud (Nykaa/Myntra Clean Pill Buttons) */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {KERALA_DISTRICTS.map((dist, i) => (
                    <Link
                      key={i}
                      href={`/search?q=${encodeURIComponent(dist.query + ' Furniture Factory')}`}
                      className="px-3 py-1.5 rounded-md bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 font-medium shadow-3xs transition duration-200"
                      title={`Buy custom furniture & sofas in ${dist.name}`}
                    >
                      Furniture {dist.name}
                    </Link>
                  ))}
                </div>

                {/* Kerala Popular Search Phrases */}
                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Popular Searches Across Kerala:
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-600 leading-relaxed">
                    {KERALA_POPULAR_SEARCHES.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <Link
                          href={`/search?q=${encodeURIComponent(item.query)}`}
                          className="hover:text-gray-900 hover:underline transition"
                        >
                          {item.text}
                        </Link>
                        {idx < KERALA_POPULAR_SEARCHES.length - 1 && (
                          <span className="text-gray-300 select-none">&bull;</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* BLOCK 2: ALL CATEGORY KEYWORDS DIRECTORY */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-amber-700" />
                  <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider font-outfit">
                    Furniture Categories &amp; Custom Manufacturing Directory
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                  {CATEGORY_KEYWORDS.map((catGroup, cIdx) => (
                    <div key={cIdx} className="space-y-2.5">
                      <h5 className="text-gray-900 font-bold text-xs uppercase tracking-wider font-outfit border-b border-gray-200 pb-1.5">
                        {catGroup.category}
                      </h5>
                      <ul className="space-y-1.5 text-xs">
                        {catGroup.keywords.map((kw, kIdx) => (
                          <li key={kIdx}>
                            <Link
                              href={`/search?q=${encodeURIComponent(kw.query)}`}
                              className="text-gray-600 hover:text-gray-900 hover:underline transition leading-relaxed block truncate"
                              title={kw.text}
                            >
                              {kw.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCK 3: AUDIENCE & BUYER COLLECTIONS */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-700" />
                  <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider font-outfit">
                    Tailored Collections by Audience &amp; Buyer Type
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {AUDIENCE_TYPE_KEYWORDS.map((audGroup, aIdx) => (
                    <div key={aIdx} className="space-y-2 border-l-2 border-amber-500 pl-3.5 bg-white p-3.5 rounded-r-xl border border-l-2 border-gray-200 border-l-amber-500 shadow-3xs">
                      <h5 className="text-gray-900 font-bold text-xs font-outfit">
                        {audGroup.audience}
                      </h5>
                      <p className="text-[11px] text-gray-600 leading-snug">
                        {audGroup.description}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] pt-1">
                        {audGroup.keywords.map((kw, kIdx) => (
                          <Link
                            key={kIdx}
                            href={`/search?q=${encodeURIComponent(kw.query)}`}
                            className="text-gray-600 hover:text-amber-800 hover:underline transition"
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
          </div>

          {/* Bottom Copyright & Legal Info (Myntra/Nykaa Style) */}
          <div className="w-full bg-[#F5F5F6] border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <div className="text-center md:text-left">
                <p className="font-medium text-gray-700">&copy; {new Date().getFullYear()} DESPEARL (FoxaCart Global). All Rights Reserved.</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Kerala's Best Furniture &amp; Custom Sofa Factory &bull; Direct Manufacturer Prices &bull; Helpline: <a href={phoneTel} className="text-amber-800 underline font-semibold">{phoneDisplay}</a>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-[11px]">
                <a href={phoneTel} className="text-amber-800 font-bold hover:underline">Direct Call: {phoneDisplay}</a>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900 transition">All Categories</Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900 transition">Search Catalog</Link>
                <Link href="/orders" className="text-gray-600 hover:text-gray-900 transition">Order Tracking</Link>
                <Link href="/faqs" className="text-gray-600 hover:text-gray-900 transition">FAQs</Link>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition">Account</Link>
              </div>
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
                prefetch={false}
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
