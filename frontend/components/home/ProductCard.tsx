"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";
import { Check, Eye, Heart, ShoppingCart } from "lucide-react";
import SellerBadge from "@/components/seller/SellerBadge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { useRouter } from "next/navigation";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setIsLiked(isFavorite(product.id));
  }, [product.id, isFavorite]);

  const imageSrc = imageError
    ? "/images/NoImage.jpg"
    : product.resUrl?.trim() || product.url;

  const shouldBypassNextImage =
    imageSrc.startsWith("/") || imageSrc.startsWith("http://");

  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      await addToCart(product.id, 1);
    } catch {
      router.push(`/login?next=${encodeURIComponent(`/product/${product.id}`)}`);
      setIsAdding(false);
      return;
    }

    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <Card className="group overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          name="Like Button"
          className={cn(
            "absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/80 backdrop-blur-sm hover:bg-background",
            isLiked && "opacity-100 text-destructive"
          )}
          onClick={handleToggleLike}
        >
          <Heart
            name="Like Icon"
            className={cn("h-4 w-4", isLiked && "fill-current")}
          />
        </Button>

        <Link href={`/product/${product.id}`} className="block relative">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              priority={priority}
              unoptimized={shouldBypassNextImage}
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => {
                if (!imageError) setImageError(true);
              }}
            />
          </div>

          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </Link>
      </div>

      <CardContent className="p-4 space-y-3">
        {product.sellerId && (
          <div className="mb-1">
            <SellerBadge sellerId={product.sellerId} sellerName={product.sellerName} />
          </div>
        )}
        <Link href={`/product/${product.id}`}>
          <h2 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {product.price}
          </span>
        </div>

        <Button
          className={cn(
            "w-full transition-all duration-300",
            justAdded
              ? "bg-green-600 text-white hover:bg-green-600"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : justAdded ? (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Added to Cart!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
