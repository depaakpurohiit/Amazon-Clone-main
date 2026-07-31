"use client";

import RoleAccessGate from "@/components/auth/RoleAccessGate";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useSellerData, SellerDataProvider } from "@/context/SellerDataContext";

const navItems = [
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/add", label: "Add Product" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/business-profile", label: "Business Profile" },
];

function SellerNavLink({ href, label, disabled }: { href: string; label: string; disabled?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={disabled ? "#" : href}
      className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
        disabled
          ? "text-slate-400 cursor-not-allowed"
          : isActive
          ? "bg-orange-100 text-orange-900"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

function SellerLayoutInner({ children }: { children: ReactNode }) {
  const { profile, isLoading } = useSellerData();
  const pathname = usePathname();
  const router = useRouter();
  
  const needsProfile = !isLoading && (!profile || !profile.id);
  const isProfilePage = pathname === "/seller/business-profile";

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {needsProfile && !isProfilePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Welcome to Seller Center</h2>
            <p className="mt-3 text-slate-600">
              Before you can list products, you need to create your Business Profile. This will be sent to the admin for approval.
            </p>
            <button
              onClick={() => router.push("/seller/business-profile")}
              className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Create Business Profile
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full lg:w-72 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm relative z-10">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Seller console</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">Store management</h1>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <SellerNavLink key={item.href} href={item.href} label={item.label} disabled={needsProfile && item.href !== "/seller/business-profile"} />
              ))}
            </nav>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">Need help?</p>
              <p className="mt-2 text-sm text-slate-700">
                Review orders, publish products, and keep stock up to date from one place.
              </p>
            </div>
          </aside>

          <main className="flex-1 rounded-3xl bg-white p-6 shadow-sm relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleAccessGate mode="seller">
      <SellerDataProvider>
        <SellerLayoutInner>{children}</SellerLayoutInner>
      </SellerDataProvider>
    </RoleAccessGate>
  );
}
