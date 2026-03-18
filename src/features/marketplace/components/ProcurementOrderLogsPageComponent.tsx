"use client";

import {
  useGetOrders,
  // useGetOrdersStats,
} from "@/features/marketplace/services/marketplace.api";
import { useState, useMemo } from "react";
import { Order, OrderItem } from "@/features/marketplace/types";
// import { useDebounce } from "@/hooks/useDebounce";
// import StatsContainer from "@/components/general/StatsContainer";
// import StatsSkeleton from "@/components/general/StatsSkeleton";
import OrdersGroupedTable from "@/features/marketplace/components/OrdersGroupedTable";
// import SearchBox from "@/components/filters/SearchBox";
import { Button } from "@/components/ui/button";

// Assignment statuses that map to each view
const PENDING_STATUSES = ["PENDING_ACCEPTANCE", "REASSIGNED"] as const;
const PROCESSING_STATUSES = ["ACCEPTED"] as const;

type ActiveView = "pending" | "processing";

const ProcurementOrderLogsPageComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [activeView, setActiveView] = useState<ActiveView>("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );
  const [selectedOrderItem, setSelectedOrderItem] = useState<
    OrderItem | undefined
  >(undefined);

  // const debouncedQuery = useDebounce(query);

  // const { mutateAsync: updateItemStatus, isPending: updatingItem } =
  //   useUpdateOrderItemStatus();
  // const {
  //   mutateAsync: deleteMultipleOrders,
  //   isPending: deletingMultiple,
  //   status,
  // } = useDeleteMultipleOrders();

  // const { data: stats, isPending: isStatsPending } = useGetOrdersStats();
  const {
    data,
    isPending: isOrdersPending,
    isRefetching,
    refetch,
  } = useGetOrders({ page });

  const allOrders: Order[] = data?.data?.orders ?? [];

  // ── Local split by assignmentStatus ───────────────────────────────────────
  const { pendingOrders, processingOrders } = useMemo(() => {
    return {
      pendingOrders: allOrders.filter((o) =>
        PENDING_STATUSES.includes(
          o.assignmentStatus as (typeof PENDING_STATUSES)[number],
        ),
      ),
      processingOrders: allOrders.filter((o) =>
        PROCESSING_STATUSES.includes(
          o.assignmentStatus as (typeof PROCESSING_STATUSES)[number],
        ),
      ),
    };
  }, [allOrders]);

  const activeOrders =
    activeView === "pending" ? pendingOrders : processingOrders;

  // ── Row click handlers ─────────────────────────────────────────────────────
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderItem(undefined);
  };

  const handleOrderItemClick = (item: OrderItem, order: Order) => {
    setSelectedOrderItem(item);
    setSelectedOrder(order);
  };

  // ── View switch — reset page so pagination stays correct ──────────────────
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    setPage(1);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  // const displayStats = [
  //   { value: `${stats?.totalOrders ?? 0}`, label: "Completed" },
  //   { value: `${stats?.summary?.activeOrders ?? 0}`, label: "Pending" },
  //   { value: `${stats?.summary?.completedOrders ?? 0}`, label: "Processing" },
  // ];

  return (
    <div className="flex flex-col gap-5 pb-main">
      {/* {isStatsPending ? (
        <StatsSkeleton count={5} />
      ) : (
        <StatsContainer stats={displayStats} />
      )} */}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          {/* View toggle buttons */}
          <div className="flex items-center">
            <div onClick={() => handleViewChange("pending")} className="p-main cursor-pointer">
              <h4
                className={`${activeView === "pending" ? "" : "text-body-passive"}`}
              >
                Pending
              </h4>
            </div>
            <div
              onClick={() => handleViewChange("processing")}
              className="p-main cursor-pointer"
            >
              <h4
                className={`${activeView === "processing" ? "" : "text-body-passive"}`}
              >
                Processing
              </h4>
            </div>
          </div>

          {/* Search — filters the API call; results are then split locally */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            /> */}

            {/* "Accept all" only makes sense in the pending view */}
            {activeView === "pending" && pendingOrders.length > 0 && (
              <Button size={"neutral"} className="">
                Accept all
              </Button>
            )}
          </div>
        </div>

        <OrdersGroupedTable
          key={activeView}
          orders={activeOrders}
          loading={isOrdersPending || isRefetching}
          onOrderClick={handleOrderClick}
          onOrderItemClick={handleOrderItemClick}
          // onDelete={(rows) =>
          //   deleteMultipleOrders({ orderIds: rows.map((o) => o.id) })
          // }
          
          // actionLoading={updatingItem}
          showActions
          // deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          emptyHeader={"No order summaries"}
          emptyDescription={
            "You will see a summary of recent orders here once order are initiated.  "
          }
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ProcurementOrderLogsPageComponent;
