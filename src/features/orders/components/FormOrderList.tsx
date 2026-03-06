"use client";

import Image from "next/image";
import { Order, OrderItem } from "@/features/orders/types";
import {
  formatCurrency,
  formatOrderDate,
  getItemStatusStyles,
} from "@/lib/utils";
import { InitialsAvatar } from "@/features/orders/components/OrderCard";
import { useGetOrderDetails } from "@/features/orders/services/orders.api";
import { X } from "lucide-react";
// import OrderCardSkeleton from "@/features/orders/components/OrderCardSkeleton";
import Spinner from "@/components/general/Spinner";

interface FormOrderListProps {
  order: Order;
  orderNumber?: string;
  onRemoveItem?: (item: OrderItem) => void;
}

const FormOrderList = ({ order, orderNumber, onRemoveItem }: FormOrderListProps) => {
  console.log(order)
  const { data, isPending } = useGetOrderDetails({
    orderNumber: orderNumber ?? "",
  });
  const items = data?.data?.items ?? [];
  const dynamicOrder = data?.data

  const wholesaler =
    (dynamicOrder?.wholesaler?.firstName ?? "") +
    " " +
    (dynamicOrder?.wholesaler?.lastName ?? "");

  const address = dynamicOrder?.deliveryAddress
    ? [
        dynamicOrder?.deliveryAddress.address,
        dynamicOrder?.deliveryAddress.city,
        dynamicOrder?.deliveryAddress.state,
      ]
        .filter(Boolean)
        .join(", ")
    : "—";

  if (isPending) {
    return (
      <div className="flex flex-col flex-1 gap-main justify-center items-center h-50">
        {/* <OrderCardSkeleton itemCount={3} /> */}
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-5 py-main">
      {/* ── Order meta ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col border-y-[2px] border-border-main">
        <div className="flex flex-col gap-5 py-main border-b-[2px] border-border-main">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-lg gap-y-sm py-xl">
          <div className="flex flex-col gap-5">
            <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
              Delivery Address:
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {address}
            </span>
          </div>
          <div className="flex flex-col gap-5 lg:text-end">
            <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
              Ordered On:
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {formatOrderDate(
                dynamicOrder?.orderDate ?? dynamicOrder?.createdAt ?? "-",
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ── Items list ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col py-sm gap-6 overflow-hidden">
        {items.map((item, idx) => {
          const statusStyles = getItemStatusStyles(item.status);
          const isLast = idx === items.length - 1;

          return (
            <div
              key={item.id}
              // onClick={() => onOrderItemClick?.(item, order)}
              className={`flex items-start gap-main py-4 transition-colors ${isLast ? "" : "border-b border-border-main"}`}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-[106px] h-[106px] rounded-lg border-[1.5px] border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                {(item as any)?.product?.thumbnail &&
                (item as any)?.product?.thumbnail?.startsWith("https://") ? (
                  <Image
                    src={(item as any)?.product?.thumbnail}
                    alt={item?.product?.name}
                    width={106}
                    height={106}
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
                    <h5>{item?.product?.name}</h5>
                  </div>

                  {/* Item status dropdown */}
                  <div
                    className="flex-shrink-0"
                    onClick={() => onRemoveItem?.(item)}
                  >
                    <X size={20} className={`text-outline-passive cursor-pointer`} />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div className="flex border-b border-border-main py-sm gap-main">
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
                  </div>
                  <div className="flex py-sm gap-main">
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
            </div>
          );
        })}
      </div>

      {/* ── Total ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-5 p-md border-y-[2px] border-border-main">
        <span className="text-[13px] font-mono text-body uppercase tracking-[0.08]">
          Amount:
        </span>
        <div className="flex items-center gap-1">
          <Image src="/dashboard/N.svg" width={16} height={16} alt="Naira" />
          <h3 className="text-body!">
            {formatCurrency(
              dynamicOrder?.totalAmount ?? dynamicOrder?.subtotal ?? 0,
            )}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FormOrderList;
