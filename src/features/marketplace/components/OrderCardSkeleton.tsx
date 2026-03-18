import React from "react";

const OrderCardSkeleton = ({ itemCount = 2, loading }: { itemCount?: number, loading?: boolean }) => {
  // if (loading) {
  //     return (
  //       <div className="flex flex-col gap-main">
  //         {[1, 2, 3].map((_, i) => (
  //           <OrderCardSkeleton key={i} itemCount={i === 1 ? 3 : 1} />
  //         ))}
  //       </div>
  //     );
  //   }
  return (
    <div className="rounded-3xl border-2 border-border-main overflow-hidden animate-pulse bg-white">
      <div className="grid grid-cols-4 gap-2 px-6 py-5 border-b-2 border-border-main">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-2.5 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      {Array.from({ length: itemCount }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 px-6 py-4 ${i < itemCount - 1 ? "border-b border-border-main" : ""}`}
        >
          <div className="w-4 h-4 rounded bg-gray-100" />
          <div className="w-[65px] h-[65px] rounded-lg bg-gray-200" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-72 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
      <div className="flex justify-end px-6 py-3 border-t-2 border-border-main">
        <div className="h-6 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
