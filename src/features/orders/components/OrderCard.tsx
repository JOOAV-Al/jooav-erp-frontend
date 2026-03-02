"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Order, OrderItem } from "@/features/orders/types";
import TableTag from "@/components/general/TableTag";
import Spinner from "@/components/general/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserItem } from "@/features/users/types";
import { useAssignOfficerToOrder } from "@/features/orders/services/orders.api";
import {
  cn,
  enumToTitleCase,
  getItemStatusStyles,
  getOrderStatusStyles,
} from "@/lib/utils";
import { format } from "date-fns";

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
  officers?: UserItem[];
  actionLoading?: boolean;
  showActions?: boolean;
  selectedItemIds: Set<string>;
  onOrderClick?: (order: Order) => void;
  onOrderItemClick?: (item: OrderItem, parentOrder: Order) => void;
  onSelectItem: (order: Order, itemId: string, checked: boolean) => void;
  onMarkItemComplete?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemPending?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemCancelled?: (item: OrderItem, parentOrder: Order) => void;
  onMarkItemInProgress?: (item: OrderItem, parentOrder: Order) => void;
  onRemoveItem?: (item: OrderItem) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderCard({
  order,
  officers,
  actionLoading,
  showActions = true,
  selectedItemIds,
  onOrderClick,
  onOrderItemClick,
  onSelectItem,
  onMarkItemComplete,
  onMarkItemPending,
  onMarkItemCancelled,
  onMarkItemInProgress,
  onRemoveItem,
}: OrderCardProps) {
  const [selectedOfficer, setSelectedOfficer] = useState<UserItem | undefined>(
    () =>
      officers?.find((o) => o.id === order?.assignedProcurementOfficerId || ""),
  );
  const [operatingId, setOperatingId] = useState<string | undefined>("");

  const { mutateAsync: assignOfficer, isPending: assigning } =
    useAssignOfficerToOrder();

  const handleAssignOfficer = async (officerId: string) => {
    const officer = officers?.find((o) => o.id === officerId);
    setSelectedOfficer(officer); // optimistic update
    await assignOfficer({
      orderNumber: order.orderNumber,
      payload: { procurementOfficerId: officerId },
    });
  };

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
    (order.wholesaler?.user?.firstName ?? "") +
    " " +
    (order.wholesaler?.user?.lastName ?? "");

  const orderStatusStyles = getOrderStatusStyles(order.status);

  const displayOfficerName = selectedOfficer
    ? `${selectedOfficer.firstName} ${selectedOfficer.lastName}`
    : (order.procurementOfficerName ?? null);

  return (
    <div className="flex flex-col rounded-3xl border-[2px] border-border-main overflow-hidden px-main pt-main pb-sm gap-5 bg-white">
      {/* ── Order header ───────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 mdxl:grid-cols-3 lg:grid-cols-4 align-top gap-[8px] px-md py-main border-b-2 border-border-main cursor-pointer transition-colors"
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
        <div className="flex flex-col gap-5">
          <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
            Assigned To:
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            {order.status !== "DRAFT" ? (
              <div className="flex flex-col gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-[8px] cursor-pointer">
                      <InitialsAvatar name={displayOfficerName ?? "?"} />
                      <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                        {displayOfficerName ?? "Unassigned"}
                      </span>
                      {assigning ? (
                        <Spinner className="h-[14px] w-[14px] text-outline" />
                      ) : (
                        <ChevronDown
                          strokeWidth={2}
                          className="h-[16px] w-[16px] text-outline"
                        />
                      )}
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
                        onClick={() => handleAssignOfficer(o.id)}
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
                Unassigned
              </span>
            )}
          </div>
        </div>

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
                flex items-start gap-main px-main py-md ml-4 cursor-pointer transition-colors hover:rounded-xl
                ${isSelected ? "bg-storey-foreground shadow-input rounded-xl" : "hover:bg-storey-foreground"}
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
                    onSelectItem(order, item.id, !!checked)
                  }
                  aria-label={`Select ${productName}`}
                />
              </div>

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

                  {/* Item status dropdown */}
                  {showActions && (
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
                          className="flex flex-col gap-5 p-sm! rounded-lg! max-h-90"
                        >
                          <h5 className="py-3">Select item status</h5>
                          {onMarkItemComplete && (
                            <DropdownMenuItem
                              useSelectShadow={false}
                              className="table-tag border-[0.5] border-border-accent! bg-tag-added! text-brand-primary! hover:bg-tag-added hover:text-brand-primary!"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOperatingId(item?.id);
                                onMarkItemComplete(item, order);
                              }}
                            >
                              Completed
                            </DropdownMenuItem>
                          )}
                          {onMarkItemInProgress && (
                            <DropdownMenuItem
                              useSelectShadow={false}
                              className="table-tag border-[0.5] border-border-accent! bg-tag-queue! text-brand-signal! hover:bg-tag-queue hover:text-brand-signal!"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOperatingId(item?.id);
                                onMarkItemInProgress(item, order);
                              }}
                            >
                              In Progress
                            </DropdownMenuItem>
                          )}
                          {onMarkItemPending && (
                            <DropdownMenuItem
                              useSelectShadow={false}
                              className="table-tag border-[0.5] border-border-accent! bg-tag-queue! text-destructive! hover:bg-tag-queue hover:text-destructive!"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOperatingId(item?.id);
                                onMarkItemPending(item, order);
                              }}
                            >
                              Pending
                            </DropdownMenuItem>
                          )}
                          {onMarkItemCancelled && (
                            <DropdownMenuItem
                              useSelectShadow={false}
                              className="table-tag border-[0.5] border-border-accent! bg-[#F7F7F7]! text-body! hover:bg-[#F7F7F7] hover:text-body!"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOperatingId(item?.id);
                                onMarkItemCancelled(item, order);
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
                                setOperatingId(item?.id);
                                onRemoveItem(item);
                              }}
                            >
                              Remove item
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
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
