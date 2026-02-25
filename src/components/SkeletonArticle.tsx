import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonFeatured = () => (
  <div className="py-10">
    <div className="container">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-12 w-3/4 mb-2" />
      <Skeleton className="h-12 w-1/2 mb-4" />
      <Skeleton className="h-64 w-full mb-4" />
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-4" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  </div>
);

export const SkeletonArticleItem = () => (
  <div className="grid md:grid-cols-[1fr_200px] gap-4">
    <div>
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <Skeleton className="h-32 w-full rounded-none" />
  </div>
);

export const SkeletonArticleList = ({ count = 5 }: { count?: number }) => (
  <section className="py-6">
    <div className="container">
      <Skeleton className="h-3 w-16 mb-6" />
      <div className="space-y-0">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            {i > 0 && <div className="h-px bg-muted my-6" />}
            <SkeletonArticleItem />
          </div>
        ))}
      </div>
    </div>
  </section>
);
