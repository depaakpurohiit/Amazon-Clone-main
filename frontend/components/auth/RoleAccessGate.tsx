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
      if (role === "ADMIN" || role === "SELLER") {
        router.replace(getRoleLandingPath(role));
      }
      return;
    }

    if (mode === "seller") {
      if (role === "SELLER") return;
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
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
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

  if (mode === "customer" && (role === "ADMIN" || role === "SELLER")) {
    return fallback;
  }

  if (mode === "seller" && role !== "SELLER") {
    return fallback;
  }

  if (mode === "admin" && role !== "ADMIN") {
    return fallback;
  }

  if (mode === "guest" && isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}
