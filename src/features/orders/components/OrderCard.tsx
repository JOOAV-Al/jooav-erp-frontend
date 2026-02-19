"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Order, OrderItem } from "@/features/orders/types";
import TableTag from "@/components/general/TableTag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const padCount = (n: number) => String(n).padStart(2, "0");

const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-NG").format(num);
};

const formatOrderDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return format(d, "dd/MM/yyyy. h:mmaaa");
  } catch {
    return dateStr;
  }
};

/** Avatar initials box */
const InitialsAvatar = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => {
  const parts = name?.trim().split(" ") ?? [];
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : (parts[0]?.[0] ?? "?");
  return (
    <div
      className={`w-7 h-7 flex-shrink-0 flex justify-center items-center rounded-full bg-brand-secondary border border-border-main text-[11px] font-semibold tracking-wide text-brand-accent-2 uppercase ${className}`}
    >
      {initials}
    </div>
  );
};

// ─── Item status tag styles ───────────────────────────────────────────────────

const getTagStyles = (value: string = "DRAFT") => {
  if (value === "COMPLETED" || value === "DELIVERED") {
    return {
      styles: `border-border-brand-stroke bg-tag-added text-brand-primary`,
      text: `Completed`,
    };
  }
  if (value === "PROCESSING") {
    return {
      styles: `border-border-accent bg-tag-queue text-brand-signal`,
      text: `In Progress`,
    };
  } else if (value === "PENDING") {
    return {
      styles: `border-border-main bg-tag-active text-destructive-500`,
      text: `Pending`,
    };
  } else {
    return {
      styles: `border-border-main bg-tag-draft text-body-passive`,
      text: `Canceled`,
    };
  }
};

const getItemStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
    case "DELIVERED":
      return {
        styles: "border-green-200 bg-green-50 text-green-600",
        text: "Completed",
      };
    case "PENDING":
    case "PENDING_APPROVAL":
      return {
        styles: "border-orange-200 bg-orange-50 text-orange-500",
        text: "Pending",
      };
    case "CANCELLED":
    case "SUSPENDED":
      return {
        styles: "border-red-200 bg-red-50 text-red-500",
        text: "Cancelled",
      };
    case "PROCESSING":
    case "ACTIVE":
      return {
        styles: "border-blue-200 bg-blue-50 text-blue-600",
        text: "Processing",
      };
    default:
      return {
        styles: "border-border-main bg-tag-draft text-body-passive",
        text: status ?? "Unknown",
      };
  }
};

// ─── Per-item dropdown actions ────────────────────────────────────────────────

interface ItemDropdownProps {
  item: OrderItem;
  onMarkComplete?: (item: OrderItem) => void;
  onMarkPending?: (item: OrderItem) => void;
  onRemove?: (item: OrderItem) => void;
}

const ItemDropdown = ({
  item,
  onMarkComplete,
  onMarkPending,
  onRemove,
}: ItemDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="p-1.5 rounded-md hover:bg-storey-foreground transition-colors"
        onClick={(e) => e.stopPropagation()}
        aria-label="Item actions"
      >
        <MoreHorizontal className="w-4 h-4 text-body-passive" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44">
      {onMarkComplete && (
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onMarkComplete(item);
          }}
        >
          Mark as completed
        </DropdownMenuItem>
      )}
      {onMarkPending && (
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onMarkPending(item);
          }}
        >
          Mark as pending
        </DropdownMenuItem>
      )}
      {onRemove && (
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item);
          }}
        >
          Remove item
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

// ─── Order item row ───────────────────────────────────────────────────────────

interface OrderItemRowProps {
  item: OrderItem;
  isSelected: boolean;
  isLast: boolean;
  onSelectItem: (checked: boolean) => void;
  onRowClick: () => void;
  onMarkComplete?: (item: OrderItem) => void;
  onMarkPending?: (item: OrderItem) => void;
  onRemoveItem?: (item: OrderItem) => void;
}

const OrderItemRow = ({
  item,
  isSelected,
  isLast,
  onSelectItem,
  onRowClick,
  onMarkComplete,
  onMarkPending,
  onRemoveItem,
}: OrderItemRowProps) => {
  const statusStyles = getItemStatusStyles(item.status);
  const productName =
    typeof item.productName === "string"
      ? item.productName
      : ((item.productName as any)?.name ?? "Product name");

  return (
    <div
      onClick={onRowClick}
      className={`
        flex items-start gap-main px-main py-md ml-4 cursor-pointer transition-colors
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
          onCheckedChange={(checked) => onSelectItem(!!checked)}
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

      {/* Main info */}
      <div className="flex-1 flex flex-col gap-main min-w-0">
        {/* Top row: name + status + dropdown */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <h5 className="">{productName}</h5>
            <TableTag
              className={`${statusStyles.styles}`}
              text={statusStyles.text}
            />
          </div>
          {/* Dropdown */}
          <div
            className="flex-shrink-0 mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <ItemDropdown
              item={item}
              onMarkComplete={onMarkComplete}
              onMarkPending={onMarkPending}
              onRemove={onRemoveItem}
            />
          </div>
        </div>

        {/* Bottom row: QTY / SIZE / TYPE / PRICE */}
        <div className="grid grid-cols-4 gap-[8px] py-3">
          <span className="font-mono text-[12px] text-body-passive tracking-[0.08] leading-[1.2] uppercase">
            QTY:{" "}
            <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
              {item.quantity}
            </span>
          </span>
          <span className="font-mono text-[12px] place-self-center text-body-passive tracking-[0.08] leading-[1.2] uppercase">
            SIZE:{" "}
            <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
              {(item as any)?.packSize?.name ?? (item as any)?.size ?? "—"}
            </span>
          </span>
          <span className="font-mono text-[12px] place-self-center text-body-passive tracking-[0.08] leading-[1.2] uppercase">
            TYPE:{" "}
            <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
              {(item as any)?.packType?.name ?? (item as any)?.type ?? "—"}
            </span>
          </span>
          <span className="font-mono text-[12px] text-body-passive tracking-[0.08] leading-[1.2] uppercase ml-auto">
            PRICE:{" ₦"}
            <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05px]">
              {formatCurrency(item.unitPrice ?? item.lineTotal ?? 0)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── OrderCard (main export) ──────────────────────────────────────────────────

export interface OrderCardProps {
  order: Order;
  /** IDs of selected ORDER ITEMS (not orders) */
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onSelectAllItems: (checked: boolean, itemIds: string[]) => void;
  /** Clicking the card header / item row opens the order drawer */
  onOrderClick: (order: Order) => void;
  onMarkItemComplete?: (item: OrderItem) => void;
  onMarkItemPending?: (item: OrderItem) => void;
  onRemoveItem?: (item: OrderItem) => void;
}

const OrderCard = ({
  order,
  selectedItemIds,
  onSelectItem,
  onSelectAllItems,
  onOrderClick,
  onMarkItemComplete,
  onMarkItemPending,
  onRemoveItem,
}: OrderCardProps) => {
  const items = order.items ?? [];
  const itemIds = items.map((i) => i.id);
  const selectedInOrder = itemIds.filter((id) => selectedItemIds.has(id));
  const isAllSelected =
    items.length > 0 && selectedInOrder.length === items.length;
  const isSomeSelected = selectedInOrder.length > 0 && !isAllSelected;

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

  return (
    <div className="flex flex-col rounded-3xl border-[2px] border-border-main overflow-hidden px-main pt-main pb-sm gap-5 bg-white">
      {/* ── Order header ── */}
      <div
        className="grid grid-cols-4 gap-[8px] px-md py-main border-b-2 border-border-main bg-white cursor-pointer hover:bg-storey-foreground/40 transition-colors"
        onClick={() => onOrderClick(order)}
      >
        {/* Ordered By */}
        <div className="flex flex-col gap-5">
          <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
            Ordered By:
          </span>
          <div className="flex items-center gap-5">
            <InitialsAvatar name={order.wholesalerBusinessName ?? "—"} />
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
              {order.wholesalerBusinessName ?? "—"}
            </span>
          </div>
        </div>

        {/* Assigned To */}
        <div className="flex flex-col gap-5 place-self-center">
          <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
            Assigned To:
          </span>
          <div className="flex items-center gap-5">
            {order.procurementOfficerName ? (
              <>
                <InitialsAvatar name={order.procurementOfficerName} />
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                  {order.procurementOfficerName ?? "—"}
                </span>
              </>
            ) : (
              <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
                Unassigned
              </span>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="flex flex-col gap-1.5 place-self-center">
          <div className="flex flex-col gap-5">
            <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
              Delivery Address:
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
              {address}
            </span>
          </div>
        </div>

        {/* Ordered On */}
        <div className="flex flex-col gap-5 ml-auto">
          <span className="text-[12px] py-2 font-normal tracking-[0.08] leading-[1.2] text-body-passive uppercase font-mono">
            Ordered On:
          </span>
          <div className="flex items-center gap-5">
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04]">
              {formatOrderDate(order.orderDate ?? order.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Item rows ── */}
      <div className="">
        {items.map((item, idx) => (
          <OrderItemRow
            key={item.id}
            item={item}
            isSelected={selectedItemIds.has(item.id)}
            isLast={idx === items.length - 1}
            onSelectItem={(checked) => onSelectItem(item.id, checked)}
            onRowClick={() => onOrderClick(order)}
            onMarkComplete={onMarkItemComplete}
            onMarkPending={onMarkItemPending}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>

      {/* ── Amount footer ── */}
      <div className="flex justify-end items-center px-md py-lg border-t-2 border-border-main bg-white gap-2">
        <span className="text-[12px] font-normal tracking-[0.08] text-body uppercase">
          Amount:
        </span>
        <div className="flex items-center gap-1">
          <Image src={"/dashboard/N.svg"} width={16} height={16} alt="Naira" />
          <h3 className="text-body!">
            {formatCurrency(order.totalAmount ?? order.subtotal ?? 0)}
          </h3>{" "}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
