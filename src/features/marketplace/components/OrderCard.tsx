"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";
import AppImage from "@/components/general/AppImage";
import Image from "next/image";
import { Order, OrderItem } from "@/features/marketplace/types";
import TableTag from "@/components/general/TableTag";
// import Spinner from "@/components/general/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cn,
  enumToTitleCase,
  formatCurrency,
  formatOrderDate,
  getItemStatusStyles,
  getOrderAssignmentStatusStyles,
  getOrderStatusStyles,
} from "@/lib/utils";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Spinner } from "@/components/ui/spinner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const InitialsAvatar = ({ name }: { name: string }) => {
  const parts = name?.trim().split(" ") ?? [];
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : (parts[0]?.[0] ?? "?");
  return (
    <div className="w-[26px] h-[26px] flex-shrink-0 flex justify-center items-center rounded-full bg-tag-added border border-border-main text-[13px] font-semibold tracking-[0.05em] text-brand-primary uppercase">
      {initials}
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface OrderCardProps {
  order: Order;
  officers?: any[];
  actionLoading?: boolean;
  showActions?: boolean;
  withCheckbox?: boolean;
  showStatus?: boolean;
  selectedItemIds?: Set<string>;
  onOrderClick?: (order: Order) => void;
  onOrderItemClick?: (item: OrderItem, parentOrder: Order) => void;
  onSelectItem?: (order: Order, itemId: string, checked: boolean) => void;
  onMarkItemComplete?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemPending?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemCancelled?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemInProgress?: (item: OrderItem, parentOrder: Order) => void;
  onRemoveItem?: (item: OrderItem) => void;
  showItemStatus?: boolean;
  refetch?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderCard({
  order,
  officers,
  actionLoading,
  showActions = true,
  withCheckbox = true,
  showStatus = true,
  selectedItemIds,
  onOrderClick,
  onOrderItemClick,
  onSelectItem,
  onMarkItemComplete,
  onMarkItemPending,
  onMarkItemCancelled,
  onMarkItemInProgress,
  onRemoveItem,
  showItemStatus = false,
  refetch,
}: OrderCardProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const hideAssignmentStatuses = ["DRAFT", "PENDING_PAYMENT"];
  const responseStatuses = ["PENDING_ACCEPTANCE", "REASSIGNED"];
  const isProcurement = false;
  const isThreeHeaderColumns =
    isProcurement || hideAssignmentStatuses.includes(order?.status);
  const needsResponse = responseStatuses.includes(order?.assignmentStatus);
  const shouldShowActions = isProcurement
    ? order?.status !== "COMPLETED" && order?.assignmentStatus === "ACCEPTED"
    : hideAssignmentStatuses?.includes(order?.status) ||
        order?.status === "COMPLETED"
      ? false
      : showActions;
  const [selectedOfficer, setSelectedOfficer] = useState<any | undefined>(() =>
    officers?.find((o) => o.id === order?.assignedProcurementOfficerId || ""),
  );
  const [operatingId, setOperatingId] = useState<string | undefined>("");

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
    (order.wholesaler?.firstName ?? "") +
    " " +
    (order.wholesaler?.lastName ?? "");

  const orderStatusStyles = getOrderStatusStyles(order.status);
  const acceptedAssignment = getOrderAssignmentStatusStyles("ACCEPTED");

  const displayOfficerName = selectedOfficer
    ? `${selectedOfficer.firstName} ${selectedOfficer.lastName}`
    : (order.procurementOfficerName ?? null);

  return (
    <div className="flex flex-col rounded-3xl border-[2px] border-border-main overflow-hidden px-main pt-main pb-sm gap-5 bg-white">
      {/* ── Order header ───────────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between px-md py-main border-b-2 border-border-main transition-colors cursor-pointer overflow-hidden`}
        onClick={() => onOrderClick?.(order)}
      >
        <div className="flex flex-col gap-2 max-w-[50%]">
          <span className="text-[12px] py-1 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-family-mono">
            Delivery Address:
          </span>
          <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em] truncate">
            {address}
          </span>
        </div>

        <div className="flex items-center gap-x-6">
          <div className="flex flex-col gap-1 min-w-fit">
            <span className="text-[12px] py-1 font-normal tracking-[0.08em] leading-[1.2] text-body uppercase font-family-mono">
              order date
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {formatOrderDate(order.orderDate ?? order.createdAt)}
            </span>
          </div>
          <div className="hidden sm:block w-[1.38px] h-7 bg-[#D9D9D9]"></div>
          <div className="flex flex-col gap-1 min-w-fit">
            <span className="text-[12px] py-1 font-normal tracking-[0.08em] leading-[1.2] text-body uppercase font-family-mono">
              est. delivery date
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {formatOrderDate(order.orderDate ?? order.createdAt)}
            </span>
          </div>
          {showStatus && (
            <div className="hidden sm:block w-[1.38px] h-7 bg-[#D9D9D9] justify-self-center"></div>
          )}
          {showStatus && (
            <div className="flex flex-col gap-1 min-w-fit">
              <span className="text-[14px] h-[21px] py-1 font-normal tracking-[0.04em] leading-[1.5] text-body">
                Status
              </span>
              <TableTag
                small
                className={orderStatusStyles.styles}
                text={orderStatusStyles.text}
              />
            </div>
          )}
        </div>
        {/* Delivery Address */}
      </div>

      {/* ── Item rows ──────────────────────────────────────────────────────── */}
      <div>
        {items.map((item) => {
          const itemStatusStyles = getItemStatusStyles(item.status);
          const productName = item.product.name;
          const isSelected = selectedItemIds?.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onOrderItemClick?.(item, order)}
              className={`
                flex items-start gap-main px-main py-md ml-4 ${isProcurement ? "" : "cursor-pointer"} transition-colors hover:rounded-xl
                ${isSelected ? "bg-storey-foreground shadow-input rounded-xl" : "hover:bg-storey-foreground"}
              `}
            >
              {/* Checkbox */}
              {withCheckbox && (
                <div
                  className="flex-shrink-0 mt-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onSelectItem?.(order, item.id, !!checked)
                    }
                    aria-label={`Select ${productName}`}
                  />
                </div>
              )}

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-[65px] h-[65px] rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center text-[10px] text-body-passive font-family-mono">
                <AppImage
                  src={(item as any)?.product?.thumbnail}
                  alt={productName}
                  width={65}
                  height={65}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-main min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between w-full gap-5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h5>{productName}</h5>
                      {showItemStatus && (
                        <TableTag
                          small
                          className={itemStatusStyles.styles}
                          text={itemStatusStyles.text}
                        />
                      )}
                    </div>

                    {actionLoading && operatingId === item.id ? (
                      <Spinner />
                    ) : (
                      !showItemStatus && (
                        <div
                          className="flex-shrink-0"
                          onClick={() => {
                            setOperatingId(item?.id ?? "");
                            onRemoveItem?.(item);
                          }}
                        >
                          <Trash2
                            size={20}
                            className={`text-outline-passive cursor-pointer`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:justify-between items-center gap-x-4 gap-y-3 py-3">
                  <span className="font-family-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                    QTY:{" "}
                    <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {item.quantity}
                    </span>
                  </span>
                  <span className="font-family-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                    SIZE:{" "}
                    <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {item?.product?.packSize?.name ?? "—"}
                    </span>
                  </span>
                  <span className="font-family-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                    TYPE:{" "}
                    <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {item?.product?.packType?.name ?? "—"}
                    </span>
                  </span>
                  <span className="font-family-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] lg:ml-auto">
                    PRICE:{" ₦"}
                    <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {formatCurrency(item.unitPrice ?? item.lineTotal ?? 0)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Amount footer ──────────────────────────────────────────────────── */}
      <div className="flex justify-between items-end px-md py-lg border-t-2 border-border-main gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] py-1 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-family-mono">
            ordered no:
          </span>
          <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em] uppercase">
            {order.orderNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-normal tracking-[0.08em] text-body-passive uppercase font-family-mono">
            amount:
          </span>
          <div className="flex items-center gap-1">
            <h3 className="text-body! flex items-center gap-1">
              <span className="text-[20px]">₦</span>
              {formatCurrency(order.totalAmount ?? order.subtotal ?? 0)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
