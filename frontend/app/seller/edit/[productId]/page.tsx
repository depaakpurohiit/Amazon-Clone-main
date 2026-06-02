"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProduct, ProductDTO, updateSellerProduct } from "@/lib/api";

export default function SellerEditProductPage() {
  const params = useParams();
  const productId = Array.isArray(params?.productId) ? params?.productId[0] : params?.productId;
  const router = useRouter();
  const [form, setForm] = useState<Partial<ProductDTO>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const product = await getProduct(productId);
        setForm(product);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [productId]);

  const handleChange = (key: keyof ProductDTO, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) return;
    setError(null);
    setIsSaving(true);
    try {
      await updateSellerProduct(productId, form);
      router.push("/seller/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit product</h1>
        <p className="mt-2 text-sm text-slate-600">Update listing details and save your changes.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-28 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700">Product name</label>
              <input
                value={form.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <input
                value={form.category ?? ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Main image URL</label>
              <input
                value={form.url ?? ""}
                onChange={(e) => handleChange("url", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Secondary image URL</label>
              <input
                value={form.resUrl ?? ""}
                onChange={(e) => handleChange("resUrl", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Price</label>
                <input
                  value={form.price ?? ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">MRP</label>
                <input
                  value={form.mrp ?? ""}
                  onChange={(e) => handleChange("mrp", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Discount</label>
                <input
                  value={form.discount ?? ""}
                  onChange={(e) => handleChange("discount", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Accessory value</label>
                <input
                  type="number"
                  value={form.accValue ?? 0}
                  onChange={(e) => handleChange("accValue", Number(e.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
