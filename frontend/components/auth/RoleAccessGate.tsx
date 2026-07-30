"use client";

import { useCart } from "@/context/CartContext";
import { getRoleLandingPath, normalizeRole } from "@/lib/role";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import PageSkeletonLoader from "@/components/ui/PageSkeletonLoader";

type GateMode = "customer" | "seller" | "admin" | "guest";

export default function RoleAccessGate({
  mode,
  children,
  fallback = <PageSkeletonLoader />,
}: {
  mode: GateMode;
  children: ReactNode;
  fallback?: React.ReactNode;
}) {
  const { authUser, isLoading } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const role = normalizeRole(authUser?.role);
  const isAuthenticated = Boolean(authUser);

  useEffect(() => {
    if (isLoading) return;

    if (mode === "customer") {
      if (role === "ADMIN" || role === "MANAGER") {
        router.replace(getRoleLandingPath(role));
      }
      return;
    }

    if (mode === "seller") {
      if (role === "MANAGER") return;
      if (isAuthenticated) {
        router.replace(getRoleLandingPath(role));
      } else {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    if (mode === "admin") {
      if (role === "ADMIN") return;
      if (isAuthenticated) {
        router.replace(getRoleLandingPath(role));
      } else {
        router.replace("/");
      }
      return;
    }

    if (mode === "guest" && isAuthenticated) {
      router.replace(getRoleLandingPath(role));
    }
  }, [isAuthenticated, isLoading, mode, pathname, role, router]);

  if (isLoading) {
    return fallback;
  }

  if (mode === "customer" && (role === "ADMIN" || role === "MANAGER")) {
    return fallback;
  }

  if (mode === "seller" && role !== "MANAGER" && role !== "ADMIN") {
    // Optionally allow ADMIN to access seller routes
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-destructive text-4xl mb-4">⛔</div>
        <h2 className="text-2xl font-bold">Seller Access Only</h2>
        <p className="text-muted-foreground mb-6">
          You need an approved seller account to view this page.
        </p>
      </div>
    );
  }

  if (mode === "admin" && role !== "ADMIN") {
    return fallback;
  }

  if (mode === "guest" && isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}
