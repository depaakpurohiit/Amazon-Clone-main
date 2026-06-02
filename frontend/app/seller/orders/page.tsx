"use client";

import { useEffect, useState } from "react";
import { getSellerOrders } from "@/lib/api";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-slate-600">Track recent orders that include products from your store.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-24 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No recent orders yet. When buyers purchase your products, orders will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-slate-500">Order ID</div>
                  <div className="text-base font-semibold text-slate-900">{order.id}</div>
                  <div className="text-sm text-slate-600">Buyer: {order.buyerName ?? order.buyerId ?? "Unknown"}</div>
                </div>
                <div className="space-y-1 text-right text-sm">
                  <div>{new Date(order.dateOrdered).toLocaleString()}</div>
                  <div className={`font-semibold ${order.isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </div>
                  <div className="text-slate-700">Seller total: {order.sellerTotal ?? "—"}</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-700">Items</div>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {(order.items ?? []).map((item: any) => (
                    <li key={item.productId} className="flex items-center justify-between gap-4">
                      <span>{item.productName}</span>
                      <span className="text-slate-500">{item.qty} × {item.priceAtTime}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
