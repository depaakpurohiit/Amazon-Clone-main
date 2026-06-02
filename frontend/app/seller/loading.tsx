import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full lg:w-72 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
            </div>
          </aside>

          <main className="flex-1 rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-11 w-32 rounded-xl" />
                <Skeleton className="h-11 w-40 rounded-xl" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <Skeleton className="h-6 w-36" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-full rounded-2xl" />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

