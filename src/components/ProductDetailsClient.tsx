'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { Minus, Plus, Heart, ShoppingBag, Check, MapPin, ChevronRight, ChevronDown, Tag, Star, ShieldCheck, Award, Banknote, Palette } from 'lucide-react';
import { useStore, Product } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

interface Props {
  product: any;
  relatedProducts?: any[];
}

export default function ProductDetailsClient({ product, relatedProducts = [] }: Props) {
  const { toggleWishlist, isWished, addToCart, isInCart } = useStore();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  
  const extendedData = product.extended_data || {};
  
  // State for dynamic interactions
  const colors = Array.isArray(extendedData.colors) ? extendedData.colors : [];
  const hasColors = colors.length > 0;
  const legacySizes = typeof extendedData.sizes === 'string' && extendedData.sizes.trim() !== '' 
      ? extendedData.sizes.split(',').map((s:string) => s.trim()).filter(Boolean) 
      : [];
      
  const [selectedColor, setSelectedColor] = useState<any>(hasColors ? colors[0] : null);
  const [selectedSize, setSelectedSize] = useState(legacySizes[0] || '');
  const [pincode, setPincode] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const [deliveryStatus, setDeliveryStatus] = useState<{ message: string; error?: boolean } | null>(null);

  const inStock = Number(product.stock_quantity || 0) > 0;
  
  const cartProductSize = selectedSize || undefined;
  const cartProductColor = hasColors && selectedColor ? selectedColor.name : undefined;
  const inCart = isInCart(product.id, cartProductSize, cartProductColor);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `https://app.votee.in${url}`;
    if (url.startsWith('uploads/')) return `https://app.votee.in/${url}`;
    if (url.startsWith('gallery_')) return `https://app.votee.in/uploads/products/gallery/${url}`;
    return `https://app.votee.in/uploads/products/${url}`;
  };

  const images = [getImageUrl(product.image), ...(product.gallery || []).map((g: any) => getImageUrl(g.media_path))].filter(Boolean);
  const fallbackImg = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f8f9fa%22/%3E%3Ctext x=%22200%22 y=%22200%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2248%22%3E📦%3C/text%3E%3C/svg%3E`;
  const [mainImg, setMainImg] = useState(images[0] || fallbackImg);
  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({});

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi, setCurrentSlide]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const wished = isWished(product.id);

  // Dynamic Pricing
  const currentPrice = Number(product.price || 0);
  const originalPrice = Number(product.original_mrp || currentPrice);
  const hasDiscount = originalPrice > currentPrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const changeQty = (delta: number) => {
    setQty(prev => Math.max(1, prev + delta));
  };

  const handleCartClick = () => {
    if (inCart) {
      router.push('/cart');
      return;
    }
    const cartProduct = {
      ...product,
      size: selectedSize || undefined,
      color: hasColors && selectedColor ? selectedColor.name : undefined
    };
    addToCart(cartProduct, qty);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleCheckPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryStatus({ message: 'Please enter a valid 6-digit pincode', error: true });
      return;
    }
    
    // Kerala pincodes start with 67, 68, or 69
    const isKerala = /^(67|68|69)\d{4}$/.test(pincode);

    if (isKerala) {
      setDeliveryStatus({ message: '🎉 Free Delivery Available! Usually reaches in 2-3 business days.' });
    } else {
      setDeliveryStatus({ message: 'Delivery Not Available for this pincode.', error: true });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-4 pb-2">
        <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-500 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-gray-900 transition">Shop</Link>
          {product.category_name && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/shop/${product.category_id}`} className="hover:text-gray-900 transition">{product.category_name}</Link>
            </>
          )}
          {product.brand && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="hover:text-gray-900 transition cursor-pointer">{product.brand}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 truncate max-w-[150px] md:max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Left: Image Gallery */}
        <div className="md:w-[55%] flex flex-col md:flex-row gap-4 md:sticky md:top-[80px] md:self-start h-auto">
          {/* Desktop Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto no-scrollbar w-20 shrink-0 h-full pb-4">
              {images.map((img: string, i: number) => (
                <div 
                  key={i}
                  className={`w-full aspect-square overflow-hidden cursor-pointer border-[2px] transition-all shrink-0 ${mainImg === img ? 'border-brand-espresso shadow-sm opacity-100' : 'border-transparent hover:border-brand-rose/30 opacity-60 hover:opacity-100 bg-[#f8f9fa]'}`} 
                  onClick={() => setMainImg(img)}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          )}

          {/* Desktop Main Image */}
          <div className="hidden md:block flex-1 bg-[#f8f9fa] overflow-hidden relative shadow-sm aspect-square md:h-auto">
            {!imgLoaded[mainImg] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={mainImg} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded[mainImg] ? 'opacity-100' : 'opacity-0'}`} 
              ref={(img) => { if (img?.complete && !imgLoaded[mainImg]) setImgLoaded(prev => ({...prev, [mainImg]: true})) }}
              onLoad={() => setImgLoaded(prev => ({...prev, [mainImg]: true}))}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImg;
                setImgLoaded(prev => ({...prev, [mainImg]: true}));
              }}
            />
          </div>

          {/* Mobile Embla Carousel */}
          <div className="md:hidden w-full aspect-square relative bg-[#f8f9fa]">
            <div className="embla absolute inset-0 overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex h-full">
                {images.map((img: string, index: number) => (
                  <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative h-full">
                    {!imgLoaded[`mobile_${index}`] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img 
                      src={img} 
                      alt={`${product.name} ${index}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded[`mobile_${index}`] ? 'opacity-100' : 'opacity-0'}`}
                      ref={(imgEl) => { if (imgEl?.complete && !imgLoaded[`mobile_${index}`]) setImgLoaded(prev => ({...prev, [`mobile_${index}`]: true})) }}
                      onLoad={() => setImgLoaded(prev => ({...prev, [`mobile_${index}`]: true}))}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                        setImgLoaded(prev => ({...prev, [`mobile_${index}`]: true}));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi && emblaApi.scrollTo(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentSlide ? 'bg-brand-espresso w-4' : 'bg-white/80 hover:bg-white border border-gray-300/50 shadow-sm'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-[45%] flex flex-col pb-10">
          
          {/* Title & Price */}
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-black font-outfit text-gray-900 mb-1">{product.brand || 'Brand'}</h2>
            <h1 className="text-sm md:text-base font-medium text-gray-600 mb-3 leading-tight">{product.name}</h1>
            
            <div className="flex items-end gap-3 mb-1">
              <span className="text-2xl font-black text-gray-900">₹{currentPrice.toFixed(2)}</span>
              {hasDiscount && <span className="text-sm font-medium text-gray-500 line-through mb-1">₹{originalPrice.toFixed(2)}</span>}
              {hasDiscount && <span className="text-sm font-bold text-gray-900 mb-1">{discountPercentage}% OFF</span>}
            </div>
            {hasDiscount && <p className="text-xs text-gray-400 font-medium">MRP <span className="line-through">₹{originalPrice.toFixed(2)}</span> inclusive of all taxes</p>}
            {!hasDiscount && <p className="text-xs text-gray-400 font-medium">MRP ₹{currentPrice.toFixed(2)} inclusive of all taxes</p>}
          </div>

          <hr className="border-brand-cream/50 mb-5" />

          {/* Colors */}
          {hasColors && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-bold text-gray-900">
                  Select Color
                  {selectedColor?.name && <span className="ml-2 text-sm text-gray-500 font-normal">| {selectedColor.name}</span>}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((c: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === c ? 'border-gray-900 shadow-md scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                    style={{ backgroundColor: c.hex || '#ffffff' }}
                    title={c.name}
                  >
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {legacySizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-bold text-gray-900">
                  Select Size
                </span>
                <span className="text-xs font-bold text-pink-600 cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {legacySizes.map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[42px] h-[42px] px-3 rounded-full border text-[13px] font-bold flex items-center justify-center transition-all ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white shadow-md' : 'border-gray-300 text-gray-700 hover:border-gray-900 bg-white'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button 
              className={`flex-1 md:flex-none md:w-[180px] h-12 rounded-sm flex items-center justify-center gap-2 border-[1.5px] font-bold text-sm transition-all duration-300 cursor-pointer hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 ${wished ? 'border-brand-burgundy text-brand-burgundy bg-brand-cream' : 'border-brand-rose/30 text-gray-700 hover:border-brand-espresso'}`}
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ${wished ? 'fill-brand-burgundy' : ''}`} />
              {wished ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button 
              className={`flex-[2] h-12 rounded-sm font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-sm ${!inStock ? 'bg-gray-300 cursor-not-allowed' : (inCart ? 'bg-gray-900 hover:bg-black' : 'bg-brand-burgundy hover:bg-brand-wine')}`}
              onClick={handleCartClick} 
              disabled={!inStock}
            >
              {!inStock ? 'Out of Stock' : (inCart ? <><ShoppingBag className="w-4 h-4" /> Go to Cart</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>)}
            </button>
          </div>

          {/* Delivery & Pincode */}
          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-2 flex items-center gap-2">
              Check delivery time & services
            </h3>
            <p className="text-xs text-gray-500 mb-4">Please enter your PIN code to check delivery time and availability</p>
            <div className="flex h-12 rounded-md border border-gray-300 overflow-hidden focus-within:border-gray-900 transition-colors w-full md:w-3/4">
              <input 
                type="text" 
                placeholder="Enter PIN code" 
                className="flex-1 px-4 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 bg-transparent"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
              />
              <button 
                className="px-5 text-sm font-bold text-pink-600 hover:text-pink-800 transition-colors bg-transparent h-full uppercase tracking-wider"
                onClick={handleCheckPincode}
              >
                Check
              </button>
            </div>
            {deliveryStatus && (
              <div className={`mt-3 text-xs font-bold ${deliveryStatus.error ? 'text-red-600' : 'text-green-600'}`}>
                {deliveryStatus.message}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-row items-center justify-center py-2 px-1.5 rounded-md border border-brand-rose/20 bg-brand-cream/10 text-left hover:bg-brand-cream/30 hover:border-brand-burgundy/30 transition-all group">
                <ShieldCheck className="w-4 h-4 text-brand-burgundy mr-1.5 shrink-0 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 leading-tight uppercase tracking-wide">100% Original</span>
              </div>
              <div className="flex flex-row items-center justify-center py-2 px-1.5 rounded-md border border-brand-rose/20 bg-brand-cream/10 text-left hover:bg-brand-cream/30 hover:border-brand-burgundy/30 transition-all group">
                <Banknote className="w-4 h-4 text-brand-burgundy mr-1.5 shrink-0 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 leading-tight uppercase tracking-wide">Pay on Delivery</span>
              </div>
              <div className="flex flex-row items-center justify-center py-2 px-1.5 rounded-md border border-brand-rose/20 bg-brand-cream/10 text-left hover:bg-brand-cream/30 hover:border-brand-burgundy/30 transition-all group">
                <Palette className="w-4 h-4 text-brand-burgundy mr-1.5 shrink-0 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 leading-tight uppercase tracking-wide">Fully Customise</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-6 mt-2" />

          {/* Offers & Coupons */}
          {extendedData.offers_json && (
            <div className="mb-6">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-700" /> Offers & Coupons
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                {extendedData.offers_json.split('|').filter(Boolean).map((offer: string, idx: number) => {
                  const parts = offer.split(':');
                  const title = parts[0] ? parts[0].trim() : 'OFFER';
                  const desc = parts[1] ? parts[1].trim() : '';
                  const colors = [
                    { bg: 'bg-orange-50/50 hover:bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700 border border-orange-200', text: 'text-orange-900', btn: 'text-orange-600 hover:text-orange-800' },
                    { bg: 'bg-blue-50/50 hover:bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700 border border-blue-200', text: 'text-blue-900', btn: 'text-blue-600 hover:text-blue-800' },
                    { bg: 'bg-emerald-50/50 hover:bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', text: 'text-emerald-900', btn: 'text-emerald-600 hover:text-emerald-800' },
                    { bg: 'bg-purple-50/50 hover:bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700 border border-purple-200', text: 'text-purple-900', btn: 'text-purple-600 hover:text-purple-800' }
                  ];
                  const col = colors[idx % colors.length];
                  return (
                    <div key={idx} className={`shrink-0 w-[240px] md:w-[260px] snap-start border ${col.border} ${col.bg} p-3 rounded-md transition-colors cursor-pointer group flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className={`w-3.5 h-3.5 ${col.btn} opacity-80`} />
                          <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded-sm ${col.badge}`}>{title}</span>
                        </div>
                        {desc && <p className={`text-xs font-semibold ${col.text} leading-snug line-clamp-2 mb-3`}>{desc}</p>}
                      </div>
                      <div className="border-t border-dashed border-gray-300/50 pt-2 flex justify-between items-center mt-auto">
                        <span className={`text-[10px] font-bold ${col.text} opacity-60`}>T&C Apply</span>
                        <button className={`text-[10px] font-extrabold uppercase tracking-widest ${col.btn} whitespace-nowrap group-hover:scale-105 transition-transform`}>Copy Code</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <hr className="border-gray-200 mb-2" />

          {/* Accordions */}
          
          <div className="border-b border-gray-200">
            <button 
              className="w-full py-4 flex items-center justify-between text-[15px] font-bold text-gray-900 group"
              onClick={() => toggleAccordion('product_details')}
            >
              Product details
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordion === 'product_details' ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === 'product_details' && (
              <div className="pb-5 text-sm text-gray-600 leading-relaxed space-y-3">
                {extendedData.care_instructions && (
                  <div>
                    <strong className="block text-gray-900 mb-1 font-bold">Care instructions</strong>
                    <p>{extendedData.care_instructions}</p>
                  </div>
                )}
                {extendedData.pack_contains && (
                  <div>
                    <strong className="block text-gray-900 mb-1 font-bold">Pack contains</strong>
                    <p>{extendedData.pack_contains}</p>
                  </div>
                )}
                {!extendedData.care_instructions && !extendedData.pack_contains && (
                  <p className="text-gray-400 italic">No details available.</p>
                )}
              </div>
            )}
          </div>

          <div className="border-b border-gray-200">
            <button 
              className="w-full py-4 flex items-center justify-between text-[15px] font-bold text-gray-900 group"
              onClick={() => toggleAccordion('know_your_product')}
            >
              Product information
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordion === 'know_your_product' ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === 'know_your_product' && (
              <div className="pb-5 text-sm text-gray-600">
                <strong className="block text-gray-900 mb-2 font-bold">Description</strong>
                {product.description ? (
                  <div className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                ) : (
                  <p className="text-gray-400 italic">No description available.</p>
                )}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4">
                  {product.brand && (
                    <div>
                      <span className="block text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">Brand</span>
                      <span className="font-medium text-gray-900">{product.brand}</span>
                    </div>
                  )}
                  {product.category_name && (
                    <div>
                      <span className="block text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">Category</span>
                      <span className="font-medium text-gray-900">{product.category_name}</span>
                    </div>
                  )}
                  {product.unit && (
                    <div>
                      <span className="block text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">Unit</span>
                      <span className="font-medium text-gray-900">{product.unit}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">Product ID</span>
                    <span className="font-medium text-gray-900">{product.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200">
            <button 
              className="w-full py-4 flex items-center justify-between text-[15px] font-bold text-gray-900 group"
              onClick={() => toggleAccordion('vendor_details')}
            >
              Delivery & payment
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordion === 'vendor_details' ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === 'vendor_details' && (
              <div className="pb-5 text-sm text-gray-600 leading-relaxed space-y-3">
                {extendedData.manufacturer_details && (
                  <div>
                    <strong className="block text-gray-900 mb-1 font-bold">Manufacturer details</strong>
                    <p className="whitespace-pre-wrap">{extendedData.manufacturer_details}</p>
                  </div>
                )}
                {extendedData.country_of_origin && (
                  <div>
                    <strong className="block text-gray-900 mb-1 font-bold">Country of origin</strong>
                    <p>{extendedData.country_of_origin}</p>
                  </div>
                )}
                {!extendedData.manufacturer_details && !extendedData.country_of_origin && (
                  <p className="text-gray-400 italic">No vendor details available.</p>
                )}
              </div>
            )}
          </div>

          <div className="border-b border-gray-200">
            <button 
              className="w-full py-4 flex items-center justify-between text-[15px] font-bold text-gray-900 group"
              onClick={() => toggleAccordion('return_policy')}
            >
              Return & exchange
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordion === 'return_policy' ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === 'return_policy' && (
              <div className="pb-5 text-sm text-gray-600 leading-relaxed">
                <strong className="block text-gray-900 mb-2 font-bold">Know more about return and exchange</strong>
                <p className="whitespace-pre-wrap">{extendedData.return_policy || 'Usually dispatches within 2-3 business days. 14 days free return policy.'}</p>
              </div>
            )}
          </div>
          
          {/* About Brand */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3">About {product.brand || 'the Brand'}</h3>
            {extendedData.brand_description ? (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{extendedData.brand_description}</p>
            ) : (
              <p className="text-sm text-gray-400 italic mb-4">No brand details provided.</p>
            )}
            
            {extendedData.brand_stats && extendedData.brand_stats.length > 0 && (
              <div className="grid grid-cols-3 divide-x divide-gray-200 border border-brand-rose/20 text-center mb-6">
                {extendedData.brand_stats.map((stat: string, idx: number) => {
                  const parts = stat.split(' ');
                  const boldPart = parts.shift();
                  const rest = parts.join(' ');
                  const Icons = [ShieldCheck, Award, Star];
                  const Icon = Icons[idx % Icons.length];
                  return (
                    <div key={idx} className="p-3 flex flex-col items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-wine mb-1 opacity-80" />
                      <div className="text-lg font-black text-gray-900 mb-1">{boldPart}</div>
                      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mx-auto max-w-[80px] leading-tight">{rest}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Customer Reviews */}
          {extendedData.customer_reviews && extendedData.customer_reviews.length > 0 && (
            <div className="mt-2 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">What customer say about this brand</h3>
              <div className="flex flex-wrap gap-2">
                {extendedData.customer_reviews.map((review: string, idx: number) => {
                  const parts = review.split(':');
                  const label = parts[0] ? parts[0].trim() : '';
                  const count = parts[1] ? parts[1].trim() : '';
                  return (
                    <div key={idx} className="border border-brand-rose/20 px-3 py-1.5 flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">{label}</span>
                      <span className="text-xs font-bold text-gray-900 bg-brand-cream/50 px-1.5 rounded-sm">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Horizontal Sliders */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="bg-brand-cream/20/50 py-10 mt-10">
          <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6">
            
            <div className="mb-12">
              <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 mb-6">Similar Products</h2>
              <div className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                {relatedProducts.slice(0, 8).map((p: any) => (
                  <div key={p.id} className="w-[150px] md:w-[200px] shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6">Customers Also Viewed</h2>
              <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                {relatedProducts.slice(2, 10).map((p: any) => (
                  <div key={p.id} className="w-[160px] md:w-[220px] shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            {product.brand && (
              <div className="mb-12">
                <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6">More From {product.brand}</h2>
                <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                  {relatedProducts.slice(0, 6).map((p: any) => (
                    <div key={p.id} className="w-[160px] md:w-[220px] shrink-0 snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6">Recently Viewed</h2>
              <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                {relatedProducts.slice(5, 12).map((p: any) => (
                  <div key={p.id} className="w-[160px] md:w-[220px] shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Bag */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-rose/20 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex gap-3 z-40 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          className={`w-12 h-12 rounded-sm flex items-center justify-center border transition-all duration-300 cursor-pointer active:scale-95 ${wished ? 'border-brand-burgundy bg-brand-cream text-brand-burgundy' : 'border-brand-rose/30 bg-white text-gray-600'}`} 
          onClick={handleWishlist}
        >
          <Heart className={`w-5 h-5 ${wished ? 'fill-brand-burgundy' : ''}`} />
        </button>
        <button 
          className={`flex-1 rounded-sm font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${!inStock ? 'bg-gray-300 cursor-not-allowed' : (inCart ? 'bg-gray-900 hover:bg-black' : 'bg-brand-burgundy hover:bg-brand-wine')}`} 
          onClick={handleCartClick} 
          disabled={!inStock}
        >
          {!inStock ? 'Out of Stock' : (inCart ? <><ShoppingBag className="w-5 h-5" /> Go to Cart</> : <><ShoppingBag className="w-5 h-5" /> Add to Cart</>)}
        </button>
      </div>
    </div>
  );
}
