"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Order, OrderItem } from "@/features/marketplace/types";
import TableTag from "@/components/general/TableTag";
import Spinner from "@/components/general/Spinner";
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
  selectedItemIds: Set<string>;
  onOrderClick?: (order: Order) => void;
  onOrderItemClick?: (item: OrderItem, parentOrder: Order) => void;
  onSelectItem: (order: Order, itemId: string, checked: boolean) => void;
  onMarkItemComplete?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemPending?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemCancelled?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemInProgress?: (item: OrderItem, parentOrder: Order) => void;
  onRemoveItem?: (item: OrderItem) => void;
  refetch?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderCard({
  order,
  officers,
  actionLoading,
  showActions = true,
  withCheckbox = true,
  selectedItemIds,
  onOrderClick,
  onOrderItemClick,
  onSelectItem,
  onMarkItemComplete,
  onMarkItemPending,
  onMarkItemCancelled,
  onMarkItemInProgress,
  onRemoveItem,
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
    : hideAssignmentStatuses?.includes(order?.status) || order?.status === "COMPLETED" ? false : showActions;
  const [selectedOfficer, setSelectedOfficer] = useState<any | undefined>(
    () =>
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
        className={`grid grid-cols-1 ${isThreeHeaderColumns ? "lg:grid-cols-3" : "lg:grid-cols-4"} align-top gap-[8px] px-md py-main border-b-2 border-border-main ${isProcurement ? "" : "cursor-pointer"} transition-colors`}
        onClick={() => onOrderClick?.(order)}
      >
        {/* Ordered By */}
        <div className="flex flex-col gap-5">
          <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
            Ordered By:
          </span>
          <div className="flex items-center gap-5">
            <InitialsAvatar name={wholesaler || "—"} />
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {wholesaler || "—"}
            </span>
          </div>
        </div>

        {/* Assigned To */}
        {!isThreeHeaderColumns && (
          <div className="flex flex-col gap-5">
            <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
              Assigned To:
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              {order.status === "COMPLETED" ? (
                <div className="flex items-center gap-[8px] cursor-pointer">
                  <InitialsAvatar name={displayOfficerName ?? "?"} />
                  <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                    {displayOfficerName ?? "Unassigned"}
                  </span>
                </div>
              ) : order.status !== "DRAFT" &&
                order?.status !== "PENDING_PAYMENT" ? (
                <div className="flex flex-col gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-[8px] cursor-pointer">
                        <InitialsAvatar name={displayOfficerName ?? "?"} />
                        <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                          {displayOfficerName ?? "Unassigned"}
                        </span>
                        {/* {assigning ? (
                          <Spinner className="h-[14px] w-[14px] text-outline" />
                        ) : (
                          <ChevronDown
                            strokeWidth={2}
                            className="h-[16px] w-[16px] text-outline"
                          />
                        )} */}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="flex flex-col gap-5 p-sm! rounded-lg! max-h-90 overflow-y-auto user-dropdown"
                    >
                      {officers?.map((o) => (
                        <DropdownMenuItem
                          key={o.id}
                          className={cn(
                            "rounded-main h-8 cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
                            o.id === selectedOfficer?.id &&
                              "bg-storey-foreground text-body table-selected",
                          )}
                          // onClick={() => handleAssignOfficer(o.id)}
                        >
                          <div className="flex items-center gap-5">
                            <InitialsAvatar
                              name={`${o.firstName} ${o.lastName}`}
                            />
                            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                              {o.firstName} {o.lastName}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <TableTag text={enumToTitleCase(order?.assignmentStatus)} />
                </div>
              ) : (
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="flex flex-col gap-5 lg:place-self-center">
          <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
            Delivery Address:
          </span>
          <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
            {address}
          </span>
        </div>

        {/* Date + Status */}
        <div className="flex flex-col gap-5 lg:ml-auto">
          <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
            {formatOrderDate(order.orderDate ?? order.createdAt)}
          </span>
          <div className="lg:ml-auto">
            
              <TableTag
                small
                className={orderStatusStyles.styles}
                text={orderStatusStyles.text}
              />
          
          </div>
        </div>
      </div>

      {/* ── Item rows ──────────────────────────────────────────────────────── */}
      <div>
        {items.map((item) => {
          const itemStatusStyles = getItemStatusStyles(item.status);
          const productName = item.product.name;
          const isSelected = selectedItemIds.has(item.id);

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
                      onSelectItem(order, item.id, !!checked)
                    }
                    aria-label={`Select ${productName}`}
                  />
                </div>
              )}

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-[65px] h-[65px] rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                {(item as any)?.product?.thumbnail &&
                (item as any)?.product?.thumbnail?.startsWith("https://") ? (
                  <Image
                    src={(item as any)?.product?.thumbnail}
                    alt={productName}
                    width={65}
                    height={65}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-storey-foreground flex items-center justify-center text-[10px] text-body-passive font-mono">
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
                      className={itemStatusStyles.styles}
                      text={itemStatusStyles.text}
                    />
                    {actionLoading && operatingId === item.id && (
                      <Spinner className="size-4" />
                    )}
                  </div>

                  
                </div>

                <div className="grid grid-cols-1 mdxl:grid-cols-3 lg:grid-cols-4 gap-[8px] py-3">
                  <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                    QTY:{" "}
                    <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {item.quantity}
                    </span>
                  </span>
                  <span className="font-mono text-[12px] lg:place-self-center text-body-passive tracking-[0.08em] leading-[1.2]">
                    SIZE:{" "}
                    <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {item?.product?.packSize?.name ?? "—"}
                    </span>
                  </span>
                  <span className="font-mono text-[12px] lg:place-self-center text-body-passive tracking-[0.08em] leading-[1.2]">
                    TYPE:{" "}
                    <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                      {item?.product?.packType?.name ?? "—"}
                    </span>
                  </span>
                  <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] lg:ml-auto">
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
      <div className="flex justify-between items-center px-md py-lg border-t-2 border-border-main gap-5">
        <div className="flex flex-col gap-5">
          <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
            Order No:
          </span>
          <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
            {order.orderNumber}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-[12px] font-normal tracking-[0.08em] text-body uppercase">
            Amount:
          </span>
          <div className="flex items-center gap-1">
            <Image src="/dashboard/N.svg" width={16} height={16} alt="Naira" />
            <h3 className="text-body!">
              {formatCurrency(order.totalAmount ?? order.subtotal ?? 0)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
