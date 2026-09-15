import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Truck, Headphones, RefreshCw } from "lucide-react";

export const metadata = {
  title: "About Us | Trade Hive",
  description: "Learn more about Trade Hive marketplace, our mission, and our values.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-primary">Trade Hive</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your premier online marketplace connecting buyers with verified sellers. Delivering quality electronics, fashion, mobile devices, and home goods across the nation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-border/60 bg-card text-center p-6">
          <CardContent className="space-y-3 p-0">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Reliable and swift door-to-door delivery on every single order.</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card text-center p-6">
          <CardContent className="space-y-3 p-0">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Verified Sellers</h3>
            <p className="text-sm text-muted-foreground">Every seller undergoes strict vetting and platform review.</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card text-center p-6">
          <CardContent className="space-y-3 p-0">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">Hassle-free 7-day return policy for eligible products.</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card text-center p-6">
          <CardContent className="space-y-3 p-0">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">Dedicated support team to help with any order or inquiry.</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/40 rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed">
          Founded with a passion for seamless commerce, Trade Hive brings together the best brands and authentic retailers under one roof. With real-time order tracking, comprehensive seller verification, and secure transactions, we are redefining modern online shopping.
        </p>
      </div>
    </div>
  );
}
