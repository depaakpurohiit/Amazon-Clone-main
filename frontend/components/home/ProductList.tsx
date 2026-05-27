"use client";

import { API_BASE_URL, getProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ query }: { query?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        if (!cancelled) setProducts(data);
      } catch (e) {
        if (!cancelled) {
          if (e instanceof TypeError) {
            setError(`Backend not reachable at ${API_BASE_URL}`);
          } else {
            setError(e instanceof Error ? e.message : "Failed to load products");
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = (query ?? "").trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 max-w-7xl mx-auto">
      {isLoading ? (
        Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[420px] rounded-xl border border-border bg-muted/30 animate-pulse"
          />
        ))
      ) : error ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Couldnâ€™t load products
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : filtered.length > 0 ? (
        filtered.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={idx === 0 && !query}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">ðŸ”</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

