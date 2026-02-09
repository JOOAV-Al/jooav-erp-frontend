import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsSkeletonProps {
  count?: number;
}

export function StatsSkeleton({ count = 4 }: StatsSkeletonProps) {
  return (
    <div className="flex flex-col mdx:flex-row py-main gap-6 border-b border-[#EDEDED]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`py-main px-xl flex flex-col gap-sm bg-white mdx:max-w-[236px] w-full ${
            i !== count - 1
              ? "border-b mdx:border-b-0 mdx:border-r border-[#EDEDED]"
              : ""
          }`}
        >
          {/* Label skeleton */}
          <Skeleton className="h-3 w-24" />

          {/* Value skeleton */}
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}

export default StatsSkeleton;
