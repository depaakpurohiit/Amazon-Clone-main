"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/seller/dashboard");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-sm text-slate-600">Redirecting to seller dashboard…</p>
      </div>
    </div>
  );
}
