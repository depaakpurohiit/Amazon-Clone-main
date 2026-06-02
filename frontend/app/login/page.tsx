import RoleAccessGate from "@/components/auth/RoleAccessGate";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }> | { next?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const nextPath = resolvedSearchParams?.next ?? "/";
  return (
    <RoleAccessGate mode="guest">
      <LoginForm nextPath={nextPath} />
    </RoleAccessGate>
  );
}

