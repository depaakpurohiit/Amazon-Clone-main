"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAdminSeller, SellerProfileDTO } from "@/lib/api";
import { useAdminData } from "@/context/AdminDataContext";

export default function AdminSellersPage() {
  const { sellers, isLoading, refreshAll } = useAdminData();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleRemoveSeller = async (id?: string) => {
    if (!id) return;
    setIsDeleting(id);
    try {
      await deleteAdminSeller(id);
      // refresh admin cache
      await refreshAll();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Seller management</h1>
        <p className="mt-2 text-sm text-slate-600">Approve, review, or remove seller storefronts from the platform.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No seller profiles found.
        </div>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div key={seller.id}>
              {isDeleting === seller.id ? (
                <div className="h-48 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse shadow-sm" />
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {seller.logoUrl ? (
                        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex-shrink-0">
                          <img src={seller.logoUrl} alt={seller.businessName ?? "Store Logo"} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl flex-shrink-0">
                          {(seller.businessName ?? "S").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Store Profile</p>
                        <p className="text-lg font-semibold text-slate-900">{seller.businessName ?? "Unnamed store"}</p>
                        <p className="mt-0.5 text-sm text-slate-600">Owner ID: {seller.userId ?? "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting === seller.id}
                        onClick={() => handleRemoveSeller(seller.id)}
                      >
                        Remove seller
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 border border-slate-100">
                      <p className="font-semibold text-slate-900">Status</p>
                      <p className="mt-1 font-medium text-emerald-600">{seller.status ?? "Unknown"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 border border-slate-100">
                      <p className="font-semibold text-slate-900 mb-2">Logo Preview</p>
                      {seller.logoUrl ? (
                        <div className="flex items-center gap-3">
                          <img src={seller.logoUrl} alt={seller.businessName ?? "Logo"} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                          <span className="text-xs text-slate-500 truncate max-w-[200px]">{seller.logoUrl}</span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No logo uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
