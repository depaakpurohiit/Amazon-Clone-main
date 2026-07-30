"use client";

import { API_BASE_URL } from "@/lib/api";
import { useHomeData } from "@/context/HomeDataContext";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function ProductList({ query }: { query?: string }) {
  const { products, isLoading, error, refresh } = useHomeData();

  const filtered = useMemo(() => {
    const q = (query ?? "").trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
      {isLoading ? (
        Array.from({ length: 9 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
      ) : error ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            
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
