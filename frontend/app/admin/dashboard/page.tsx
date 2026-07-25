"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminData } from "@/context/AdminDataContext";
import SellerRequestModal from "@/components/admin/SellerRequestModal";
import { approveSellerRequest, rejectSellerRequest } from "@/lib/api";

export default function AdminDashboard() {
  const { sellerRequests, notifications, liveUsersCount, isLoading, refreshAll } = useAdminData();
  const [viewingRequest, setViewingRequest] = useState<any>(null);

  const handleApproveRequest = async (id: string) => {
    try {
      await approveSellerRequest(id);
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await rejectSellerRequest(id);
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

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
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : liveUsersCount}</p>
            <p className="mt-2 text-sm text-slate-600">Users active in the last few minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seller requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : sellerRequests.length}</p>
            <p className="mt-2 text-sm text-slate-600">Pending seller approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{isLoading ? "—" : notifications.length}</p>
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
                  <div key={idx} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : sellerRequests.length === 0 ? (
              <p className="text-sm text-slate-600">No pending requests at the moment.</p>
            ) : (
              <div className="space-y-4">
                {sellerRequests.map((request) => (
                  <div key={request.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Request from {request.requesterName || request.requesterId}</p>
                    <p className="mt-1 text-sm text-slate-600 truncate">{request.message}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewingRequest(request)}>
                        View Business Profile
                      </Button>
                      <Button size="sm" onClick={() => handleApproveRequest(request.id)} className="bg-green-600 hover:bg-green-700">
                        Yes (Approve)
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(request.id)}>
                        No (Reject)
                      </Button>
                    </div>
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
            ) : notifications.length === 0 ? (
              <p className="text-sm text-slate-600">No notifications yet.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
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

      <Card>
        <CardHeader>
          <CardTitle>System Health & Infrastructure Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src="/sba"
            className="w-full h-[800px] border-0 rounded-b-xl"
            title="Spring Boot Admin Dashboard"
          />
        </CardContent>
      </Card>
      
      {viewingRequest && (
        <SellerRequestModal 
          isOpen={true} 
          onClose={() => setViewingRequest(null)} 
          request={viewingRequest} 
        />
      )}
    </div>
  );
}
