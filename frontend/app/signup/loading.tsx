import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-orange-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-56" />
          <Skeleton className="mx-auto h-5 w-80" />
        </div>

        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

