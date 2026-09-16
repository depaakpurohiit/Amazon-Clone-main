"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { getRoleLandingPath } from "@/lib/role";
import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const { login, isAuthenticated, authUser, error: cartError } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(authUser ? getRoleLandingPath(authUser.role) : nextPath);
    }
  }, [authUser, isAuthenticated, nextPath, router]);

  const displayError = localError || cartError;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError("Please enter your email or username.");
      return;
    }
    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email.trim().toLowerCase(), password);
      router.replace(getRoleLandingPath(user?.role));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password. Please try again.";
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setLocalError(null);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Card className="shadow-xl border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
          <CardDescription>
            Enter your account credentials to access Trade Hive.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Incorrect Password / Error Alert Banner */}
          {displayError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-900 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in slide-in-from-top-2 duration-200 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-red-800 dark:text-red-200">
                  Authentication Failed
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                  {displayError.toLowerCase().includes("invalid") || displayError.toLowerCase().includes("password")
                    ? "Incorrect email or password. Please check your spelling and try again."
                    : displayError}
                </p>
              </div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email or Username
              </label>
              <Input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(null);
                }}
                placeholder="name@example.com"
                className={`h-11 ${displayError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  placeholder="Enter your password"
                  className={`h-11 pr-10 ${displayError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-md gap-2 mt-2"
              disabled={isSubmitting}
            >
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Accounts Quick-fill Helper */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Quick Test Accounts:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("seller1@example.com", "seller123")}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors"
              >
                Seller (seller1@example.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("mainadmin@@1212", "adminadmin@@")}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors"
              >
                Admin (mainadmin@@1212)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border gap-2">
            <span>Don&apos;t have an account?</span>
            <div className="flex items-center gap-3">
              <Link
                className="text-primary font-semibold hover:underline"
                href={`/signup?next=${encodeURIComponent(nextPath)}`}
              >
                Sign up
              </Link>
              <span>•</span>
              <Link
                className="text-primary font-semibold hover:underline"
                href="/seller/add"
              >
                Sell on Trade Hive
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
