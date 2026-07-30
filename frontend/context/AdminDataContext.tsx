"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAdminSellers, getAdminNotifications, getLiveUsers, getSellerRequests } from "@/lib/api";
import type { SellerProfileDTO } from "@/lib/api";

type AdminData = {
  sellers: SellerProfileDTO[];
  notifications: any[];
  liveUsersCount: number;
  sellerRequests: any[];
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
};

const AdminDataContext = createContext<AdminData | undefined>(undefined);

export const AdminDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [sellers, setSellers] = useState<SellerProfileDTO[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [liveUsersCount, setLiveUsersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellerRequests, setSellerRequests] = useState<any[]>([]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sellersRes, notificationsRes, liveUsersRes, requestsRes] = await Promise.allSettled([
        getAdminSellers(),
        getAdminNotifications(),
        getLiveUsers(),
        getSellerRequests(),
      ]);

      if (sellersRes.status === "fulfilled") {
        setSellers(sellersRes.value ?? []);
      }
      if (notificationsRes.status === "fulfilled") {
        setNotifications(notificationsRes.value ?? []);
      }
      if (liveUsersRes.status === "fulfilled") {
        setLiveUsersCount(liveUsersRes.value?.count ?? 0);
      }
      if (requestsRes.status === "fulfilled") {
        setSellerRequests(requestsRes.value ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll().catch(() => {});
  }, [refreshAll]);

  return (
    <AdminDataContext.Provider value={{ sellers, notifications, liveUsersCount, sellerRequests, isLoading, error, refreshAll }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
};
