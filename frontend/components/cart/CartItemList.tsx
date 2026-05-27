"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import CartItem from "./CartItem";

export default function CartItemList() {
  const { cart } = useCart();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Cart Items</CardTitle>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Remove items individually
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {cart.map((item, index) => (
          <CartItem
            key={`${item.cartItemId}-${index}`}
            item={item}
            isLast={index === cart.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

