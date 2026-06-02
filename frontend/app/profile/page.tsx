import RoleAccessGate from "@/components/auth/RoleAccessGate";
import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <RoleAccessGate mode="customer">
      <ProfileForm />
    </RoleAccessGate>
  );
}

