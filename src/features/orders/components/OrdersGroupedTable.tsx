"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { Order, OrderItem } from "@/features/orders/types";
import Spinner from "@/components/general/Spinner";
import EmptyState from "@/components/general/EmptyState";
import { UserItem } from "@/features/users/types";
import OrderCard from "@/features/orders/components/OrderCard";
import { useUpdateMultipleOrderItemStatus } from "@/features/orders/services/orders.api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface OrdersGroupedTableProps {
  orders: Order[];
  officers?: UserItem[];
  loading?: boolean;
  actionLoading?: boolean;
  showActions?: boolean;
  onOrderClick?: (order: Order) => void;
  onOrderItemClick?: (orderItem: OrderItem, parentOrder: Order) => void;
  onDelete?: (selectedOrders: Order[]) => void;
  deletingMultiple?: boolean;
  deletingMultipleStatus?: string;
  onMarkItemComplete?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemPending?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemCancelled?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemInProgress?: (item: OrderItem, parentOrder: Order) => void;
  onRemoveItem?: (item: OrderItem) => void;
  emptyHeader?: string;
  emptyDescription?: string;
  emptyImage?: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

function OrdersGroupedTable({
  orders,
  officers,
  loading = false,
  actionLoading = false,
  showActions = false,
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

  const [openBulkStatus, setOpenBulkStatus] = useState<boolean>(false);
  // Track selected item IDs and the single order they belong to
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(),
  );

  const { mutateAsync: bulkUpdateItems, isPending: bulkUpdating } =
    useUpdateMultipleOrderItemStatus();

  // const handleSelectItem = (order: Order, itemId: string, checked: boolean) => {
  //   const nextItems = new Set(selectedItemIds);
  //   if (checked) nextItems.add(itemId);
  //   else nextItems.delete(itemId);
  //   setSelectedItemIds(nextItems);

  //   const orderItemIds = new Set(order.items?.map((i) => i.id) ?? []);
  //   const anySelected = [...nextItems].some((id) => orderItemIds.has(id));
  //   const nextOrders = new Set(selectedOrderIds);
  //   if (anySelected) nextOrders.add(order.id);
  //   else nextOrders.delete(order.id);
  //   setSelectedOrderIds(nextOrders);
  // };

  const handleSelectItem = (order: Order, itemId: string, checked: boolean) => {
    // If checking an item from a different order, wipe previous selection first
    if (checked && activeOrderId && activeOrderId !== order.id) {
      setSelectedItemIds(new Set([itemId]));
      setActiveOrderId(order.id);
      return;
    }

    const next = new Set(selectedItemIds);
    if (checked) {
      next.add(itemId);
      setActiveOrderId(order.id);
    } else {
      next.delete(itemId);
      if (next.size === 0) setActiveOrderId(null);
    }
    setSelectedItemIds(next);
  };

  const handleClearSelection = () => {
    // setSelectedOrderIds(new Set());
    setSelectedItemIds(new Set());
    setActiveOrderId(null);
  };

  const handleBulkStatus = async (status: string) => {
    const order = orders.find((o) => o.id === activeOrderId);
    if (!order) return;

    await bulkUpdateItems({
      orderNumber: order.orderNumber,
      payload: {
        items: [...selectedItemIds].map((itemId) => ({
          itemId,
          status,
          processingNotes: "",
        })),
        bulkNotes: "",
      },
    });

    handleClearSelection();
  };

  useEffect(() => {
    if (deletingMultipleStatus === "success") handleClearSelection();
  }, [deletingMultipleStatus]);

  // Derive the active order for the floating bar label
  const activeOrder = orders.find((o) => o.id === activeOrderId);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-main">
        {[1, 2, 3].map((_, i) => (
          <OrderCardSkeleton key={i} itemCount={i === 1 ? 3 : 1} />
        ))}
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────

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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-main py-sm relative">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          officers={officers}
          actionLoading={actionLoading}
          selectedItemIds={selectedItemIds}
          onOrderClick={onOrderClick}
          onOrderItemClick={onOrderItemClick}
          onSelectItem={handleSelectItem}
          onMarkItemComplete={onMarkItemComplete}
          onMarkItemPending={onMarkItemPending}
          onMarkItemCancelled={onMarkItemCancelled}
          onMarkItemInProgress={onMarkItemInProgress}
          onRemoveItem={onRemoveItem}
          showActions={showActions}
        />
      ))}

      {/* Floating bulk actions */}
      {selectedItemIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center max-w-97.5 w-full gap-6">
          <div className="bg-storey-foreground rounded-lg shadow-input flex items-center h-11">
            <span className="text-body px-md py-sm border-r-2 border-border-main">
              {selectedItemIds.size} Selected
            </span>
            <button
              onClick={handleClearSelection}
              className="flex items-center justify-center h-full px-md py-3 cursor-pointer hover:bg-border-main group"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5 text-outline" />
            </button>
          </div>

          {/* Bulk status */}
          <DropdownMenu open={openBulkStatus} onOpenChange={setOpenBulkStatus}>
            <DropdownMenuTrigger asChild>
              <button
                className={` ${openBulkStatus ? "bg-[#EDEDED]" : "bg-storey-foreground"} hover:bg-[#EDEDED] rounded-lg shadow-input px-main py-md flex items-center gap-5 group cursor-pointer h-11`}
                aria-label="Update status"
              >
                {bulkUpdating ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <MoreHorizontal className="w-5 h-5 text-outline" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="flex flex-col gap-5 p-sm! rounded-lg! max-h-90 mb-3"
            >
              <h5 className="py-3">Select item status</h5>
              <DropdownMenuItem
                useSelectShadow={false}
                className="table-tag border-[0.5] border-border-accent! bg-tag-added! text-brand-primary! hover:bg-tag-added hover:text-brand-primary!"
                onClick={() => handleBulkStatus("DELIVERED")}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                useSelectShadow={false}
                className="table-tag border-[0.5] border-border-accent! bg-tag-queue! text-brand-signal! hover:bg-tag-queue hover:text-brand-signal!"
                onClick={() => handleBulkStatus("SOURCING")}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                useSelectShadow={false}
                className="table-tag border-[0.5] border-border-accent! bg-tag-queue! text-destructive! hover:bg-tag-queue hover:text-destructive!"
                onClick={() => handleBulkStatus("PENDING")}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                useSelectShadow={false}
                className="table-tag border-[0.5] border-border-accent! bg-[#F7F7F7]! text-body! hover:bg-[#F7F7F7] hover:text-body!"
                onClick={() => handleBulkStatus("CANCELLED")}
              >
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete */}
          {/* {onDelete && (
            <button
              onClick={() =>
                onDelete(orders.filter((o) => o.id === activeOrderId))
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
          )} */}
        </div>
      )}
    </div>
  );
}

export default OrdersGroupedTable;
