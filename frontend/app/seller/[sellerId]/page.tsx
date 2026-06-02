"use client";

import { useEffect, useState } from "react";
import { getSellerProductsBySeller, getSellerPublicProfile } from "@/lib/api";
import { useParams } from "next/navigation";

export default function SellerPage() {
  const params = useParams();
  const sellerId = Array.isArray(params?.sellerId) ? params?.sellerId[0] : params?.sellerId;
  const [products, setProducts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!sellerId) return;
    (async () => {
      try {
        const [productData, profileData] = await Promise.all([
          getSellerProductsBySeller(sellerId),
          getSellerPublicProfile(sellerId),
        ]);
        setProducts(productData);
        setProfile(profileData);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [sellerId]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{profile?.businessName ?? "Seller storefront"}</h1>
        <p className="mt-2 text-sm text-slate-600">{profile?.bio ?? "Browse products from this seller."}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            No products found for this seller.
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{product.category ?? "Category not specified"}</p>
              <p className="mt-3 text-sm text-slate-700">Price: {product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
