"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createSellerProduct, getSellerProfile } from "@/lib/api";
import { useSellerData } from "@/context/SellerDataContext";
import { useEffect } from "react";

export default function SellerAddProductPage() {
  const router = useRouter();
  const { refreshProducts } = useSellerData();
  const [form, setForm] = useState({
    name: "",
    category: "",
    url: "",
    resUrl: "",
    price: "",
    mrp: "",
    discount: "",
    value: "",
    accValue: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSellerProfile, setHasSellerProfile] = useState<boolean | null>(null);

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.name || String(form.name).trim() === "") return "Product name is required.";

    const price = Number(form.price);
    if (isNaN(price)) return "Price must be a valid number.";
    if (price < 0) return "Price cannot be negative.";

    if (form.mrp !== "") {
      const mrp = Number(form.mrp);
      if (isNaN(mrp)) return "MRP must be a valid number.";
      if (mrp < price) return "MRP should be greater than or equal to Price.";
    }

    if (form.discount !== "") {
      const disc = Number(form.discount);
      if (isNaN(disc)) return "Discount must be a valid number.";
      if (disc < 0 || disc > 100) return "Discount must be between 0 and 100.";
    }

    if (typeof form.accValue === "number" && form.accValue < 0) return "Accessory value cannot be negative.";

    const testUrl = (u: string) => {
      if (!u) return true;
      try {
        new URL(u);
        return true;
      } catch (e) {
        return false;
      }
    };
    if (form.url && !testUrl(form.url)) return "Main image URL is not a valid URL.";
    if (form.resUrl && !testUrl(form.resUrl)) return "Secondary image URL is not a valid URL.";

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      await createSellerProduct(form);
      // refresh seller products cache
      try { await refreshProducts(); } catch {}
      router.push("/seller/products");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to save product";
      setError(msg);
      // If backend says seller profile missing, redirect user to business profile
      if (typeof msg === "string" && msg.toLowerCase().includes("seller profile")) {
        router.push("/seller/business-profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const profile = await getSellerProfile();
        // API returns empty object when not present; consider present if id exists
        setHasSellerProfile(Boolean(profile && (profile.id || profile.userId)));
      } catch (err) {
        setHasSellerProfile(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add product</h1>
        <p className="mt-2 text-sm text-slate-600">Create a new listing for your seller catalog.</p>
      </div>

      {hasSellerProfile === false ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">You need to complete your business profile before you can publish products.</p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/seller/business-profile">Create business profile</Link>
            </Button>
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700">Product name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <input
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Main image URL</label>
            <input
              value={form.url}
              onChange={(e) => handleChange("url", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Secondary image URL</label>
            <input
              value={form.resUrl}
              onChange={(e) => handleChange("resUrl", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">MRP</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.mrp}
                onChange={(e) => handleChange("mrp", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Discount</label>
              <div className="mt-2 flex rounded-2xl border border-slate-300 bg-slate-50 focus-within:ring-2 focus-within:ring-orange-400">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0"
                  value={form.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
                  className="w-full rounded-l-2xl border-none bg-transparent px-4 py-3 text-sm outline-none"
                />
                <span className="mr-4 inline-flex items-center text-sm text-slate-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Accessory value</label>
              <input
                type="number"
                min="0"
                value={form.accValue}
                onChange={(e) => handleChange("accValue", Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700">Value label</label>
            <input
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <p className="text-sm text-slate-600">You can leave extra fields blank and fill them later.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Publish product"}
            </Button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
}
