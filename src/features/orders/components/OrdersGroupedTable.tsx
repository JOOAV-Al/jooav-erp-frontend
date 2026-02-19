"use client";

import React, { useEffect, useState } from "react";
import { CloudUpload, Trash2, X } from "lucide-react";
import Spinner from "@/components/general/Spinner";
import EmptyState from "@/components/general/EmptyState";
import OrderCard from "@/features/orders/components/OrderCard";
import { Order, OrderItem } from "@/features/orders/types";
import GroupTableHeader from "@/components/general/GroupTableHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderGroup {
  /** e.g. "Pending orders", "Completed orders" */
  label: string;
  data: Order[];
  count?: number;
}

interface OrdersGroupedTableProps {
  groups: OrderGroup[];
  loading?: boolean;
  onOrderClick?: (order: Order) => void;
  onDelete?: (selectedOrders: Order[]) => void;
  onPublish?: (selectedOrders: Order[]) => void;
  deletingMultiple?: boolean;
  deletingMultipleStatus?: string;
  publishingMultiple?: boolean;
  publishingMultipleStatus?: string;
  onMarkItemComplete?: (item: OrderItem) => void;
  onMarkItemPending?: (item: OrderItem) => void;
  onRemoveItem?: (item: OrderItem) => void;
  emptyHeader?: string;
  emptyDescription?: string;
  emptyImage?: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const OrderCardSkeleton = ({ itemCount = 2 }: { itemCount?: number }) => (
  <div className="rounded-2xl border-[1.5px] border-border-main overflow-hidden animate-pulse">
    {/* header */}
    <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b-2 border-border-main bg-white">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2.5 w-16 bg-gray-100 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    {/* items */}
    {Array.from({ length: itemCount }).map((_, i) => (
      <div
        key={i}
        className={`flex items-center gap-4 px-6 py-4 ${i < itemCount - 1 ? "border-b border-border-main" : ""}`}
      >
        <div className="w-4 h-4 rounded bg-gray-100" />
        <div className="w-[60px] h-[60px] rounded-lg bg-gray-200" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-72 bg-gray-100 rounded" />
        </div>
      </div>
    ))}
    {/* footer */}
    <div className="flex justify-end px-6 py-3 border-t border-border-main">
      <div className="h-6 w-32 bg-gray-200 rounded" />
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

function OrdersGroupedTable({
  groups,
  loading = false,
  onOrderClick,
  onDelete,
  onPublish,
  deletingMultiple = false,
  deletingMultipleStatus,
  publishingMultiple = false,
  publishingMultipleStatus,
  onMarkItemComplete,
  onMarkItemPending,
  onRemoveItem,
  emptyHeader = "No orders",
  emptyDescription = "No order records yet.",
  emptyImage = "/dashboard/import-csv.svg",
  emptyCta,
  onEmptyCta,
}: OrdersGroupedTableProps) {
  // Selection is tracked at the ORDER level (not item level) for bulk actions
  // but we expose item-level checkboxes per the UI design.
  // We track selected ORDER IDs.
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  // Also track selected ITEM IDs for per-item checkbox display
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(),
  );

  const allOrders = groups.flatMap((g) => g.data);

  console.log({ groups });
  console.log({ allOrders });
  // ── Selection helpers ──────────────────────────────────────────────────────

  const updateOrderSelection = (next: Set<string>) => {
    setSelectedOrderIds(next);
  };

  const handleSelectItem = (order: Order, itemId: string, checked: boolean) => {
    const nextItems = new Set(selectedItemIds);
    if (checked) nextItems.add(itemId);
    else nextItems.delete(itemId);
    setSelectedItemIds(nextItems);

    // If ANY item in the order is selected, mark the order as selected
    const orderItemIds = new Set(order.items?.map((i) => i.id) ?? []);
    const anySelected = [...nextItems].some((id) => orderItemIds.has(id));
    const nextOrders = new Set(selectedOrderIds);
    if (anySelected) nextOrders.add(order.id);
    else nextOrders.delete(order.id);
    updateOrderSelection(nextOrders);
  };

  const handleSelectAllItems = (
    order: Order,
    checked: boolean,
    itemIds: string[],
  ) => {
    const nextItems = new Set(selectedItemIds);
    itemIds.forEach((id) =>
      checked ? nextItems.add(id) : nextItems.delete(id),
    );
    setSelectedItemIds(nextItems);

    const nextOrders = new Set(selectedOrderIds);
    if (checked) nextOrders.add(order.id);
    else nextOrders.delete(order.id);
    updateOrderSelection(nextOrders);
  };

  const handleClearSelection = () => {
    setSelectedOrderIds(new Set());
    setSelectedItemIds(new Set());
  };

  const selectedOrders = allOrders.filter((o) => selectedOrderIds.has(o.id));

  const handleDelete = () => onDelete?.(selectedOrders);
  const handlePublish = () => onPublish?.(selectedOrders);

  useEffect(() => {
    if (deletingMultipleStatus === "success") handleClearSelection();
  }, [deletingMultipleStatus]);

  useEffect(() => {
    if (publishingMultipleStatus === "success") handleClearSelection();
  }, [publishingMultipleStatus]);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-7">
        {[1, 3].map((count, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="h-[39px] rounded-t-2xl bg-white border border-border-main border-b-2 animate-pulse" />
            {Array.from({ length: count }).map((_, j) => (
              <OrderCardSkeleton key={j} itemCount={j === 0 ? 1 : 2} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────

  const hasAnyData = groups.some((g) => g.data.length > 0);
  if (!hasAnyData) {
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
    <div className="flex flex-col gap-7 py-sm relative">
      {groups
        .filter((g) => g.data.length > 0)
        .map((group, gi) => (
          <div key={gi} className="flex flex-col gap-4">
            {/* Group label header — same style as GroupTableHeader */}
            {/* <GroupTableHeader
              label={group.label}
              count={group.count ?? group.data.length}
              withCheckbox={false}
            /> */}

            {/* Order cards */}
            {group.data.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                selectedItemIds={selectedItemIds}
                onSelectItem={(itemId, checked) =>
                  handleSelectItem(order, itemId, checked)
                }
                onSelectAllItems={(checked, itemIds) =>
                  handleSelectAllItems(order, checked, itemIds)
                }
                onOrderClick={(o) => onOrderClick?.(o)}
                onMarkItemComplete={onMarkItemComplete}
                onMarkItemPending={onMarkItemPending}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        ))}

      {/* ── Floating bulk actions ── */}
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

          {onPublish && (
            <div
              onClick={handlePublish}
              className="bg-storey-foreground rounded-lg shadow-input flex items-center group h-11 cursor-pointer"
            >
              <div className="flex items-center justify-center pl-md py-3">
                {publishingMultiple ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <CloudUpload className="w-5 h-5 text-outline" />
                )}
              </div>
              <span className="text-body pr-md pl-3 py-sm">Publish</span>
            </div>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
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
