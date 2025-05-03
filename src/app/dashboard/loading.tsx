import { Skeleton } from "@/components/ui/skeleton";

export default function FileExplorerSkeleton() {
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {skeletonItems.map((item) => (
            <div key={item} className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
