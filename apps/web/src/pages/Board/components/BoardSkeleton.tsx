import { Skeleton } from '@/components/ui/skeleton';

export function BoardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-60" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Columns Skeleton Grid */}
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        {[0, 1, 2].map((colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col w-full md:w-80 lg:w-96 shrink-0 bg-muted/20 border border-border/70 rounded-2xl p-4 space-y-4 min-h-[500px]"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="size-7 rounded-md" />
            </div>

            <div className="space-y-3">
              {[0, 1, 2].map((cardIdx) => (
                <div
                  key={cardIdx}
                  className="bg-card border border-border p-4 rounded-xl space-y-3"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
