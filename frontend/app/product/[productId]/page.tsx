"use client";

import Features from "@/components/product/Features";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductNotFound from "@/components/product/ProductNotFound";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import RoleAccessGate from "@/components/auth/RoleAccessGate";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import SellerBadge from "@/components/seller/SellerBadge";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <Skeleton className="h-20 w-20 rounded-xl" />
            <Skeleton className="h-20 w-20 rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-5/6" />
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>

          <Separator />

          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-40 rounded-lg" />

            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function Product() {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const imageSrc = product
    ? imageError
      ? "/images/NoImage.jpg"
      : product.resUrl?.trim() || product.url
    : null;

  const shouldBypassNextImage = Boolean(
    imageSrc && (imageSrc.startsWith("/") || imageSrc.startsWith("http://"))
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getProduct(String(productId));
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!isLoading && !product) {
    return <ProductNotFound />;
  }

  const handleAddToCart = async () => {
    setIsAdding(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      if (product) await addToCart(product.id, quantity);
    } catch {
      router.push(`/login?next=${encodeURIComponent(`/product/${String(productId)}`)}`);
      setIsAdding(false);
      return;
    }

    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push("/cart"), 500);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <RoleAccessGate mode="customer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductBreadcrumb />

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="w-full max-w-[500px] mx-auto flex flex-col items-center px-4">
              <div className="rounded-xl shadow-lg overflow-hidden mb-4 w-full">
                {product ? (
                  <Image
                    src={imageSrc ?? "/images/NoImage.jpg"}
                    alt={product.name}
                    width={480}
                    height={480}
                    priority
                    fetchPriority="high"
                    unoptimized={shouldBypassNextImage}
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="rounded-xl object-cover w-full h-auto max-h-[420px]"
                    onError={() => {
                      if (!imageError) setImageError(true);
                    }}
                  />
                ) : (
                  <Skeleton className="aspect-square w-full rounded-none" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {product?.name}
            </h1>
            {product?.sellerId && (
              <div className="mb-2">
                <SellerBadge
                  sellerId={product.sellerId}
                  sellerName={product.sellerName}
                />
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (4.8) • 127 reviews
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {product ? product.price : ""}
              </span>
              {product?.mrp ? (
                <span className="text-muted-foreground line-through">
                  {product.mrp}
                </span>
              ) : null}
              {product?.discount ? (
                <span className="text-sm font-medium text-primary">
                  {product.discount}
                </span>
              ) : null}
            </div>

            {product?.points?.length ? (
              <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                {product.points.slice(0, 6).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                Product details and highlights.
              </p>
            )}

            <Separator />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange("increment")}
                      className="h-10 w-10 rounded-l-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className={cn(
                    "flex-1 transition-all duration-300",
                    justAdded
                      ? "bg-green-600 text-white hover:bg-green-600"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={handleAddToCart}
                  disabled={isAdding || !product}
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

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleBuyNow}
                  className="flex-1"
                  disabled={!product}
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    isLiked && "text-destructive"
                  )}
                >
                  <Heart
                    className={cn("h-4 w-4 mr-2", isLiked && "fill-current")}
                  />
                  Add to Wishlist
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Features />
      </div>
    </RoleAccessGate>
  );
}
