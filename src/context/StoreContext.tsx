'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock_quantity?: string | number;
  category_name?: string;
  brand?: string;
  size?: string;
  color?: string;
};

export type CartItem = Product & {
  qty: number;
  cartItemId: string;
};

export type Place = {
  id: string;
  name: string;
  city?: string;
  pincode?: string;
  address?: string;
  type?: 'delivery' | 'store';
};

export type User = {
  name: string;
  email?: string;
  phone: string;
  token: string;
} | null;

type StoreContextType = {
  cart: CartItem[];
  wishlist: Product[];
  user: User;
  selectedPlace: Place;
  setSelectedPlace: (place: Place) => void;
  placeModalOpen: boolean;
  setPlaceModalOpen: (open: boolean) => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQty: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (product: Product) => void;
  isWished: (id: number) => boolean;
  isInCart: (id: number, size?: string, color?: string) => boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  toast: (msg: string, icon?: string) => void;
  toastMessage: { msg: string; icon: string } | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
};

const DEFAULT_PLACE: Place = {
  id: 'ekm-1',
  name: 'Ernakulam (Kochi), Kerala 682001',
  city: 'Ernakulam',
  pincode: '682001',
  address: 'MG Road, Kochi, Kerala',
  type: 'delivery'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User>(null);
  const [selectedPlace, setSelectedPlaceState] = useState<Place>(DEFAULT_PLACE);
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ msg: string; icon: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('foxa_cart');
      const storedWish = localStorage.getItem('foxa_wish');
      const storedUser = localStorage.getItem('foxa_user');
      const storedPlace = localStorage.getItem('foxa_place');
      
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWish) setWishlist(JSON.parse(storedWish));
      if (storedUser) setUser(JSON.parse(storedUser));

      if (storedPlace) {
        setSelectedPlaceState(JSON.parse(storedPlace));
      } else {
        // Automatically fetch live user location if no saved place exists
        fetchUserLocation();
      }
    }
  }, []);

  const fetchUserLocation = async () => {
    if (typeof window === 'undefined') return;

    const detectFromCoords = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const districtName = addr.state_district || addr.county || addr.city || addr.town || addr.village || 'Kerala';
          const postcode = addr.postcode || '';
          const detectedPlace: Place = {
            id: `auto-${Date.now()}`,
            name: `${districtName}${postcode ? `, ${postcode}` : ''}`,
            city: districtName,
            pincode: postcode,
            address: data.display_name?.substring(0, 50) || 'Live Detected Location',
            type: 'delivery'
          };
          setSelectedPlaceState(detectedPlace);
          localStorage.setItem('foxa_place', JSON.stringify(detectedPlace));
          return;
        }
      } catch (e) {
        // ignore reverse geocoding failure
      }

      const detectedPlace: Place = {
        id: `auto-geo-${Date.now()}`,
        name: `Detected Area (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        city: 'Detected Location',
        pincode: 'GPS',
        address: 'Live Geolocation',
        type: 'delivery'
      };
      setSelectedPlaceState(detectedPlace);
      localStorage.setItem('foxa_place', JSON.stringify(detectedPlace));
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          detectFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        async () => {
          // Fallback to IP geolocation if GPS permission is denied or pending
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.city || ipData.region) {
                const ipPlace: Place = {
                  id: `ip-${Date.now()}`,
                  name: `${ipData.city || ipData.region}${ipData.postal ? `, ${ipData.postal}` : ''}`,
                  city: ipData.city || ipData.region,
                  pincode: ipData.postal || '',
                  address: `${ipData.city || ''}, ${ipData.region || ''}`,
                  type: 'delivery'
                };
                setSelectedPlaceState(ipPlace);
                localStorage.setItem('foxa_place', JSON.stringify(ipPlace));
              }
            }
          } catch (e) {
            // Keep default DEFAULT_PLACE
          }
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  };

  const setSelectedPlace = (place: Place) => {
    setSelectedPlaceState(place);
    if (typeof window !== 'undefined') {
      localStorage.setItem('foxa_place', JSON.stringify(place));
    }
    toast(`Location set to ${place.name}`, 'map-pin');
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('foxa_cart', JSON.stringify(newCart));
  };

  const saveWish = (newWish: Product[]) => {
    setWishlist(newWish);
    localStorage.setItem('foxa_wish', JSON.stringify(newWish));
  };

  const toast = (msg: string, icon: string = 'check-circle') => {
    setToastMessage({ msg, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const addToCart = (product: Product, qty: number = 1) => {
    const newCart = [...cart];
    const cartItemId = `${product.id}-${product.size || ''}-${product.color || ''}`;
    const existing = newCart.find((i) => i.cartItemId === cartItemId || (i.id === product.id && i.size === product.size && i.color === product.color));
    
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 99);
    } else {
      newCart.push({ ...product, qty, cartItemId });
    }
    saveCart(newCart);
    toast(`${product.name.substring(0, 20)}... added!`);
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = cart.filter((i) => i.cartItemId !== cartItemId && i.id.toString() !== cartItemId.toString());
    saveCart(newCart);
  };

  const updateQty = (cartItemId: string, delta: number) => {
    let newCart = [...cart];
    const item = newCart.find((i) => i.cartItemId === cartItemId || i.id.toString() === cartItemId.toString());
    if (!item) return;
    item.qty = item.qty + delta;
    
    if (item.qty <= 0) {
      newCart = newCart.filter((i) => i.cartItemId !== cartItemId && i.id.toString() !== cartItemId.toString());
    }
    
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const toggleWishlist = (product: Product) => {
    const idx = wishlist.findIndex((i) => i.id === product.id);
    const newWish = [...wishlist];
    if (idx >= 0) {
      newWish.splice(idx, 1);
      toast('Removed from wishlist', 'heart-crack');
    } else {
      newWish.push(product);
      toast('Added to wishlist', 'heart');
    }
    saveWish(newWish);
  };

  const isWished = (id: number) => {
    return wishlist.some((i) => i.id === id);
  };

  const isInCart = (id: number, size?: string, color?: string) => {
    if (size !== undefined || color !== undefined) {
      return cart.some((i) => i.id === id && i.size === size && i.color === color);
    }
    return cart.some((i) => i.id === id);
  };

  const loginUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('foxa_user', JSON.stringify(newUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('foxa_user');
    localStorage.removeItem('foxa_user_token');
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        user,
        selectedPlace,
        setSelectedPlace,
        placeModalOpen,
        setPlaceModalOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        toggleWishlist,
        isWished,
        isInCart,
        loginUser,
        logoutUser,
        toast,
        toastMessage,
        drawerOpen,
        setDrawerOpen,
        authOpen,
        setAuthOpen,
        authMode,
        setAuthMode
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
