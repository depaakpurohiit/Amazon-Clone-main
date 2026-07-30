"use client";

import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { clearAdminNotifications } from "@/lib/api";

export default function AdminNotificationsPage() {
  const { notifications, isLoading, refreshAll } = useAdminData();

  const handleClearNotifications = async () => {
    try {
      await clearAdminNotifications();
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="mt-2 text-sm text-slate-600">View system notifications generated for the admin console.</p>
        </div>
        {notifications.length > 0 && (
          <Button onClick={handleClearNotifications} variant="outline">
            Clear all
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-20 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No notifications available.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{notification.type}</p>
              <p className="mt-2 text-sm text-slate-600">{notification.payload}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
