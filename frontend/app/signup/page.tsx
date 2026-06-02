import RoleAccessGate from "@/components/auth/RoleAccessGate";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ next?: string; accountType?: string }>
    | { next?: string; accountType?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const accountType =
    resolvedSearchParams?.accountType === "seller" ? "seller" : "customer";
  const nextPath =
    accountType === "seller"
      ? "/seller/dashboard"
      : resolvedSearchParams?.next ?? "/";
  return (
    <RoleAccessGate mode="guest">
      <div className="min-h-screen bg-orange-50">
        <SignupForm nextPath={nextPath} accountType={accountType} />
      </div>
    </RoleAccessGate>
  );
}
