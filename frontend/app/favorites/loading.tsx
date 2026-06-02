import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-xl border border-border bg-card">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

