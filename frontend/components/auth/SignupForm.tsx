"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { getRoleLandingPath } from "@/lib/role";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupForm({ nextPath, accountType = "customer" }: { nextPath: string; accountType?: "customer" | "seller" }) {
  const { signup, isAuthenticated, authUser, error } = useCart();
  const router = useRouter();
  const sellerLandingPath = "/seller/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(
        accountType === "seller"
          ? sellerLandingPath
          : authUser
            ? getRoleLandingPath(authUser.role)
            : nextPath
      );
    }
  }, [accountType, authUser, isAuthenticated, nextPath, router]);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (number.trim().length !== 10) {
      setLocalError("Phone number must be exactly 10 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signup({
        name: name.trim(),
        number: number.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        accountType,
        role: accountType === "seller" ? "MANAGER" : "USER",
      });
      const landingPath =
        accountType === "seller"
          ? sellerLandingPath
          : getRoleLandingPath(user?.role);
      router.replace(landingPath === "/" ? nextPath : landingPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>{accountType === "seller" ? "Create seller account" : "Create account"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accountType === "seller" ? (
            <p className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
              Seller sign-up creates a seller account and sends you to the seller dashboard after sign in.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={number}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNumber(digits);
                }}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {localError ? (
              <div className="text-sm text-destructive">{localError}</div>
            ) : null}
            {error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="text-primary underline"
              href={`/login?next=${encodeURIComponent(nextPath)}`}
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
