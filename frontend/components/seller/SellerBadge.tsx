"use client";

import Link from "next/link";
import Image from "next/image";

export default function SellerBadge({ sellerId, sellerName, logoUrl }: { sellerId?: string; sellerName?: string; logoUrl?: string; }) {
  if (!sellerId) return null;

  return (
    <Link href={`/seller/${sellerId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
        {logoUrl ? (
          <Image src={logoUrl} alt={sellerName || "seller"} width={32} height={32} className="object-cover" />
        ) : (
          <span className="text-xs font-bold">{(sellerName || "S").slice(0,1)}</span>
        )}
      </div>
      <span className="font-medium text-sm">{sellerName || "Seller"}</span>
    </Link>
  );
}
