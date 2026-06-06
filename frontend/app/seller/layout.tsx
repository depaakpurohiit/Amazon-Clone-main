"use client";

import RoleAccessGate from "@/components/auth/RoleAccessGate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SellerDataProvider } from "@/context/SellerDataContext";

const navItems = [
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/add", label: "Add Product" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/business-profile", label: "Business Profile" },
];

function SellerNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
        isActive
          ? "bg-orange-100 text-orange-900"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleAccessGate mode="seller">
      <SellerDataProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <aside className="w-full lg:w-72 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Seller console</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900">Store management</h1>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <SellerNavLink key={item.href} href={item.href} label={item.label} />
                ))}
              </nav>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-500">Need help?</p>
                <p className="mt-2 text-sm text-slate-700">
                  Review orders, publish products, and keep stock up to date from one place.
                </p>
              </div>
            </aside>

            <main className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
              {children}
            </main>
          </div>
        </div>
      </div>
      </SellerDataProvider>
    </RoleAccessGate>
  );
}
