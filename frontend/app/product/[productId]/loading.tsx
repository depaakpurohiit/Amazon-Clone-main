import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <Skeleton className="h-20 w-20 rounded-xl" />
            <Skeleton className="h-20 w-20 rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-5/6" />
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-40 rounded-lg" />

            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}

