"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            No Favorites Yet
          </h1>
          <p className="text-muted-foreground mb-6">
            Start adding products to your favorites by clicking the heart icon
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-2">
              {favorites.length} {favorites.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => {
          const imageSrc = imageErrors[product.id]
            ? "/images/NoImage.jpg"
            : product.resUrl?.trim() || product.url;

          return (
            <Card
              key={product.id}
              className="group overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <Link href={`/product/${product.id}`} className="block relative">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      unoptimized={imageSrc.startsWith("/")}
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(product.id)}
                    />
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background text-destructive opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFavorite(product.id);
                  }}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                <Link href={`/product/${product.id}`}>
                  <h2 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h2>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {product.price}
                  </span>
                  {product.mrp && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.mrp}
                    </span>
                  )}
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/product/${product.id}`}>View Product</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
