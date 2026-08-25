"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { getRoleLandingPath } from "@/lib/role";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupForm({
  nextPath,
  accountType = "customer",
}: {
  nextPath: string;
  accountType?: "customer" | "seller";
}) {
  const { sendSignupOtp, verifySignupOtp, isAuthenticated, authUser, error: cartError } = useCart();
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

  // Form State
  const [step, setStep] = useState<"DETAILS" | "OTP">("DETAILS");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend Timer State
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "OTP" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Step 1: Send OTP
  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }
    if (number.trim().length !== 10) {
      setLocalError("Phone number must be exactly 10 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendSignupOtp({
        name: name.trim(),
        number: number.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        accountType,
        role: accountType === "seller" ? "MANAGER" : "USER",
      });
      setStep("OTP");
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage(`A 6-digit verification code has been sent to ${email.trim().toLowerCase()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification code.";
      if (msg.toLowerCase().includes("email already") || msg.toLowerCase().includes("email")) {
        setLocalError("An account with this email already exists. Please sign in instead.");
      } else if (msg.toLowerCase().includes("number already") || msg.toLowerCase().includes("number")) {
        setLocalError("This phone number is already registered. Please use a different number.");
      } else {
        setLocalError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const onResendOtp = async () => {
    if (!canResend || isSubmitting) return;
    setLocalError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await sendSignupOtp({
        name: name.trim(),
        number: number.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        accountType,
        role: accountType === "seller" ? "MANAGER" : "USER",
      });
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage(`New code sent to ${email.trim().toLowerCase()}`);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Failed to resend verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP & Finalize Registration
  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const trimmedOtp = otp.trim();
    if (trimmedOtp.length !== 6) {
      setLocalError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await verifySignupOtp({
        email: email.trim().toLowerCase(),
        otp: trimmedOtp,
      });
      const landingPath =
        accountType === "seller"
          ? sellerLandingPath
          : getRoleLandingPath(user?.role);
      router.replace(landingPath === "/" ? nextPath : landingPath);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <Card className="shadow-lg border-border">
        <CardHeader>
          {step === "DETAILS" ? (
            <>
              <CardTitle className="text-2xl font-bold">
                {accountType === "seller" ? "Create seller account" : "Create account"}
              </CardTitle>
              <CardDescription>
                Join Trade Hive to start {accountType === "seller" ? "selling your products" : "shopping today"}.
              </CardDescription>
            </>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full -ml-2"
                  onClick={() => {
                    setStep("DETAILS");
                    setLocalError(null);
                    setSuccessMessage(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
              </div>
              <CardDescription>
                Enter the 6-digit OTP code sent to{" "}
                <span className="font-semibold text-foreground">{email}</span>
              </CardDescription>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {accountType === "seller" && step === "DETAILS" ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
              Seller sign-up creates a seller account and takes you to the seller dashboard after verification.
            </p>
          ) : null}

          {/* STEP 1: Registration Details */}
          {step === "DETAILS" ? (
            <form onSubmit={onSendOtp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="e.g. Aman Sayed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Mobile Number</label>
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
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {localError ? (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                  {localError}
                </div>
              ) : null}

              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md gap-2" disabled={isSubmitting}>
                <Mail className="h-4 w-4" />
                {isSubmitting ? "Sending verification code..." : "Verify Email & Continue"}
              </Button>
            </form>
          ) : (
            /* STEP 2: OTP Verification */
            <form onSubmit={onVerifyOtp} className="space-y-4">
              {successMessage ? (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              ) : null}

              <div className="space-y-2 text-center py-2">
                <label className="text-sm font-medium text-foreground block">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(digits);
                    }}
                    className="text-center font-mono text-2xl tracking-[0.5em] h-14 max-w-[240px] font-bold border-2 focus-visible:ring-primary"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Code expires in 10 minutes</p>
              </div>

              {localError ? (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                  {localError}
                </div>
              ) : null}

              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md gap-2" disabled={isSubmitting || otp.length !== 6}>
                <KeyRound className="h-4 w-4" />
                {isSubmitting ? "Verifying code..." : "Confirm & Create Account"}
              </Button>

              <div className="flex items-center justify-between text-xs pt-2 border-t text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setStep("DETAILS");
                    setLocalError(null);
                    setSuccessMessage(null);
                  }}
                  className="hover:underline text-primary"
                >
                  Edit email or details
                </button>

                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={onResendOtp}
                      disabled={isSubmitting}
                      className="font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Resend Code
                    </button>
                  ) : (
                    <span>Resend code in <strong className="text-foreground">{countdown}s</strong></span>
                  )}
                </div>
              </div>
            </form>
          )}

          {step === "DETAILS" && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              Already have an account?{" "}
              <Link
                className="text-primary font-semibold underline"
                href={`/login?next=${encodeURIComponent(nextPath)}`}
              >
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
