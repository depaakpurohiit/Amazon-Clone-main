"use client";

import {
  addToCart as apiAddToCart,
  ApiError,
  CompatAuthUserDTO,
  getAuthUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  removeCartItem as apiRemoveCartItem,
  updateCartQty as apiUpdateCartQty,
} from "@/lib/api";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  accValue?: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  isAuthenticated: boolean;
  authUser: CompatAuthUserDTO | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (body: { name: string; number: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authUser, setAuthUser] = useState<CompatAuthUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const user = await getAuthUser();
      setAuthUser(user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setAuthUser(null);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load session");
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refresh();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!authUser) {
      setCart([]);
      return;
    }
    setCart(
      (authUser.cart ?? []).map((entry) => ({
        cartItemId: entry.id,
        productId: entry.cartItem.id,
        name: entry.cartItem.name,
        image: entry.cartItem.url,
        accValue: entry.cartItem.accValue,
        quantity: entry.qty,
      }))
    );
  }, [authUser]);

  const isAuthenticated = useMemo(() => Boolean(authUser), [authUser]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    await apiLogin({ email, password });
    await refresh();
  }, [refresh]);

  const signup = useCallback(
    async (body: { name: string; number: string; email: string; password: string }) => {
      setError(null);
      await apiRegister(body);
      await apiLogin({ email: body.email, password: body.password });
      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await apiLogout();
    } finally {
      await refresh();
    }
  }, [refresh]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      setError(null);
      if (!isAuthenticated) throw new Error("Please sign in to add items to cart.");
      const times = Math.max(1, quantity);
      for (let i = 0; i < times; i++) {
        await apiAddToCart(productId);
      }
      await refresh();
    },
    [isAuthenticated, refresh]
  );

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      setError(null);
      if (!isAuthenticated) throw new Error("Please sign in to manage your cart.");
      await apiRemoveCartItem(cartItemId);
      await refresh();
    },
    [isAuthenticated, refresh]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      setError(null);
      if (!isAuthenticated) throw new Error("Please sign in to manage your cart.");
      await apiUpdateCartQty(cartItemId, Math.max(1, quantity));
      await refresh();
    },
    [isAuthenticated, refresh]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        authUser,
        isAuthenticated,
        isLoading,
        error,
        refresh,
        login,
        signup,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
