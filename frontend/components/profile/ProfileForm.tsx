"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { LogOut, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { requestSeller } from "@/lib/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LogoutLoader from "@/components/ui/LogoutLoader";
import { useState } from "react";

export default function ProfileForm() {
  const { authUser, isAuthenticated, isLoading, logout } = useCart();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-lg">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = async () => {
    setShowConfirm(false);
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      router.replace("/login");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Section */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Full Name
                </label>
                <div className="text-2xl font-bold text-foreground">
                  {authUser.name}
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="text-foreground font-medium break-all">
                    {authUser.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="text-foreground font-medium">
                    {authUser.number}
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* User ID */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  User ID
                </label>
                <div className="text-foreground font-mono text-sm bg-muted p-3 rounded-lg break-all">
                  {authUser._id}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Statistics and Actions */}
        <div className="space-y-6">
          {/* View Favorites Button */}
          <Button
            asChild
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            <Link href="/favorites" className="flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 fill-current" />
              View Favorites
            </Link>
          </Button>

          {/* Account Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-25 p-4 border border-orange-200">
                <div className="text-sm text-muted-foreground font-medium">
                  Total Orders
                </div>
                <div className="text-3xl font-bold text-orange-600 mt-2">
                  {authUser.orders?.length || 0}
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-25 p-4 border border-blue-200">
                <div className="text-sm text-muted-foreground font-medium">
                  Cart Items
                </div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {authUser.cart?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {authUser.role === "SELLER" && authUser.sellerApproved === false ? (
                <Button onClick={async () => {
                  try {
                    await requestSeller({ message: "Request for admin verification" });
                    alert("Verification request sent to admin.");
                  } catch {
                    alert("Failed to send verification request.");
                  }
                }} className="w-full">Request Admin Verification</Button>
              ) : authUser.role === "CUSTOMER" ? (
                <Button onClick={async () => {
                  try {
                    await requestSeller({ message: "Request to become seller" });
                    alert("Seller request sent — admin will review it.");
                  } catch {
                    alert("Failed to send seller request.");
                  }
                }} className="w-full">Request to Become Seller</Button>
              ) : null}
              <Button asChild className="w-full" variant="outline">
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button
                onClick={handleLogout}
                className="w-full mt-4"
                variant="destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
      <ConfirmDialog
      open={showConfirm}
      title="Are you sure you want to log out?"
      description="You will be signed out of your account."
      confirmLabel="Log out"
      cancelLabel="Cancel"
      onConfirm={confirmLogout}
      onCancel={() => setShowConfirm(false)}
    />
    {isLoggingOut && <LogoutLoader message="Logging out…" />}
    </>
  );
}
