"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMySellerProducts, getSellerProfile, getSellerOrders } from "@/lib/api";
import type { ProductDTO, SellerProfileDTO, SellerOrderDTO } from "@/lib/api";

type SellerData = {
  products: ProductDTO[];
  profile: SellerProfileDTO | null;
  orders: SellerOrderDTO[];
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  invalidateProducts: () => void;
};

const SellerDataContext = createContext<SellerData | undefined>(undefined);

export const SellerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [profile, setProfile] = useState<SellerProfileDTO | null>(null);
  const [orders, setOrders] = useState<SellerOrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await getMySellerProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await getSellerProfile();
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const data = await getSellerOrders();
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([refreshProducts(), refreshProfile(), refreshOrders()]);
    } finally {
      setIsLoading(false);
    }
  }, [refreshProducts, refreshProfile, refreshOrders]);

  useEffect(() => {
    // Only fetch when this provider is mounted (i.e., when user navigates to seller area)
    refreshAll().catch(() => {});
  }, [refreshAll]);

  const invalidateProducts = useCallback(() => setProducts([]), []);

  return (
    <SellerDataContext.Provider value={{ products, profile, orders, isLoading, error, refreshAll, refreshProducts, refreshProfile, refreshOrders, invalidateProducts }}>
      {children}
    </SellerDataContext.Provider>
  );
};

export const useSellerData = () => {
  const ctx = useContext(SellerDataContext);
  if (!ctx) throw new Error("useSellerData must be used within SellerDataProvider");
  return ctx;
};
