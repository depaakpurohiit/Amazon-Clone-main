"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function CheckoutPage() {
  const { cart, isAuthenticated, isLoading } = useCart();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unit = typeof item.accValue === "number" ? item.accValue : 0;
      return sum + unit * item.quantity;
    }, 0);
  }, [cart]);

  if (!isLoading && !isAuthenticated) {
    router.replace(`/login?next=${encodeURIComponent("/checkout")}`);
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild>
              <Link href="/">Continue shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shipping & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This page is redesigned with Bloom UI. Next step is wiring the
              Razorpay flow (`/api/create-order` and `/api/pay-order`) to this
              checkout button.
            </p>
            <Button className="w-full" disabled>
              Place order (coming next)
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">₹{subtotal}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

