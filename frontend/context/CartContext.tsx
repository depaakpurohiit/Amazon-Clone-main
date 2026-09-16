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
  sendSignupOtp as apiSendSignupOtp,
  updateCartQty as apiUpdateCartQty,
  verifySignupOtp as apiVerifySignupOtp,
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
  refresh: () => Promise<CompatAuthUserDTO | null>;
  login: (email: string, password: string) => Promise<CompatAuthUserDTO | null>;
  signup: (body: { name: string; number: string; email: string; password: string; confirmPassword: string; accountType?: "customer" | "seller"; role?: "USER" | "MANAGER" | "ADMIN" }) => Promise<CompatAuthUserDTO | null>;
  sendSignupOtp: (body: { name: string; number: string; email: string; password: string; confirmPassword: string; accountType?: "customer" | "seller"; role?: "USER" | "MANAGER" | "ADMIN" }) => Promise<{ status: boolean; message: string; previewOtp?: string }>;
  verifySignupOtp: (body: { email: string; otp: string; name?: string; number?: string; password?: string; accountType?: "customer" | "seller"; role?: "USER" | "MANAGER" | "ADMIN" }) => Promise<CompatAuthUserDTO | null>;
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const user = await getAuthUser();
      setAuthUser(user);
      return user;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setAuthUser(null);
        return null;
      } else {
        setError(e instanceof Error ? e.message : "Failed to load session");
        return null;
      }
    }
  }, []);

  const refreshWithRetry = useCallback(
    async (attempts = 4, delayMs = 200) => {
      let user: CompatAuthUserDTO | null = null;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        user = await refresh();
        if (user) return user;
        if (attempt < attempts - 1) {
          await sleep(delayMs);
        }
      }
      return user;
    },
    [refresh]
  );

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

  // Load guest cart from localStorage if unauthenticated
  useEffect(() => {
    if (authUser) {
      setCart(
        (authUser.cart ?? []).map((entry) => ({
          cartItemId: String(entry.id),
          productId: String(entry.cartItem?.id || entry.id),
          name: entry.cartItem?.name || "Product",
          image: entry.cartItem?.url || "/images/NoImage.jpg",
          accValue: entry.cartItem?.accValue,
          quantity: entry.qty || 1,
        }))
      );
    } else if (typeof window !== "undefined") {
      try {
        const savedGuest = localStorage.getItem("tradehive_guest_cart");
        if (savedGuest) {
          setCart(JSON.parse(savedGuest));
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    }
  }, [authUser]);

  const isAuthenticated = useMemo(() => Boolean(authUser), [authUser]);

  // Sync guest cart to server upon login
  const syncGuestCart = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const savedGuest = localStorage.getItem("tradehive_guest_cart");
      if (savedGuest) {
        const items: CartItem[] = JSON.parse(savedGuest);
        if (Array.isArray(items) && items.length > 0) {
          for (const it of items) {
            for (let q = 0; q < it.quantity; q++) {
              await apiAddToCart(it.productId);
            }
          }
          localStorage.removeItem("tradehive_guest_cart");
          await refresh();
        }
      }
    } catch (e) {
      console.warn("Error syncing guest cart:", e);
    }
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    await apiLogin({ email, password });
    const user = await refreshWithRetry();
    await syncGuestCart();
    return user;
  }, [refreshWithRetry, syncGuestCart]);

  const signup = useCallback(
    async (body: { name: string; number: string; email: string; password: string; confirmPassword: string; accountType?: "customer" | "seller"; role?: "USER" | "MANAGER" | "ADMIN" }) => {
      setError(null);
      await apiRegister(body);
      await apiLogin({ email: body.email, password: body.password });
      const user = await refreshWithRetry();
      await syncGuestCart();
      return user;
    },
    [refreshWithRetry, syncGuestCart]
  );

  const sendSignupOtp = useCallback(
    async (body: { name: string; number: string; email: string; password: string; confirmPassword: string; accountType?: "customer" | "seller"; role?: "USER" | "MANAGER" | "ADMIN" }) => {
      setError(null);
      return await apiSendSignupOtp(body);
    },
    []
  );

  const verifySignupOtp = useCallback(
    async (body: { email: string; otp: string; name?: string; number?: string; password?: string; accountType?: "customer" | "seller"; role?: "USER" | "MANAGER" | "ADMIN" }) => {
      setError(null);
      await apiVerifySignupOtp(body);
      const user = await refreshWithRetry();
      await syncGuestCart();
      return user;
    },
    [refreshWithRetry, syncGuestCart]
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await apiLogout();
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tradehive_guest_cart");
      }
      await refresh();
    }
  }, [refresh]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      setError(null);
      const count = Math.max(1, quantity);

      // Optimistic update: increment count immediately in cart
      setCart((prev) => {
        const existingIdx = prev.findIndex((i) => i.productId === productId || i.cartItemId === productId);
        let updated: CartItem[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + count,
          };
        } else {
          updated = [
            ...prev,
            {
              cartItemId: `temp-${productId}-${Date.now()}`,
              productId: productId,
              name: "Loading...",
              image: "/images/NoImage.jpg",
              quantity: count,
            },
          ];
        }

        if (!isAuthenticated && typeof window !== "undefined") {
          localStorage.setItem("tradehive_guest_cart", JSON.stringify(updated));
        }
        return updated;
      });

      if (isAuthenticated) {
        try {
          for (let i = 0; i < count; i++) {
            await apiAddToCart(productId);
          }
        } finally {
          await refresh();
        }
      }
    },
    [isAuthenticated, refresh]
  );

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      setError(null);
      setCart((prev) => {
        const updated = prev.filter((item) => item.cartItemId !== cartItemId && item.productId !== cartItemId);
        if (!isAuthenticated && typeof window !== "undefined") {
          localStorage.setItem("tradehive_guest_cart", JSON.stringify(updated));
        }
        return updated;
      });

      if (isAuthenticated) {
        try {
          await apiRemoveCartItem(cartItemId);
        } finally {
          await refresh();
        }
      }
    },
    [isAuthenticated, refresh]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      setError(null);
      const newQty = Math.max(1, quantity);
      setCart((prev) => {
        const updated = prev.map((item) =>
          item.cartItemId === cartItemId || item.productId === cartItemId
            ? { ...item, quantity: newQty }
            : item
        );
        if (!isAuthenticated && typeof window !== "undefined") {
          localStorage.setItem("tradehive_guest_cart", JSON.stringify(updated));
        }
        return updated;
      });

      if (isAuthenticated) {
        try {
          await apiUpdateCartQty(cartItemId, newQty);
        } finally {
          await refresh();
        }
      }
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
        sendSignupOtp,
        verifySignupOtp,
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
