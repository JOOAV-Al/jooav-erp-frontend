"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetOrders } from "@/features/marketplace/services/marketplace.api";
import { Order } from "@/features/marketplace/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersGroupedTable from "@/features/marketplace/components/OrdersGroupedTable";
import SearchBox from "@/components/general/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

type TabType = "PENDING" | "PROCESSING" | "FULFILLED" | "PENDING_PAYMENT";

export default function OrderProcessingContent() {
  const searchParams = useSearchParams();
  const autoTab = searchParams?.get("tab");
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>(
    autoTab === "incomplete" ? "PENDING_PAYMENT" : "PENDING",
  );
  const debouncedQuery = useDebounce(query);
  const router = useRouter();

  const { data, isPending, refetch } = useGetOrders({
    page: page,
    limit: 100,
    search: debouncedQuery,
  });

  const allOrders = data?.data?.orders as Order[] | undefined;

  const filteredOrders = useMemo(() => {
    const availableOrders = allOrders ?? [];

    return availableOrders.filter((order: Order) => {
      // Always exclude empty draft orders — these are leftover cart artifacts
      if (
        order.status === "DRAFT" ||
        !order.items ||
        order.items.length === 0
      ) {
        return false;
      }
      const status = order.status;
      // const assignmentStatus = order.assignmentStatus;
      if (activeTab === "PENDING") {
        return ["CONFIRMED"].includes(status);
      }
      if (activeTab === "PROCESSING") {
        return ["IN_PROGRESS"].includes(status);
      }
      if (activeTab === "PENDING_PAYMENT") {
        return ["PENDING_PAYMENT"].includes(status);
      }
      if (activeTab === "FULFILLED") {
        return ["COMPLETED"].includes(status);
      }
      return false;
    });
  }, [allOrders, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  const handleInitiatePayment = (orderNumber: string) => {
    if (!orderNumber) return;
    router.push(`/dashboard/checkout?orderNumber=${orderNumber}`);
  };

  // useEffect(() => {
  //   if (!autoTab) return;
  //   if (autoTab === "incomplete") {
  //     console.log("running")
  //     setActiveTab("PENDING_PAYMENT");
  //   }
  // }, [autoTab]);
  console.log(autoTab)

  const tabTriggerClass =
    "p-main! bg-transparent! data-[state=active]:bg-transparent! shadow-none! data-[state=active]:shadow-none! border-none! rounded-none! font-semibold text-body-passive data-[state=active]:text-heading text-base leading-[1.2] tracking-[0.01em] hover:bg-transparent!";

  return (
    <div className="flex flex-col gap-main">
      <div className="border-b border-border-main py-sm gap-main">
        <h3 className="py-5">Order processing</h3>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex flex-row items-center justify-between flex-wrap gap-x-5 gap-y-main min-h-15">
          <TabsList className="h-auto! p-0! bg-transparent! border-none! w-fit flex flex-wrap">
            <TabsTrigger value="PENDING" className={tabTriggerClass}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="PROCESSING" className={tabTriggerClass}>
              Processing
            </TabsTrigger>
            <TabsTrigger value="FULFILLED" className={tabTriggerClass}>
              Fulfilled
            </TabsTrigger>
            <TabsTrigger value="PENDING_PAYMENT" className={tabTriggerClass}>
              Initiated payment
            </TabsTrigger>
          </TabsList>
          <SearchBox
            value={query}
            onChange={(value) => {
              setPage(1);
              setQuery(value);
            }}
          />
        </div>

        {/* With order card */}
        <OrdersGroupedTable
          orders={filteredOrders}
          loading={isPending}
          showActions
          emptyHeader="No orders yet"
          emptyDescription="No order records yet. Orders will appear here once placed."
          refetch={refetch}
          onReorder={(order) => handleInitiatePayment(order?.orderNumber)}
        />
      </Tabs>
    </div>
  );
}
