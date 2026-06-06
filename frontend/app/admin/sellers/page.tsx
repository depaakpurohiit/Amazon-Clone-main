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
            <div key={seller.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Store ID</p>
                  <p className="text-lg font-semibold text-slate-900">{seller.businessName ?? "Unnamed store"}</p>
                  <p className="mt-1 text-sm text-slate-600">Owner ID: {seller.userId ?? "Unknown"}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting === seller.id}
                    onClick={() => handleRemoveSeller(seller.id)}
                  >
                    {isDeleting === seller.id ? "Removing…" : "Remove seller"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Status</p>
                  <p>{seller.status ?? "Unknown"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Logo</p>
                  <p>{seller.logoUrl ? <a className="text-sky-600 hover:underline" href={seller.logoUrl}>{seller.logoUrl}</a> : "No logo"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
