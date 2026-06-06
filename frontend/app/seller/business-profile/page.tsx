"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSellerProfile, SellerProfileDTO, updateSellerProfile } from "@/lib/api";
import { useSellerData } from "@/context/SellerDataContext";

export default function SellerBusinessProfilePage() {
  const { profile, isLoading, refreshProfile } = useSellerData();
  const [localProfile, setLocalProfile] = useState<SellerProfileDTO>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<SellerProfileDTO>({});

  useEffect(() => {
    // initialize local copies from context
    setLocalProfile(profile ?? {});
    setEditForm(profile ?? {});
    if (!profile || !profile.id) setIsEditing(true);
  }, [profile]);

  const handleChange = (key: keyof SellerProfileDTO, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const saved = await updateSellerProfile(editForm);
      // refresh context profile so other seller pages see updated data
      await refreshProfile();
      setLocalProfile(saved ?? editForm);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setEditForm(localProfile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm(localProfile);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Business profile</h1>
        <p className="mt-2 text-sm text-slate-600">Keep your storefront identity and seller bio up to date.</p>
      </div>

      {!isEditing && !isLoading && localProfile.id ? (
        // View Mode
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-700">Store name</p>
              <p className="mt-2 text-lg text-slate-900">{localProfile.businessName || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Logo URL</p>
              <p className="mt-2 text-sm text-slate-600 break-all">{localProfile.logoUrl || "—"}</p>
              {localProfile.logoUrl && (
                <img src={localProfile.logoUrl} alt="Store logo" className="mt-2 h-12 w-12 rounded" onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Store status</p>
              <p className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{localProfile.status || "—"}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-700">Seller bio</p>
              <p className="mt-2 text-slate-600 whitespace-pre-wrap">{localProfile.bio || "—"}</p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={handleEdit}>Edit profile</Button>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700">Store name</label>
              <input
                value={editForm.businessName ?? ""}
                onChange={(e) => handleChange("businessName", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Logo URL</label>
              <input
                value={editForm.logoUrl ?? ""}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Store status</label>
              <input
                value={editForm.status ?? ""}
                disabled
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700">Seller bio</label>
              <textarea
                value={editForm.bio ?? ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={8}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
              {isEditing && localProfile.id && (
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving || isLoading}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSaving || isLoading}>
                {isSaving ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
