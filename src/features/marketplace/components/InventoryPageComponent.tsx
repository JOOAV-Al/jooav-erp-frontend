"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BellRing, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/general/EmptyState";
import TableTag from "@/components/general/TableTag";
import OrderCardSkeleton from "@/features/marketplace/components/OrderCardSkeleton";
import {
  useCreateOutOfStockReport,
  useGetOrders,
} from "@/features/marketplace/services/marketplace.api";
import { Order, OrderItem } from "@/features/marketplace/types";
import {
  formatCurrency,
  getItemStatusStyles,
  getOrderStatusStyles,
} from "@/lib/utils";

const formatDateOnly = (dateValue?: string | null) => {
  if (!dateValue) return "—";

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return format(parsedDate, "dd/MM/yyyy.");
};

const buildDeliveryAddress = (order: Order) => {
  const delivery = order.deliveryAddress;

  if (!delivery) return "No delivery address provided.";

  const composedAddress = [
    delivery.address,
    delivery.city,
    delivery.state,
    "Nigeria",
  ]
    .filter(Boolean)
    .join(", ");

  return composedAddress || "No delivery address provided.";
};

const getProductImage = (item: OrderItem) => {
  if (item.product?.thumbnail) return item.product.thumbnail;
  return item.product?.images?.[0] || "/dashboard/empty-state.svg";
};

export default function InventoryPageComponent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [reorderingOrderNumber, setReorderingOrderNumber] = useState<
    string | null
  >(null);
  const [reportingItemKeys, setReportingItemKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const { mutateAsync: createOutOfStockReport } = useCreateOutOfStockReport();

  const { data, isPending, isRefetching } = useGetOrders({
    status: "COMPLETED",
    search: searchTerm || undefined,
    page: 1,
    limit: 20,
  });

  const orders = data?.data?.orders as Order[] | undefined;

  const filteredOrders = useMemo(() => {
    const allOrders = orders ?? [];
    if (!searchTerm.trim()) return allOrders;

    const normalized = searchTerm.toLowerCase();

    return allOrders.filter((order) => {
      const searchableParts = [
        order.orderNumber,
        order.deliveryAddress?.address,
        order.deliveryAddress?.city,
        order.deliveryAddress?.state,
        ...order.items.map((item) => item.product?.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableParts.includes(normalized);
    });
  }, [orders, searchTerm]);

  const handleReportOutOfStock = async (
    orderId: string,
    orderItemId: string,
  ) => {
    const reportKey = `${orderId}:${orderItemId}`;

    if (reportingItemKeys.has(reportKey)) return;

    setReportingItemKeys((previous) => {
      const updated = new Set(previous);
      updated.add(reportKey);
      return updated;
    });

    try {
      await createOutOfStockReport({
        items: [{ orderId, orderItemId }],
      });
    } finally {
      setReportingItemKeys((previous) => {
        const updated = new Set(previous);
        updated.delete(reportKey);
        return updated;
      });
    }
  };

  const handleReorder = (order: Order) => {
    if (!order.orderNumber) return;

    setReorderingOrderNumber(order.orderNumber);
    router.push(
      `/dashboard/marketplace/checkout?orderNumber=${encodeURIComponent(
        order.orderNumber,
      )}`,
    );
  };

  return (
    <section className="flex flex-col gap-main py-sm">
      <h2 className="text-heading">Inventory</h2>

      <div className="w-full border-b border-border-main pb-main">
        <div className="ml-auto flex items-center gap-4 w-full mdx:max-w-md">
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search"
            leftIcon={<Search size={18} className="text-body-passive" />}
            className="h-10 bg-white min-w-[200px]"
          />
        </div>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-main py-sm">
          {[1, 2].map((item) => (
            <OrderCardSkeleton key={item} itemCount={3} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-border-main bg-white">
          <EmptyState
            header="No completed orders yet"
            description="Completed inventory orders will appear here once available."
            showCTA={false}
          />
        </div>
      ) : (
        <div
          className={`flex flex-col gap-main transition-opacity ${
            isRefetching ? "opacity-70" : "opacity-100"
          }`}
        >
          {filteredOrders.map((order) => {
            const orderStatusStyles = getOrderStatusStyles(order.status);

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border-2 border-border-main bg-white px-main pt-main"
              >
                <div className="flex flex-col gap-main border-b-2 border-border-main pb-main lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex flex-col gap-5 lg:max-w-[460px]">
                    <span className="font-family-mono text-[12px] leading-[1.2] tracking-[0.08em] text-body-passive uppercase">
                      Delivery Address:
                    </span>
                    <p className="max-w-[1000px] line-clamp-2 text-[14px] font-medium leading-normal tracking-[0.04em] text-body">
                      {buildDeliveryAddress(order)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-sm lg:flex-nowrap">
                    <Button
                      variant="neutral"
                      size="neutral"
                      className="px-lg!"
                      onClick={() => handleReorder(order)}
                      disabled={reorderingOrderNumber === order.orderNumber}
                    >
                      Reorder
                    </Button>

                    <div className="h-7 w-[1.4px] bg-border-main" />

                    <div className="flex flex-col gap-5">
                      <span className="font-family-mono text-[12px] leading-[1.2] tracking-[0.08em] text-body uppercase">
                        Order Date:
                      </span>
                      <span className="text-[14px] font-semibold leading-normal tracking-[0.04em] text-body">
                        {formatDateOnly(order.orderDate || order.createdAt)}
                      </span>
                    </div>

                    <div className="h-7 w-[1.4px] bg-border-main" />

                    <div className="flex flex-col gap-5">
                      <span className="font-family-mono text-[12px] leading-[1.2] tracking-[0.08em] text-body uppercase">
                        Delivery Date:
                      </span>
                      <span className="text-[14px] font-semibold leading-normal tracking-[0.04em] text-body">
                        {formatDateOnly(order.updatedAt)}
                      </span>
                    </div>

                    <div className="h-7 w-[1.4px] bg-border-main" />

                    <div className="flex flex-col gap-5">
                      <span className="text-[14px] font-medium leading-normal tracking-[0.04em] text-body">
                        Status
                      </span>
                      <TableTag
                        small
                        className={orderStatusStyles.styles}
                        text={orderStatusStyles.text}
                      />
                    </div>
                  </div>
                </div>

                <div className="py-main">
                  {order.items.map((item) => {
                    const itemStatusStyles = getItemStatusStyles(item.status);
                    const reportKey = `${order.id}:${item.id}`;
                    const isReportingItem = reportingItemKeys.has(reportKey);

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-[auto_1fr_auto] items-start gap-main border-b border-border-main px-5 py-md last:border-b-0"
                      >
                        <div className="relative h-[62px] w-[62px] overflow-hidden rounded-lg border border-border-main bg-storey-foreground">
                          <Image
                            src={getProductImage(item)}
                            alt={item.product?.name || "Product image"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-col gap-5">
                          <div className="flex items-center gap-6">
                            <h5 className="truncate text-[22px] leading-[1.2] text-heading">
                              {item.product?.name || "Product name"}
                            </h5>
                            <TableTag
                              small
                              className={itemStatusStyles.styles}
                              text={itemStatusStyles.text}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-sm lg:grid-cols-4 lg:gap-main">
                            <span className="font-family-mono text-[12px] tracking-[0.08em] text-body-passive uppercase">
                              Qty:{" "}
                              <span className="font-garantpro font-semibold text-body">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="font-family-mono text-[12px] tracking-[0.08em] text-body-passive uppercase">
                              Size:{" "}
                              <span className="font-garantpro font-semibold text-body">
                                {item.product?.packSize?.name || "—"}
                              </span>
                            </span>
                            <span className="font-family-mono text-[12px] tracking-[0.08em] text-body-passive uppercase">
                              Type:{" "}
                              <span className="font-garantpro font-semibold text-body">
                                {item.product?.packType?.name || "—"}
                              </span>
                            </span>
                            <span className="font-family-mono text-[12px] tracking-[0.08em] text-body-passive uppercase lg:text-right">
                              Price: ₦
                              <span className="font-garantpro font-semibold text-body">
                                {formatCurrency(item.lineTotal)}
                              </span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="mt-3 cursor-pointer rounded-full p-2 text-brand-primary hover:bg-tag-added disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Item notifications"
                          aria-busy={isReportingItem}
                          disabled={isReportingItem}
                          onClick={() =>
                            handleReportOutOfStock(order.id, item.id)
                          }
                        >
                          <BellRing className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-end justify-between border-t-2 border-border-main px-5 py-main">
                  <div className="flex flex-col gap-5">
                    <span className="font-family-mono text-[12px] tracking-[0.08em] text-body-passive uppercase">
                      Ordered No:
                    </span>
                    <span className="text-[14px] font-medium tracking-[0.04em] text-body">
                      {order.orderNumber}
                    </span>
                  </div>

                  <div className="flex items-end gap-5">
                    <span className="font-family-mono text-[12px] tracking-[0.08em] text-body uppercase">
                      Amount:
                    </span>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/dashboard/N.svg"
                        width={16}
                        height={16}
                        alt="Naira"
                      />
                      <h3 className="text-body! text-[31px]!">
                        {formatCurrency(
                          order.totalAmount || order.subtotal || "0",
                        )}
                      </h3>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
