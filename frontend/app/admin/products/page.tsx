"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminDeleteProduct, getProducts, ProductDTO } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await adminDeleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Product moderation</h1>
        <p className="mt-2 text-sm text-slate-600">Review all published items and remove listings as needed.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No products available.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Product</p>
                  <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600">Seller: {product.sellerName ?? "Marketplace"}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === product.id}
                    onClick={() => handleDelete(product.id)}
                  >
                    {deletingId === product.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
