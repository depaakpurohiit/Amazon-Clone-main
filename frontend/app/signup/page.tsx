import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }> | { next?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const nextPath = resolvedSearchParams?.next ?? "/";
  return <SignupForm nextPath={nextPath} />;
}
