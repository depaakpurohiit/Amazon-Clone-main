import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 space-y-5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        <div className="h-fit rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

