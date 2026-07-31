"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminData } from "@/context/AdminDataContext";
import SellerRequestModal from "@/components/admin/SellerRequestModal";
import { approveSellerRequest, rejectSellerRequest, clearAdminNotifications } from "@/lib/api";

type Metrics = {
  jvmMemUsed: number | null;
  jvmMemMax: number | null;
  threadsLive: number | null;
  cpuSystem: number | null;
  cpuProcess: number | null;
  hikariActive: number | null;
  hikariMax: number | null;
  health: { status: string; db: string; diskFree: number; diskTotal: number } | null;
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(1) + " GB";
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

function pct(value: number | null, max: number | null) {
  if (value == null || !max) return 0;
  return Math.round((value / max) * 100);
}

function StatusDot({ status }: { status: string }) {
  const isUp = status === "UP";
  return (
    <span className={`inline-block h-2.5 w-2.5 rounded-full mr-2 ${isUp ? "bg-green-500" : "bg-red-500"}`} />
  );
}

function MetricBar({ value, max, color = "bg-sky-500" }: { value: number; max: number; color?: string }) {
  const p = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${p}%` }} />
    </div>
  );
}

function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/metrics", { cache: "no-store" });
      if (res.ok) {
        setMetrics(await res.json());
        setLastUpdated(new Date());
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 10000);
    return () => clearInterval(id);
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return <p className="text-sm text-slate-500">Could not load metrics — backend may be unreachable.</p>;
  }

  const { health, jvmMemUsed, jvmMemMax, threadsLive, cpuProcess, hikariActive, hikariMax } = metrics;
  const memPct = pct(jvmMemUsed, jvmMemMax);
  const dbPct = pct(hikariActive, hikariMax);
  const diskUsed = health ? health.diskTotal - health.diskFree : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall Health */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Overall Status</p>
          <p className="mt-2 flex items-center text-lg font-semibold text-slate-900">
            <StatusDot status={health?.status ?? "DOWN"} />
            {health?.status ?? "DOWN"}
          </p>
        </div>

        {/* Database */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Database (H2)</p>
          <p className="mt-2 flex items-center text-lg font-semibold text-slate-900">
            <StatusDot status={health?.db ?? "DOWN"} />
            {health?.db ?? "DOWN"}
          </p>
          <p className="mt-1 text-xs text-slate-500">{hikariActive ?? 0} / {hikariMax ?? 10} connections</p>
          <MetricBar value={hikariActive ?? 0} max={hikariMax ?? 10} color="bg-violet-500" />
        </div>

        {/* JVM Memory */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">JVM Memory</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{jvmMemUsed != null ? formatBytes(jvmMemUsed) : "—"}</p>
          <p className="text-xs text-slate-500">of {jvmMemMax != null ? formatBytes(jvmMemMax) : "—"} ({memPct}%)</p>
          <MetricBar value={memPct} max={100} color={memPct > 80 ? "bg-red-500" : "bg-sky-500"} />
        </div>

        {/* CPU */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Process CPU</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {cpuProcess != null ? (cpuProcess * 100).toFixed(1) + "%" : "—"}
          </p>
          <p className="text-xs text-slate-500">JVM process CPU usage</p>
          <MetricBar value={cpuProcess != null ? cpuProcess * 100 : 0} max={100} color={cpuProcess != null && cpuProcess > 0.8 ? "bg-red-500" : "bg-emerald-500"} />
        </div>

        {/* Threads */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Live Threads</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{threadsLive ?? "—"}</p>
          <p className="text-xs text-slate-500">Active JVM threads</p>
        </div>

        {/* Disk */}
        {health && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Disk Space</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{formatBytes(health.diskFree)} free</p>
            <p className="text-xs text-slate-500">of {formatBytes(health.diskTotal)} total</p>
            <MetricBar value={diskUsed ?? 0} max={health.diskTotal} color="bg-amber-500" />
          </div>
        )}
      </div>

      {lastUpdated && (
        <p className="text-right text-xs text-slate-400">
          Last updated {lastUpdated.toLocaleTimeString()} · auto-refreshes every 10s
        </p>
      )}
    </div>
  );
}


export default function AdminDashboard() {
  const { sellerRequests, notifications, liveUsersCount, isLoading, refreshAll } = useAdminData();
  const [viewingRequest, setViewingRequest] = useState<any>(null);

  const handleClearNotifications = async () => {
    try {
      await clearAdminNotifications();
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            {notifications.length > 0 && (
              <Button size="sm" variant="ghost" onClick={handleClearNotifications}>
                Clear all
              </Button>
            )}
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
          <CardTitle>System Health &amp; Infrastructure Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <SystemMetrics />
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
