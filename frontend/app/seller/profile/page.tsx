"use client";

import RoleAccessGate from "@/components/auth/RoleAccessGate";
import ProfileForm from "@/components/profile/ProfileForm";

export default function SellerProfilePage() {
  return (
    <RoleAccessGate mode="seller">
      <ProfileForm />
    </RoleAccessGate>
  );
}
