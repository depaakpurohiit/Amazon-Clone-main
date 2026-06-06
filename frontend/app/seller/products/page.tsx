"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductDTO, deleteSellerProduct } from "@/lib/api";
import { useSellerData } from "@/context/SellerDataContext";

export default function SellerProductsPage() {
  const { products, isLoading, refreshProducts } = useSellerData();
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    try {
      await deleteSellerProduct(id);
      // refresh cached seller products
      await refreshProducts();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Product catalog</h1>
          <p className="mt-2 text-sm text-slate-600">Publish, edit, or remove products from your seller store.</p>
        </div>
        <Link href="/seller/add" className="self-start sm:self-auto">
          <Button>Add new product</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-slate-600">No published products yet. Add your first product to start selling.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="space-y-2 text-sm text-slate-600">
                  <p>{product.category ?? "Uncategorized"}</p>
                  <p>Price: {product.price}</p>
                  <p>Discount: {product.discount ?? "—"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/seller/edit/${product.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isSaving}
                    onClick={() => handleDelete(product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
