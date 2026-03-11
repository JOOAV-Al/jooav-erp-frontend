import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-storey-foreground overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-xl" />
      {/* Text placeholders */}
      <div className="px-4 pt-2 pb-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-1" />
      </div>
    </div>
  );
}
