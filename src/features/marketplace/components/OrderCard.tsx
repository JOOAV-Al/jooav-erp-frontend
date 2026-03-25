"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { BellRing, Trash2 } from "lucide-react";
import AppImage from "@/components/general/AppImage";
import { Order, OrderItem } from "@/features/marketplace/types";
import TableTag from "@/components/general/TableTag";
import {
  formatCurrency,
  formatOrderDate,
  getItemStatusStyles,
  getOrderStatusStyles,
} from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { format } from "date-fns";

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
  withCheckbox?: boolean;
  showStatus?: boolean;
  selectedItemIds?: Set<string>;
  onOrderClick?: (order: Order) => void;
  onOrderItemClick?: (item: OrderItem, parentOrder: Order) => void;
  onSelectItem?: (order: Order, itemId: string, checked: boolean) => void;
  onReportOutOfStock?: (orderId: string, itemId: string) => void;
  isReportPending?: boolean;
  onReorder?: (parentOrder: Order) => void;
  isReordering?: boolean;
  onMarkItemInProgress?: (item: OrderItem, parentOrder: Order) => void;
  onRemoveItem?: (item: OrderItem) => void;
  isRemoving?: boolean;
  showItemStatus?: boolean;
  showFooter?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderCard({
  order,
  withCheckbox = true,
  showStatus = true,
  selectedItemIds,
  onOrderClick,
  onOrderItemClick,
  onSelectItem,
  onReportOutOfStock,
  isReportPending,
  onReorder,
  isReordering,
  onRemoveItem,
  isRemoving,
  showItemStatus = true,
  showFooter = true,
}: OrderCardProps) {
  const pathname = usePathname();
  const isInventory = pathname.includes("/dashboard/inventory");
  const showInitiatePayment = ["DRAFT", "PENDING_PAYMENT"].includes(
    order.status,
  );
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
  const orderStatusStyles = getOrderStatusStyles(order.status);
  const dummyFiveDaysEstimated = new Date();
  dummyFiveDaysEstimated.setDate(dummyFiveDaysEstimated.getDate() + 5);
  return (
    <div className="flex flex-col rounded-3xl border-[2px] border-border-main overflow-hidden px-main pt-main pb-sm gap-5 bg-white">
      {/* ── Order header ───────────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between flex-wrap gap-main px-md py-main border-b-2 border-border-main transition-colors cursor-pointer overflow-hidden`}
        onClick={() => onOrderClick?.(order)}
      >
        <div className="flex flex-col gap-5 max-w-[50%]">
          <span className="text-[12px] font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
            Delivery Address:
          </span>
          <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em] truncate">
            {address}
          </span>
        </div>

        <div className="flex items-center gap-main">
          {onReorder && (isInventory || showInitiatePayment) && (
            <Button
              variant="tag"
              size="tag"
              className="px-lg!"
              onClick={() => onReorder?.(order)}
              disabled={isReordering}
            >
              {isReordering && <Spinner />}
              {showInitiatePayment ? "Make payment" : "Reorder"}
            </Button>
          )}
          <div className="flex flex-col gap-5 min-w-fit">
            <span className="text-[12px] font-normal tracking-[0.08em] leading-[1.2] text-body uppercase font-mono">
              order date
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {formatOrderDate(order.orderDate ?? order.createdAt)}
            </span>
          </div>
          <div className="hidden sm:block w-[1.38px] h-7 bg-[#D9D9D9]"></div>
          <div className="flex flex-col gap-5 min-w-fit">
            <span className="text-[12px] font-normal tracking-[0.08em] leading-[1.2] text-body uppercase font-mono">
              est. delivery date
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {format(dummyFiveDaysEstimated, "dd/MM/yyyy.")}
            </span>
          </div>
          {showStatus && (
            <div className="hidden sm:block w-[1.38px] h-7 bg-[#D9D9D9] justify-self-center"></div>
          )}
          {showStatus && (
            <div className="flex flex-col flex-1 gap-5 min-w-fit">
              <span className="text-[14px] font-medium tracking-[0.04em] leading-[1.5] text-body">
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
                flex items-start gap-main px-main py-md transition-colors hover:rounded-xl
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
              <div
                className={`flex-shrink-0 ${!isInventory ? "w-[61px] h-[61px]" : "w-[77px] h-[77px]"} rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center text-[10px] text-body-passive font-mono`}
              >
                <AppImage
                  src={(item as any)?.product?.thumbnail}
                  alt={productName}
                  width={!isInventory ? 61 : 77}
                  height={!isInventory ? 61 : 77}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-main min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between w-full gap-5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h5>{productName}</h5>
                    </div>
                    {onReportOutOfStock && (
                      <>
                        {isReportPending ? (
                          <Spinner />
                        ) : (
                          <button
                            type="button"
                            className="cursor-pointer rounded-full p-2 text-brand-primary hover:bg-tag-added disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Item notifications"
                            aria-busy={isReportPending}
                            disabled={isReportPending}
                            onClick={() =>
                              onReportOutOfStock?.(order.id, item.id)
                            }
                          >
                            <BellRing className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}

                    {/* Remove */}
                    {onRemoveItem && order.status === "DRAFT" && (
                      <>
                        {isRemoving ? (
                          <Spinner />
                        ) : (
                          <div
                            className="flex-shrink-0"
                            onClick={() => {
                              onRemoveItem?.(item);
                            }}
                          >
                            <Trash2
                              size={20}
                              className={`text-outline-passive cursor-pointer`}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-3 py-3">
                  <div className="flex gap-sm items-center">
                    {showItemStatus && (
                      <TableTag
                        small
                        className={itemStatusStyles.styles}
                        text={itemStatusStyles.text}
                      />
                    )}
                    <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                      QTY:{" "}
                      <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                      SIZE:{" "}
                      <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                        {item?.product?.packSize?.name ?? "—"}
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
                      TYPE:{" "}
                      <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em]">
                        {item?.product?.packType?.name ?? "—"}
                      </span>
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2]">
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
      {showFooter && (
        <div className="flex justify-between items-end px-md py-lg border-t-2 border-border-main gap-5">
          <div className="flex flex-col gap-5">
            <span className="text-[12px] font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
              ordered no:
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em] uppercase">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-normal tracking-[0.08em] text-body-passive uppercase font-mono">
              amount:
            </span>
            <div className="flex items-center gap-5">
              <h3 className="text-body! flex items-center gap-1">
                <span className="text-[20px]">₦</span>
                {formatCurrency(order.totalAmount ?? order.subtotal ?? 0)}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
