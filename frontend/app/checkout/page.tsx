"use client";

import RoleAccessGate from "@/components/auth/RoleAccessGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";

export default function CheckoutPage() {
  const { cart, authUser, isAuthenticated, isLoading } = useCart();
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



  if (!isLoading && isAuthenticated && authUser && !authUser.address) {
    return (
      <RoleAccessGate mode="customer">
        <div className="container mx-auto px-4 py-10 max-w-4xl flex items-center justify-center min-h-[60vh]">
          <Card className="relative overflow-hidden border-0 bg-background shadow-2xl sm:max-w-[500px] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 z-0"></div>
            
            <CardContent className="relative z-10 flex flex-col items-center justify-center text-center p-10 space-y-6">
              <div className="bg-primary/10 p-4 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Where should we deliver?</h2>
                <p className="text-muted-foreground">
                  Please set your delivery address on the map so we can accurately route your orders to your doorstep.
                </p>
              </div>

              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto px-8">
                <Link href="/profile">Set Address in Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </RoleAccessGate>
    );
  }

  if (cart.length === 0) {
    return (
      <RoleAccessGate mode="customer">
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
      </RoleAccessGate>
    );
  }

  return (
    <RoleAccessGate mode="customer">
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
                <span className="font-medium">â‚¹{subtotal}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">â‚¹{subtotal}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleAccessGate>
  );
}

