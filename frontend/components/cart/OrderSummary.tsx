"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { CreditCard, Heart, Shield, Truck } from "lucide-react";
import Link from "next/link";

export default function OrderSummary() {
  const { cart } = useCart();

  const subtotal = cart.reduce((sum, item) => {
    const unit = typeof item.accValue === "number" ? item.accValue : 0;
    return sum + unit * item.quantity;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const FREE_DELIVERY_THRESHOLD = 499;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + gst;

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span className="font-medium">{formatINR(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Charges</span>
            {isFreeDelivery ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground line-through">₹49</span>
                <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
              </div>
            ) : (
              <span className="font-medium">{formatINR(deliveryFee)}</span>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST & Taxes (18%)</span>
            <span className="font-medium">{formatINR(gst)}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-lg font-semibold block">Total</span>
              <span className="text-[11px] text-muted-foreground">(Incl. of GST & Delivery)</span>
            </div>
            <span className="text-xl font-bold text-primary">{formatINR(total)}</span>
          </div>
        </div>

        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {isFreeDelivery
                ? "🎉 You are eligible for FREE Delivery!"
                : `Add ${formatINR(FREE_DELIVERY_THRESHOLD - subtotal)} more for FREE Delivery`}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href="/checkout" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Proceed to Checkout
          </Link>
        </Button>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secure SSL checkout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>Free returns within 30 days</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span>24/7 customer support</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

