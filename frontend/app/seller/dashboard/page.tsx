"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSellerData } from "@/context/SellerDataContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function SellerDashboard() {
  const { products, orders, profile, isLoading } = useSellerData();
  const { authUser } = useCart();
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  useEffect(() => {
    if (authUser && authUser.role === "SELLER" && authUser.sellerApproved === false) {
      setShowVerificationAlert(true);
    }
  }, [authUser]);

  return (
    <div className="space-y-6">
      {showVerificationAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowVerificationAlert(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Verification Pending</h3>
            <p className="mt-2 text-sm text-slate-600">
              You cannot add products until verified by the admin.
            </p>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowVerificationAlert(false)}>Okay</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Seller dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your storefront, products, and orders in one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/seller/add">
            <Button>Add product</Button>
          </Link>
          <Link href="/seller/products">
            <Button variant="outline">Manage products</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : products.length}</p>
            <p className="mt-2 text-sm text-slate-600">Published catalog items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : orders.length}</p>
            <p className="mt-2 text-sm text-slate-600">Recent orders with your products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Store</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-slate-900">{profile?.businessName ?? "Unknown"}</p>
            <p className="mt-2 text-sm text-slate-600">{profile?.status ?? "Profile pending"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Latest products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-slate-600">No products found. Add your first listing to get started.</p>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.category ?? "Uncategorized"}</p>
                    </div>
                    <p className="text-sm text-slate-700">{product.price}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/seller/business-profile" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 hover:bg-slate-100">
              Update business profile
            </Link>
            <Link href="/seller/orders" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 hover:bg-slate-100">
              Review orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
