"use client";

import RoleAccessGate from "@/components/auth/RoleAccessGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { MapPin, Shield, Truck, CreditCard, CheckCircle2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function formatINR(val: number) {
  return "₹" + val.toLocaleString("en-IN");
}

export default function CheckoutPage() {
  const { cart, authUser, isAuthenticated, isLoading } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unit = typeof item.accValue === "number" ? item.accValue : 0;
      return sum + unit * item.quantity;
    }, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Delivery Charges: FREE over ₹499, else ₹49
  const FREE_DELIVERY_THRESHOLD = 499;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // 18% GST Calculation
  const gst = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);

  // Grand Total
  const total = subtotal + deliveryFee + gst;

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
                <MapPin className="h-9 w-9 text-primary animate-pulse" />
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
          <Card className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Your checkout cart is empty</CardTitle>
            <p className="text-muted-foreground">Add items to your cart before proceeding to checkout.</p>
            <Button asChild className="rounded-full px-6">
              <Link href="/">Explore Products</Link>
            </Button>
          </Card>
        </div>
      </RoleAccessGate>
    );
  }

  return (
    <RoleAccessGate mode="customer">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/cart">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-sm text-muted-foreground">Review your items, delivery location, and payment details.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Checkout Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Card */}
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Delivery Address</CardTitle>
                </div>
                <Button variant="outline" size="sm" asChild className="rounded-full text-xs">
                  <Link href="/profile">Change Address</Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0 space-y-1 text-sm">
                <p className="font-semibold text-foreground">{authUser?.name}</p>
                <p className="text-muted-foreground">{authUser?.address}</p>
                <p className="text-xs text-muted-foreground pt-1">Phone: {authUser?.number || "Not provided"}</p>
              </CardContent>
            </Card>

            {/* Order Items Review */}
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Items in Order ({itemCount})</span>
                  <Link href="/cart" className="text-xs font-normal text-primary hover:underline">
                    Edit Cart
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 divide-y divide-border">
                {cart.map((item) => {
                  const price = typeof item.accValue === "number" ? item.accValue : 0;
                  return (
                    <div key={item.cartItemId} className="py-3.5 flex items-center gap-4">
                      <div className="h-16 w-16 relative flex-shrink-0 bg-slate-50 border rounded-lg overflow-hidden p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: <span className="font-medium text-foreground">{item.quantity}</span> × {formatINR(price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {formatINR(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Payment Method Options */}
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <label
                  onClick={() => setPaymentMethod("online")}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-semibold text-sm block">Online Payment (UPI, Cards, NetBanking, Wallet)</span>
                    <span className="text-xs text-muted-foreground">
                      Fast, safe & encrypted checkout via online payment gateway.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-semibold text-sm block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-muted-foreground">
                      Pay with cash or UPI when your parcel arrives at your door.
                    </span>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Detailed Order Summary Card */}
          <div>
            <Card className="h-fit shadow-md border-border sticky top-6">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-normal text-muted-foreground bg-background px-2.5 py-1 rounded-full border">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-4">
                {/* Items Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items Subtotal</span>
                  <span className="font-medium text-foreground">{formatINR(subtotal)}</span>
                </div>

                {/* Delivery Fee */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Delivery Charges</span>
                  </div>
                  {isFreeDelivery ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground line-through">₹49</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
                    </div>
                  ) : (
                    <span className="font-medium text-foreground">{formatINR(deliveryFee)}</span>
                  )}
                </div>

                {/* Free Delivery Threshold Info */}
                {!isFreeDelivery && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Add <strong>{formatINR(amountNeededForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong></span>
                  </div>
                )}

                {/* GST & Taxes */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">GST & Taxes (18%)</span>
                  <span className="font-medium text-foreground">{formatINR(gst)}</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-base font-bold text-foreground block">Total Amount</span>
                    <span className="text-[11px] text-muted-foreground">(Inclusive of GST & Delivery)</span>
                  </div>
                  <span className="text-xl font-extrabold text-primary">{formatINR(total)}</span>
                </div>

                {/* Free Delivery Savings Badge */}
                {isFreeDelivery && subtotal > 0 && (
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>You save ₹49 on delivery for this order!</span>
                  </div>
                )}

                {/* Place Order Action */}
                <Button className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all gap-2 mt-2" size="lg">
                  <CreditCard className="h-5 w-5" />
                  Place Order • {formatINR(total)}
                </Button>

                {/* Trust Seals */}
                <div className="space-y-2 pt-3 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>100% Safe & Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>Free doorstep returns within 30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleAccessGate>
  );
}


