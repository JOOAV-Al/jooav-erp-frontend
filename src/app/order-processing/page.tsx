"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/features/marketplace/components/OrderCard";
import {
  useConfirmOrderPayment,
  useGetOrders,
} from "@/features/marketplace/services/marketplace.api";
import { Order } from "@/features/marketplace/types";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/general/EmptyState";

type TabType = "PENDING" | "PROCESSING" | "FULFILLED";

const OrderProcessingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentReference = searchParams.get("paymentReference");
  const hasVerifiedRef = useRef<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifyingPayment, setIsVerifyingPayment] =
    useState(!!paymentReference);
  const [verificationMessage, setVerificationMessage] = useState(
    "Verifying payment...",
  );
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);

  const { data, isLoading, refetch } = useGetOrders({
    page: 1,
    limit: 100, // Fetch more for client-side filtering
    search: searchQuery,
  });
  const { mutateAsync: confirmPayment } = useConfirmOrderPayment();

  const allOrders = data?.data?.orders as Order[] | undefined;

  useEffect(() => {
    if (!paymentReference) return;

    if (hasVerifiedRef.current === paymentReference) return;
    hasVerifiedRef.current = paymentReference;

    let isMounted = true;

    const verifyAndRefresh = async () => {
      setIsVerifyingPayment(true);
      setVerificationMessage("Verifying payment...");

      try {
        await confirmPayment({ orderNumber: paymentReference });
        if (!isMounted) return;

        setVerificationMessage("Payment verified. Refreshing orders...");
      } catch {
        if (!isMounted) return;
        setVerificationMessage(
          "Could not verify payment. Refreshing orders...",
        );
      }

      if (!isMounted) return;

      setIsRefreshingOrders(true);
      await refetch();

      if (!isMounted) return;

      setIsRefreshingOrders(false);
      setIsVerifyingPayment(false);
      router.replace("/order-processing");
    };

    verifyAndRefresh();

    return () => {
      isMounted = false;
    };
  }, [confirmPayment, paymentReference, refetch, router]);

  // Client-side filtering to group statuses under tabs
  const filteredOrders = useMemo(() => {
    const availableOrders = allOrders ?? [];

    return availableOrders.filter((order: Order) => {
      const status = order.status;
      if (activeTab === "PENDING") {
        return ["CONFIRMED", "PENDING_PAYMENT"].includes(status);
      }
      if (activeTab === "PROCESSING") {
        return ["IN_PROGRESS", "ASSIGNED"].includes(status);
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

  const tabTriggerClass =
    "p-0! h-auto! bg-transparent! data-[state=active]:bg-transparent! shadow-none! data-[state=active]:shadow-none! border-none! rounded-none! font-normal text-body-passive data-[state=active]:text-heading data-[state=active]:font-bold text-base hover:bg-transparent!";

  return (
    <div className="flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 max-w-app mx-auto min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-blue-800">Order processing</h2>
      </div>

      <Tabs
        defaultValue="PENDING"
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex flex-col mdx:flex-row mdx:items-center justify-between gap-6">
          <TabsList className="h-auto! p-0! bg-transparent! border-none! gap-8 flex flex-wrap">
            <TabsTrigger value="PENDING" className={tabTriggerClass}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="PROCESSING" className={tabTriggerClass}>
              Processing
            </TabsTrigger>
            <TabsTrigger value="FULFILLED" className={tabTriggerClass}>
              Fulfilled
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 w-full mdx:max-w-md">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} className="text-body-passive" />}
              className="h-10 bg-white min-w-[200px]"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          {isLoading || isVerifyingPayment || isRefreshingOrders ? (
            <div className="flex justify-center py-20">
              <div className="flex items-center gap-4">
                <Spinner />
                {(isVerifyingPayment || isRefreshingOrders) && (
                  <span className="text-sm text-body-passive">
                    {verificationMessage}
                  </span>
                )}
              </div>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order: Order) => (
              <OrderCard
                key={order.id}
                order={order}
                showStatus={true}
                showItemStatus={true}
                withCheckbox={false}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white">
              <EmptyState
                header="No orders found"
                description="There are currently no orders in this category."
              />
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default OrderProcessingPage;
