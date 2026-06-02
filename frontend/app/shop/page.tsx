import RoleAccessGate from "@/components/auth/RoleAccessGate";
import ProductList from "@/components/home/ProductList";

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.q;

  return (
    <RoleAccessGate mode="customer">
      <div className="bg-background px-4 py-8 sm:py-12 lg:py-16 lg:px-8 min-h-screen">
        <div className="text-center mx-auto mb-18 space-y-3">
          <h1 className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] xl:text-5xl xl:tracking-tighter">
            Shop
          </h1>
          <p className="text-foreground text-base max-w-3xl mx-auto text-balance sm:text-lg">
            Browse all products.
          </p>
        </div>
        <ProductList query={query} />
      </div>
    </RoleAccessGate>
  );
}

