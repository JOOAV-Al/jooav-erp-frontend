"use client";

import { useState } from "react";
// import Image from "next/image";
import { useRouter } from "next/navigation";
// import { BellRing, Search } from "lucide-react";
import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import EmptyState from "@/components/general/EmptyState";
// import TableTag from "@/components/general/TableTag";
// import OrderCardSkeleton from "@/features/marketplace/components/OrderCardSkeleton";
import {
  useCreateOutOfStockReport,
  useGetOrders,
} from "@/features/marketplace/services/marketplace.api";
import { Order, OrderItem } from "@/features/marketplace/types";
// import {
//   formatCurrency,
//   getItemStatusStyles,
//   getOrderStatusStyles,
// } from "@/lib/utils";
// import OrderCard from "@/features/marketplace/components/OrderCard";
import OrdersGroupedTable from "@/features/marketplace/components/OrdersGroupedTable";
import SearchBox from "@/components/general/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";

// const formatDateOnly = (dateValue?: string | null) => {
//   if (!dateValue) return "—";

//   const parsedDate = new Date(dateValue);
//   if (Number.isNaN(parsedDate.getTime())) return "—";

//   return format(parsedDate, "dd/MM/yyyy.");
// };

// const buildDeliveryAddress = (order: Order) => {
//   const delivery = order.deliveryAddress;

//   if (!delivery) return "No delivery address provided.";

//   const composedAddress = [
//     delivery.address,
//     delivery.city,
//     delivery.state,
//     "Nigeria",
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return composedAddress || "No delivery address provided.";
// };

// const getProductImage = (item: OrderItem) => {
//   if (item.product?.thumbnail) return item.product.thumbnail;
//   return item.product?.images?.[0] || "/dashboard/empty-state.svg";
// };

export default function InventoryPageComponent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm)
  // const [reorderingOrderNumber, setReorderingOrderNumber] = useState<
  //   string | null
  // >(null);
  // const [reportingItemKeys, setReportingItemKeys] = useState<Set<string>>(
  //   () => new Set(),
  // );
  const { mutateAsync: createOutOfStockReport, isPending: isReporting } = useCreateOutOfStockReport();

  const { data, isPending, refetch } = useGetOrders({
    status: "COMPLETED",
    search: debouncedSearchTerm,
    page: 1,
    limit: 20,
  });
  const orders: Order[] = data?.data?.orders ?? [];

  // const filteredOrders = useMemo(() => {
  //   const allOrders = orders ?? [];
  //   if (!searchTerm.trim()) return allOrders;

  //   const normalized = searchTerm.toLowerCase();

  //   return allOrders.filter((order) => {
  //     const searchableParts = [
  //       order.orderNumber,
  //       order.deliveryAddress?.address,
  //       order.deliveryAddress?.city,
  //       order.deliveryAddress?.state,
  //       ...order.items.map((item) => item.product?.name),
  //     ]
  //       .filter(Boolean)
  //       .join(" ")
  //       .toLowerCase();

  //     return searchableParts.includes(normalized);
  //   });
  // }, [orders, searchTerm]);

  // const handleReportOutOfStock = async (
  //   orderId: string,
  //   orderItemId: string,
  // ) => {
  //   const reportKey = `${orderId}:${orderItemId}`;

  //   if (reportingItemKeys.has(reportKey)) return;

  //   setReportingItemKeys((previous) => {
  //     const updated = new Set(previous);
  //     updated.add(reportKey);
  //     return updated;
  //   });

  //   try {
  //     await createOutOfStockReport({
  //       items: [{ orderId, orderItemId }],
  //     });
  //   } finally {
  //     setReportingItemKeys((previous) => {
  //       const updated = new Set(previous);
  //       updated.delete(reportKey);
  //       return updated;
  //     });
  //   }
  // };

  const handleReportOutOfStock = async (
    orderId: string,
    orderItemId: string,
  ) => {
    await createOutOfStockReport({
      items: [{ orderId, orderItemId }],
    });
  };

  const handleReorder = (order: Order) => {
    if (!order.orderNumber) return;

    // setReorderingOrderNumber(order.orderNumber);
    router.push(
      `/dashboard/checkout?orderNumber=${encodeURIComponent(
        order.orderNumber,
      )}`,
    );
  };

  return (
    <div className="flex flex-col gap-main">
      <div className="border-b border-border-main py-sm gap-main">
        <h3 className="py-5">Inventory</h3>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <SearchBox
            value={searchTerm}
            onChange={(value) => {
              // setPage(1);
              setSearchTerm(value);
            }}
          />
        </div>

        <OrdersGroupedTable
          onReorder={handleReorder}
          onReportOutOfStock={handleReportOutOfStock}
          isReportPending={isReporting}
          orders={orders}
          loading={isPending}
          showActions
          emptyHeader="No completed orders yet"
          emptyDescription="Completed inventory orders will appear here once available."
          refetch={refetch}
        />
      </div>
    </div>
  );
}
