import EmptyState from "@/components/general/EmptyState";
import TableTag from "@/components/general/TableTag";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InitialsAvatar } from "@/features/orders/components/OrderCard";
import { Order } from "@/features/orders/types";
import {
  formatCurrency,
  formatOrderDate,
  getOrderStatusStyles,
} from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DashboardActiveOrders = ({
  orders,
  onOrderClick,
}: {
  orders?: Order[];
  onOrderClick?: (order: Order) => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full">
      {orders && orders?.length > 0 ? (
        <div className="flex flex-col gap-3 h-full">
          <div className="flex justify-between items-center py-sm px-lg border-b border-border-main">
            <h4>Active orders</h4>
            <div
              onClick={() => {
                router.push(`/dashboard/order-logs`);
              }}
              className="py-sm rounded-lg cursor-pointer hover:underline"
            >
              <span className="py-4 px-2 text-body-passive tracking-[0.02em] font-semibold text-[15px]">
                View order
              </span>
            </div>
          </div>
          <ScrollArea isSidebar className="h-[70vh]">
            <div className="px-md flex flex-col gap-5 flex-1">
              {orders?.map((order, idx) => {
                const wholesaler =
                  (order.wholesaler?.firstName ?? "") +
                  " " +
                  (order.wholesaler?.lastName ?? "");

                const orderStatusStyles = getOrderStatusStyles(order.status);
                const isLast = idx === orders.length - 1;
                const thumbnail = order?.items?.[0]?.product?.thumbnail;
                const itemName = order?.items?.[0]?.product?.name;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-1 lg:grid-cols-6 align-top gap-5 p-md ${isLast ? "" : "border-b border-border-main"} cursor-pointer hover:bg-storey-foreground rounded-2xl transition-colors`}
                    onClick={() => onOrderClick?.(order)}
                  >
                    {/* Order number + status */}
                    <div className="flex flex-col col-span-2 gap-5">
                      <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                        Order No.
                      </span>
                      <div className="flex gap-5 items-center">
                        <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em] text-nowrap">
                          {order?.orderNumber}
                        </span>
                        <TableTag
                          small
                          className={orderStatusStyles.styles}
                          text={orderStatusStyles.text}
                        />
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex flex-col gap-5">
                      <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                        Items
                      </span>
                      <div className="flex gap-[6px] items-center">
                        <div className="flex-shrink-0 w-[24px] h-[24px] rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                          {thumbnail && thumbnail?.startsWith("https://") ? (
                            <Image
                              src={thumbnail}
                              alt={itemName}
                              width={24}
                              height={24}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-storey-foreground flex items-center justify-center text-[10px] text-body-passive font-mono">
                              IMG
                            </div>
                          )}
                        </div>
                        <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                          {order?.items?.length ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Delivery date */}
                    <div className="flex flex-col gap-5">
                      <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                        Delivery Date
                      </span>
                      <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                        {format(
                          order.orderDate ?? order.createdAt,
                          "dd/MM/yyyy.",
                        )}
                      </span>
                      {/* <div className="lg:ml-auto">
                      <TableTag
                        small
                        className={orderStatusStyles.styles}
                        text={orderStatusStyles.text}
                      />
                    </div> */}
                    </div>

                    {/* Ordered For */}
                    <div className="flex flex-col gap-5">
                      <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                        Ordered For
                      </span>
                      <div className="flex items-center gap-5">
                        <InitialsAvatar name={wholesaler || "—"} />
                        <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em] text-nowrap">
                          {wholesaler || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:ml-auto">
                      <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                        Order Amount
                      </span>
                      <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em] lg:ml-auto">
                        {formatCurrency(
                          order.totalAmount ?? order?.subtotal ?? 0,
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <EmptyState
            header="No order summaries"
            description="You will see a summary of recent orders here once order are initiated."
          />
        </div>
      )}
    </div>
  );
};

export default DashboardActiveOrders;
