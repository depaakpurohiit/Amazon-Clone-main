"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSellerRequests, getAdminNotifications, getLiveUsers } from "@/lib/api";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [live, setLive] = useState<{ count: number; users: string[] }>({ count: 0, users: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [requestData, notificationData, liveData] = await Promise.all([
          getSellerRequests(),
          getAdminNotifications(),
          getLiveUsers(),
        ]);
        setRequests(requestData);
        setNotifs(notificationData);
        setLive(liveData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Oversee seller activity, monitor live users, and moderate marketplace listings.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/sellers">
            <Button variant="outline">Seller management</Button>
          </Link>
          <Link href="/admin/products">
            <Button>Product moderation</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Live users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : live.count}</p>
            <p className="mt-2 text-sm text-slate-600">Users active in the last few minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seller requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : requests.length}</p>
            <p className="mt-2 text-sm text-slate-600">Pending seller approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : notifs.length}</p>
            <p className="mt-2 text-sm text-slate-600">System and workflow events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pending seller requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <p className="text-sm text-slate-600">No pending requests at the moment.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Request from {request.requesterId}</p>
                    <p className="mt-2 text-sm text-slate-600">{request.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : notifs.length === 0 ? (
              <p className="text-sm text-slate-600">No notifications yet.</p>
            ) : (
              <ul className="space-y-3">
                {notifs.slice(0, 4).map((notification) => (
                  <li key={notification.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="font-medium text-slate-900">{notification.type}</div>
                    <div>{notification.payload}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
