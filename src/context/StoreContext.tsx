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
};

export type CartItem = Product & {
  qty: number;
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
  email: string;
  phone?: string;
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
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (product: Product) => void;
  isWished: (id: number) => boolean;
  isInCart: (id: number) => boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  toast: (msg: string, icon?: string) => void;
  toastMessage: { msg: string; icon: string } | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('foxa_cart');
      const storedWish = localStorage.getItem('foxa_wish');
      const storedUser = localStorage.getItem('foxa_user');
      const storedPlace = localStorage.getItem('foxa_place');
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWish) setWishlist(JSON.parse(storedWish));
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedPlace) setSelectedPlaceState(JSON.parse(storedPlace));
    }
  }, []);

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
    const existing = newCart.find((i) => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 99);
    } else {
      newCart.push({ ...product, qty });
    }
    saveCart(newCart);
    toast(`${product.name.substring(0, 20)}... added!`);
  };

  const removeFromCart = (id: number) => {
    const newCart = cart.filter((i) => i.id !== id);
    saveCart(newCart);
  };

  const updateQty = (id: number, delta: number) => {
    const newCart = [...cart];
    const item = newCart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
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

  const isInCart = (id: number) => {
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
