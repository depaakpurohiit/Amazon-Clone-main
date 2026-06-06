"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import type { ProductDTO } from "@/lib/api";

type HomeData = {
  products: ProductDTO[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const HomeDataContext = createContext<HomeData | undefined>(undefined);

export const HomeDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Dont eagerly fetch here; let the Home page or other consumers call refresh when needed.
    // However, if products array is empty, prefetch once for faster UX.
    if (products.length === 0) {
      refresh().catch(() => {});
    }
  }, [products.length, refresh]);

  return (
    <HomeDataContext.Provider value={{ products, isLoading, error, refresh }}>
      {children}
    </HomeDataContext.Provider>
  );
};

export const useHomeData = () => {
  const ctx = useContext(HomeDataContext);
  if (!ctx) throw new Error("useHomeData must be used within HomeDataProvider");
  return ctx;
};
