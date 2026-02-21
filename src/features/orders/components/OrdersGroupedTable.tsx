"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Order, OrderItem } from "@/features/orders/types";
import TableTag from "@/components/general/TableTag";
import Spinner from "@/components/general/Spinner";
import EmptyState from "@/components/general/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-NG").format(num);
};

const formatOrderDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy. h:mmaaa");
  } catch {
    return dateStr;
  }
};

const InitialsAvatar = ({ name }: { name: string }) => {
  const parts = name?.trim().split(" ") ?? [];
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : (parts[0]?.[0] ?? "?");
  return (
    <div className="w-[26px] h-[26px] flex-shrink-0 flex justify-center items-center rounded-full bg-tag-added border border-border-main text-[13px] font-semibold tracking-[0.05] text-brand-primary uppercase">
      {initials}
    </div>
  );
};

const getItemStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
    case "DELIVERED":
      return {
        styles:
          "table-tag border-border-accent bg-tag-added text-brand-primary!",
        text: "Completed",
      };
    case "PROCESSING":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-brand-signal",
        text: "In Progress",
      };
    case "PENDING":
    case "PENDING_APPROVAL":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-destructive",
        text: "Pending",
      };
    default:
      return {
        styles: "table-tag border-border-accent bg-[#F7F7F7] text-body",
        text: "Cancelled",
      };
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrdersGroupedTableProps {
  orders: Order[];
  loading?: boolean;
  actionLoading?: boolean;
  onOrderClick?: (order: Order) => void;
  onOrderItemClick?: (order: OrderItem) => void;
  onDelete?: (selectedOrders: Order[]) => void;
  deletingMultiple?: boolean;
  deletingMultipleStatus?: string;
  onMarkItemComplete?: (item: OrderItem) => void;
  onMarkItemPending?: (item: OrderItem) => void;
  onMarkItemCancelled?: (item: OrderItem) => void;
  onMarkItemInProgress?: (item: OrderItem) => void;
  onRemoveItem?: (item: OrderItem) => void;
  emptyHeader?: string;
  emptyDescription?: string;
  emptyImage?: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const OrderCardSkeleton = ({ itemCount = 2 }: { itemCount?: number }) => (
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

// ─── Main component ───────────────────────────────────────────────────────────

function OrdersGroupedTable({
  orders,
  loading = false,
  actionLoading = false,
  onOrderClick,
  onOrderItemClick,
  onDelete,
  deletingMultiple = false,
  deletingMultipleStatus,
  onMarkItemComplete,
  onMarkItemPending,
  onMarkItemCancelled,
  onMarkItemInProgress,
  onRemoveItem,
  emptyHeader = "No orders",
  emptyDescription = "No order records yet.",
  emptyImage = "/dashboard/import-csv.svg",
  emptyCta,
  onEmptyCta,
}: OrdersGroupedTableProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(),
  );

  const handleSelectItem = (order: Order, itemId: string, checked: boolean) => {
    const nextItems = new Set(selectedItemIds);
    if (checked) nextItems.add(itemId);
    else nextItems.delete(itemId);
    setSelectedItemIds(nextItems);

    const orderItemIds = new Set(order.items?.map((i) => i.id) ?? []);
    const anySelected = [...nextItems].some((id) => orderItemIds.has(id));
    const nextOrders = new Set(selectedOrderIds);
    if (anySelected) nextOrders.add(order.id);
    else nextOrders.delete(order.id);
    setSelectedOrderIds(nextOrders);
  };

  const handleClearSelection = () => {
    setSelectedOrderIds(new Set());
    setSelectedItemIds(new Set());
  };

  useEffect(() => {
    if (deletingMultipleStatus === "success") handleClearSelection();
  }, [deletingMultipleStatus]);

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-main">
        {[1, 2, 3].map((_, i) => (
          <OrderCardSkeleton key={i} itemCount={i === 1 ? 3 : 1} />
        ))}
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────

  if (!orders.length) {
    return (
      <div className="bg-white rounded-2xl border border-border-main p-8">
        <EmptyState
          header={emptyHeader}
          description={emptyDescription}
          image={emptyImage}
          cta={emptyCta}
          onCTAClick={onEmptyCta}
        />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-main py-sm relative">
      {orders.map((order) => {
        const items = order.items ?? [];
        const address = order.deliveryAddress
          ? [
              order.deliveryAddress.address,
              order.deliveryAddress.city,
              order.deliveryAddress.state,
              "Nigeria",
            ]
              .filter(Boolean)
              .join(", ")
          : "—";

        const wholesaler =
          order.wholesaler?.user?.firstName +
          " " +
          order?.wholesaler?.user?.lastName;

        return (
          <div
            key={order.id}
            className="flex flex-col rounded-3xl border-[2px] border-border-main overflow-hidden px-main pt-main pb-sm gap-5 bg-white"
          >
            {/* Order header */}
            <div
              className="grid grid-cols-1 mdxl:grid-cols-3 lg:grid-cols-4 align-top gap-[8px] px-md py-main border-b-2 border-border-main cursor-pointer transition-colors"
              onClick={() => onOrderClick?.(order)}
            >
              <div className="flex flex-col gap-5">
                <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
                  Ordered By:
                </span>
                <div className="flex items-center gap-5">
                  <InitialsAvatar name={wholesaler ?? "—"} />
                  <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                    {wholesaler ?? "—"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5 ">
                <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
                  Assigned To:
                </span>
                <div className="flex items-center gap-5">
                  {order.procurementOfficerName ? (
                    <>
                      <InitialsAvatar name={order.procurementOfficerName} />
                      <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                        {order.procurementOfficerName}
                      </span>
                    </>
                  ) : (
                    <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5 lg:place-self-center">
                <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
                  Delivery Address:
                </span>
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                  {address}
                </span>
              </div>

              <div className="flex flex-col gap-5 lg:ml-auto">
                <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
                  Ordered On:
                </span>
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                  {formatOrderDate(order.orderDate ?? order.createdAt)}
                </span>
              </div>
            </div>

            {/* Item rows */}
            <div>
              {items.map((item, idx) => {
                const statusStyles = getItemStatusStyles(item.status);
                const productName = item.product.name;
                const isSelected = selectedItemIds.has(item.id);
                const isLast = idx === items.length - 1;

                return (
                  <div
                    key={item.id}
                    onClick={() => onOrderItemClick?.(item)}
                    className={`
                      flex items-start gap-main px-main py-md ml-4 cursor-pointer transition-colors hover:rounded-xl
                      ${isSelected ? "bg-storey-foreground shadow-input rounded-xl" : "hover:bg-storey-foreground"}
                      ${!isLast ? "border-b border-border-main" : ""}
                    `}
                  >
                    {/* Checkbox */}
                    <div
                      className="flex-shrink-0 mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectItem(order, item.id, !!checked)
                        }
                        aria-label={`Select ${productName}`}
                      />
                    </div>

                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-[65px] h-[65px] rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                      {(item as any)?.thumbnail ? (
                        <Image
                          src={(item as any).thumbnail}
                          alt={productName}
                          width={65}
                          height={65}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-mono">
                          IMG
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-main min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5 flex-wrap">
                          <h5>{productName}</h5>
                          <TableTag
                            className={statusStyles.styles}
                            text={statusStyles.text}
                          />
                          {actionLoading && <Spinner className="size-4" />}
                        </div>

                        {/* Item dropdown */}
                        <div
                          className="flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="flex items-center justify-center py-1 px-2 gap-6 cursor-pointer">
                                <MoreHorizontal className="h-5 w-5 ring-none! border-none!" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className={
                                "flex flex-col gap-5 p-sm! rounded-lg! max-h-90"
                              }
                            >
                              {onMarkItemComplete && (
                                <DropdownMenuItem
                                  useSelectShadow={false}
                                  className={
                                    "table-tag border-[0.5] border-border-accent! bg-tag-added! text-brand-primary! hover:bg-tag-added hover:text-brand-primary!"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkItemComplete(item);
                                  }}
                                >
                                  Completed
                                </DropdownMenuItem>
                              )}
                              {onMarkItemInProgress && (
                                <DropdownMenuItem
                                  useSelectShadow={false}
                                  className={
                                    "table-tag border-[0.5] border-border-accent! bg-tag-queue! text-brand-signal! hover:bg-tag-queue hover:text-brand-signal!"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkItemInProgress(item);
                                  }}
                                >
                                  In Progress
                                </DropdownMenuItem>
                              )}
                              {onMarkItemPending && (
                                <DropdownMenuItem
                                  useSelectShadow={false}
                                  className={
                                    "table-tag border-[0.5] border-border-accent! bg-tag-queue! text-destructive! hover:bg-tag-queue hover:text-destructive!"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkItemPending(item);
                                  }}
                                >
                                  Pending
                                </DropdownMenuItem>
                              )}
                              {onMarkItemCancelled && (
                                <DropdownMenuItem
                                  useSelectShadow={false}
                                  className={
                                    "table-tag border-[0.5] border-border-accent! bg-[#F7F7F7]! text-body! hover:bg-[#F7F7F7] hover:text-body!"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkItemCancelled(item);
                                  }}
                                >
                                  Cancelled
                                </DropdownMenuItem>
                              )}
                              {onRemoveItem && (
                                <DropdownMenuItem
                                  className="text-red-500 focus:text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveItem(item);
                                  }}
                                >
                                  Remove item
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 mdxl:grid-cols-3 lg:grid-cols-4 gap-[8px] py-3">
                        <span className="font-mono text-[12px] text-body-passive tracking-[0.08] leading-[1.2] uppercase">
                          QTY:{" "}
                          <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
                            {item.quantity}
                          </span>
                        </span>
                        <span className="font-mono text-[12px] lg:place-self-center text-body-passive tracking-[0.08] leading-[1.2] uppercase">
                          SIZE:{" "}
                          <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
                            {(item as any)?.packSize?.name ??
                              (item as any)?.size ??
                              "—"}
                          </span>
                        </span>
                        <span className="font-mono text-[12px] lg:place-self-center text-body-passive tracking-[0.08] leading-[1.2] uppercase">
                          TYPE:{" "}
                          <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
                            {(item as any)?.packType?.name ??
                              (item as any)?.type ??
                              "—"}
                          </span>
                        </span>
                        <span className="font-mono text-[12px] text-body-passive tracking-[0.08] leading-[1.2] uppercase lg:ml-auto">
                          PRICE:{" ₦"}
                          <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
                            {formatCurrency(
                              item.unitPrice ?? item.lineTotal ?? 0,
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Amount footer */}
            <div className="flex justify-between items-center px-md py-lg border-t-2 border-border-main gap-5">
              <div className="flex flex-col gap-5">
                <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
                  Order No:
                </span>
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                  {order?.orderNumber}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <span className="text-[12px] font-normal tracking-[0.08] text-body uppercase">
                  Amount:
                </span>
                <div className="flex items-center gap-1">
                  <Image
                    src="/dashboard/N.svg"
                    width={16}
                    height={16}
                    alt="Naira"
                  />
                  <h3 className="text-body!">
                    {formatCurrency(order.totalAmount ?? order.subtotal ?? 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating bulk actions */}
      {selectedOrderIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center max-w-97.5 w-full gap-6">
          <div className="bg-storey-foreground rounded-lg shadow-input flex items-center h-11">
            <span className="text-body px-md py-sm border-r-2 border-border-main">
              {selectedOrderIds.size} Selected
            </span>
            <button
              onClick={handleClearSelection}
              className="flex items-center justify-center px-md py-3 cursor-pointer group"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5 text-outline group-hover:scale-105 group-hover:text-brand-primary" />
            </button>
          </div>

          {onDelete && (
            <button
              onClick={() =>
                onDelete(orders.filter((o) => selectedOrderIds.has(o.id)))
              }
              className="bg-storey-foreground rounded-lg shadow-input px-main py-md flex items-center gap-5 group cursor-pointer h-11"
              aria-label="Delete selected"
            >
              {deletingMultiple ? (
                <Spinner color="red" className="w-5 h-5" />
              ) : (
                <Trash2 className="w-5 h-5 text-outline group-hover:text-red-500 group-hover:scale-105" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OrdersGroupedTable;
