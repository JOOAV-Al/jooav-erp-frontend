"use client";

import DashboardDrawer from "@/components/general/DashboardDrawer";
import OrderForm from "@/features/orders/components/OrderForm";
import {
  useCreateDraftOrder,
  useDeleteOrder,
  useDeleteMultipleOrders,
  useGetOrders,
  useGetOrdersStats,
  useInitiateOrderPayment,
  useUpdateDraftOrder,
  useUpdateOrderItemStatus,
  useReInitiateOrderPayment,
  useGetOrderDetails,
  useConfirmOrderPayment,
} from "@/features/orders/services/orders.api";
import React, { useRef, useState } from "react";
import {
  CreateOrderPayload,
  Order,
  OrderItem,
  OrderVirtualAccount,
} from "@/features/orders/types";
import FilterContainer from "@/components/filters/FilterContainer";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import StatusFilter from "@/components/filters/StatusFilter";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import TableTag from "@/components/general/TableTag";
import { useGetProducts } from "@/features/products/services/products.api";
import { useGetUsers } from "@/features/users/services/users.api";
import OrdersGroupedTable from "@/features/orders/components/OrdersGroupedTable";
import SearchBox from "@/components/filters/SearchBox";
import { getItemStatusStyles, getOrderStatusStyles } from "@/lib/utils";
import PaymentScreen from "@/features/orders/components/PaymentScreen";
import FormOrderList from "@/features/orders/components/FormOrderList";

// ─── Drawer view states ───────────────────────────────────────────────────────
// "form"        → OrderForm (create brand new / add item to draft / edit draft item / view non-draft item)
// "order-list"  → FormOrderList (review items, add more, proceed to payment)
// "payment"     → PaymentScreen (virtual account details)
type DrawerView = "form" | "order-list" | "payment";

const PAYMENT_PENDING_STATUSES = ["PENDING_PAYMENT", "CONFIRMED"];

const OrderLogsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [drawerView, setDrawerView] = useState<DrawerView>("form");
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentObject, setPaymentObject] = useState<
    OrderVirtualAccount | undefined
  >(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );
  const [dynamicOrderNumber, setDynamicOrderNumber] = useState<
    string | undefined
  >(selectedOrder?.orderNumber ?? "");
  const [selectedOrderItem, setSelectedOrderItem] = useState<
    OrderItem | undefined
  >(undefined);

  const debouncedQuery = useDebounce(query);
  const ordersFormResetRef = useRef<(() => void) | null>(null);

  const { mutateAsync: createDraftOrder, isPending: creating } =
    useCreateDraftOrder();
  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();
  const { mutateAsync: initiatePayment, isPending: initiatingPayment } =
    useInitiateOrderPayment();
  const { mutateAsync: reInitiatePayment, isPending: reInitiatingPayment } =
    useReInitiateOrderPayment();
  const {
    mutateAsync: confirmPayment,
    isPending: isPaymentConfirmationPending,
  } = useConfirmOrderPayment();
  const { mutateAsync: deleteOrder, isPending: deleting } = useDeleteOrder();
  const { mutateAsync: updateItemStatus, isPending: updatingItem } =
    useUpdateOrderItemStatus();
  const {
    mutateAsync: deleteMultipleOrders,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleOrders();

  const { data: stats, isPending: isStatsPending } = useGetOrdersStats();
  const {
    data,
    isPending: isOrdersPending,
    isRefetching,
    refetch,
  } = useGetOrders({ page, search: debouncedQuery, status: statusFilter });
  // const { data: singleOrder, isPending, refetch: refetchSingleOrder } = useGetOrderDetails({
  //   orderNumber: selectedOrder?.orderNumber ?? "",
  // });

  const { data: products } = useGetProducts({ status: "LIVE" });
  const { data: wholesalers } = useGetUsers({ role: "WHOLESALER" });
  const { data: officers } = useGetUsers({ role: "PROCUREMENT_OFFICER" });

  const orders: Order[] = data?.data?.orders ?? [];

  // ── Status helpers ─────────────────────────────────────────────────────────

  const isDraft = (order?: Order) => order?.status === "DRAFT";
  const isPaymentPending = (order?: Order) =>
    PAYMENT_PENDING_STATUSES.includes(order?.status ?? "");
  const isReadOnly = (order?: Order) =>
    !!order && !isDraft(order) && !isPaymentPending(order);

  // ── Derive form mode from current state ───────────────────────────────────
  // "create"  → no existing order, brand new
  // "add"     → existing draft, adding a new item (no selectedOrderItem)
  // "update"  → existing draft, editing an existing item
  // "view"    → non-draft order item, all fields disabled, no footer
  const formMode = (() => {
    if (drawerView !== "form") return null;
    if (!selectedOrder?.id) return "create" as const;
    if (selectedOrder.status !== "DRAFT") return "view" as const;
    if (selectedOrderItem?.id) return "update" as const;
    return "add" as const;
  })();

  // ── Drawer footer config ───────────────────────────────────────────────────

  const showDrawerFooter = (() => {
    if (drawerView === "payment") return false;
    if (drawerView === "order-list") {
      // Only show footer when there are actions to take
      return isDraft(selectedOrder) || isPaymentPending(selectedOrder);
    }
    // form view: hide footer only when viewing a non-draft item
    return formMode !== "view";
  })();

  // Primary button label per view
  const primaryLabel = (() => {
    if (drawerView === "form") return "Save entry";
    if (drawerView === "order-list") return "Proceed to payment";
    return undefined;
  })();

  // Secondary button label — "Add item" only on order-list for a draft
  const secondaryLabel = (() => {
    if (drawerView === "order-list" && isDraft(selectedOrder))
      return "Add new item";
    return undefined;
  })();

  // Primary button should submit the form when on form view,
  // or fire handleProceedToPayment directly when on order-list view.
  // We use submitFormId for form submission and onPrimaryAction for direct calls.
  const submitFormId =
    drawerView === "form" && formMode !== "view" ? "order-form" : undefined;

  // ── Reset ──────────────────────────────────────────────────────────────────

  const resetDrawer = () => {
    setSelectedOrder(undefined);
    setDynamicOrderNumber(undefined);
    setSelectedOrderItem(undefined);
    setDrawerView("form");
    setPaymentObject(undefined);
  };

  // ── Save entry (form submit) ───────────────────────────────────────────────

  const handleSaveEntry = async (values: any) => {
    let updatedOrder: Order | undefined;

    if (formMode === "create") {
      // Brand new order — POST /orders
      const res = await createDraftOrder(values);
      if (res.data.status === "success") {
        updatedOrder = res.data?.data?.order;
      }
    } else {
      // "add" or "update" — PATCH /orders/:id
      const res = await updateDraftOrder({
        payload: values,
        id: selectedOrder!.orderNumber,
      });
      if (res.data.status === "success") {
        updatedOrder = res.data?.data?.order ?? selectedOrder;
      }
    }

    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
      setDynamicOrderNumber(updatedOrder?.orderNumber);
      // refetchSingleOrder()
      setSelectedOrderItem(undefined);
      setDrawerView("order-list");
    }
  };

  const handleRemoveItem = async (item: OrderItem) => {
    if (!item) return;
    const { product, quantity } = item;
    const payload: CreateOrderPayload = {
      item: {
        productId: product?.id,
        itemId: item?.id,
        quantity,
        action: "REMOVE",
      },
    };

    await updateDraftOrder({
      payload,
      id: selectedOrder!.orderNumber,
    });
  };

  // ── Proceed to payment (primary on order-list) ────────────────────────────

  const handleProceedToPayment = async () => {
    if (!selectedOrder) return;

    // Check if a previous checkout URL exists and is still valid
    const now = new Date();
    const expiresAt = selectedOrder.paymentExpiresAt
      ? new Date(selectedOrder.paymentExpiresAt)
      : null;
    const isExpired = !expiresAt || expiresAt <= now;
    const hasValidCheckout = !!selectedOrder.checkoutUrl && !isExpired;

    if (hasValidCheckout) {
      console.log(selectedOrder);
      // Still valid — skip re-initiation, show existing virtual accounts
      setPaymentObject(selectedOrder?.virtualAccounts?.[0]);
      setDrawerView("payment");
      return;
    }

    // Expired or never initiated — call initiate-payment endpoint
    const res =
      selectedOrder?.status === "DRAFT"
        ? await initiatePayment({
            orderNumber: selectedOrder.orderNumber,
          })
        : await reInitiatePayment({
            orderNumber: selectedOrder.orderNumber,
          });
    // if (selectedOrder?.status === "DRAFT") {
    //   const res = await initiatePayment({
    //     orderNumber: selectedOrder.orderNumber,
    //   });
    //   setPaymentObject(
    //     res.data.data?.virtualAccounts ?? selectedOrder.virtualAccounts,
    //   );
    //   setDrawerView("payment");
    //   return;
    // }

    // const res = await reInitiatePayment({
    //   orderNumber: selectedOrder.orderNumber,
    // });

    if (res.data.status === "success") {
      // Use fresh virtual accounts from response; fall back to existing ones
      setPaymentObject(
        res.data.data?.virtualAccounts?.[0] ??
          selectedOrder?.virtualAccounts?.[0],
      );
      // Sync updated order data (new paymentExpiresAt, checkoutUrl)
      //TODO: Important!! to sync state and do a refresh on the FormOrderList
      setSelectedOrder(res.data.data?.order ?? selectedOrder);
      setDynamicOrderNumber(
        res.data.data?.order?.orderNumber ?? selectedOrder?.orderNumber,
      );
      setDrawerView("payment");
    }
  };

  // ── Add item (secondary on order-list, draft only) ────────────────────────

  const handleAddItem = () => {
    setSelectedOrderItem(undefined);
    setDrawerView("form");
  };

  // ── Item status updates ────────────────────────────────────────────────────

  const handleUpdateOrderItemStatus = async (
    status: string,
    itemId: string,
    orderNumber: string,
  ) => {
    await updateItemStatus({
      orderNumber,
      id: itemId,
      payload: { status, processingNotes: "" },
    });
    setSelectedOrder(undefined);
    setDynamicOrderNumber(undefined);
  };

  const handleDelete = async () => {
    await deleteOrder({ id: selectedOrder?.id ?? "" });
    setOpen(false);
    resetDrawer();
  };

  const handleConfirmPayment = async () => {
    const res = await confirmPayment({ orderNumber: dynamicOrderNumber ?? "" });
    console.log(res);
    setOpen(false)
    resetDrawer()
  };

  // ── Row click handlers ─────────────────────────────────────────────────────

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setDynamicOrderNumber(order?.orderNumber);
    setSelectedOrderItem(undefined);
    setDrawerView("order-list"); // all statuses open order-list
    setOpen(true);
  };

  const handleOrderItemClick = (item: OrderItem, order: Order) => {
    setSelectedOrderItem(item);
    setSelectedOrder(order);
    setDynamicOrderNumber(order?.orderNumber);
    setDrawerView("form"); // draft = editable fields, others = all disabled
    setOpen(true);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const displayStats = [
    { value: `${stats?.totalOrders ?? 0}`, label: "Orders" },
    { value: `${stats?.summary?.activeOrders ?? 0}`, label: "Active" },
    { value: `${stats?.summary?.completedOrders ?? 0}`, label: "Completed" },
    { value: `${stats?.statusBreakdown?.confirmed ?? 0}`, label: "Pending" },
    { value: `${stats?.summary?.cancelledOrders ?? 0}`, label: "Cancelled" },
  ];

  return (
    <div className="flex flex-col gap-5 pb-main">
      {isStatsPending ? (
        <StatsSkeleton count={5} />
      ) : (
        <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="">
            <StatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
              isOrders
            />
          </FilterContainer>

          <div className="flex items-center gap-6 flex-wrap">
            <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            />
            <DashboardDrawer
              showTrigger
              triggerText="Create Order"
              openDrawer={(isOpen) => {
                if (isOpen) resetDrawer();
                setOpen(isOpen);
              }}
              isOpen={open}
              // Binds primary button to form submit when on form view
              submitFormId={submitFormId}
              // Fires directly when on order-list (no form to submit)
              onPrimaryAction={
                drawerView === "order-list" ? handleProceedToPayment : undefined
              }
              // Secondary fires "Add item" on order-list for drafts
              onSecondaryAction={
                drawerView === "order-list" && isDraft(selectedOrder)
                  ? handleAddItem
                  : undefined
              }
              submitLoading={
                creating ||
                updating ||
                deleting ||
                initiatingPayment ||
                reInitiatingPayment
              }
              secondarySubmitLoading={false}
              submitLabel={primaryLabel}
              secondarySubmitLabel={secondaryLabel}
              showSecondaryButton={!!secondaryLabel}
              showFooter={showDrawerFooter}
              showHeader={drawerView !== "payment"}
            >
              {/* ── Payment screen ─────────────────────────────────────── */}
              {drawerView === "payment" && (
                <DrawerBoxContent
                  content={
                    <PaymentScreen
                      virtualAccount={paymentObject}
                      orderNumber={dynamicOrderNumber ?? ""}
                      loading={isPaymentConfirmationPending}
                      onConfirmPayment={handleConfirmPayment}
                    />
                  }
                />
              )}

              {/* ── Order list ─────────────────────────────────────────── */}
              {drawerView === "order-list" && selectedOrder && (
                <DrawerBoxContent
                  heading="Order details"
                  content={
                    <FormOrderList
                      order={selectedOrder}
                      orderNumber={dynamicOrderNumber}
                      // isPending={isPending}
                      onRemoveItem={handleRemoveItem}
                    />
                  }
                  // actionDropdown={
                  //   isReadOnly(selectedOrder) ? (
                  //     <FormDropdown
                  //       heading="Order actions"
                  //       onMarkItemPending={() =>
                  //         handleUpdateOrderItemStatus(
                  //           "PENDING",
                  //           selectedOrderItem?.id ?? "",
                  //           selectedOrder.orderNumber,
                  //         )
                  //       }
                  //       onMarkItemCancelled={() =>
                  //         handleUpdateOrderItemStatus(
                  //           "CANCELLED",
                  //           selectedOrderItem?.id ?? "",
                  //           selectedOrder.orderNumber,
                  //         )
                  //       }
                  //       onMarkItemComplete={() =>
                  //         handleUpdateOrderItemStatus(
                  //           "DELIVERED",
                  //           selectedOrderItem?.id ?? "",
                  //           selectedOrder.orderNumber,
                  //         )
                  //       }
                  //       onMarkItemInProgress={() =>
                  //         handleUpdateOrderItemStatus(
                  //           "SOURCING",
                  //           selectedOrderItem?.id ?? "",
                  //           selectedOrder.orderNumber,
                  //         )
                  //       }
                  //     />
                  //   ) : undefined
                  // }
                  statusTag={
                    <TableTag
                      small
                      className={
                        getOrderStatusStyles(selectedOrder.status).styles
                      }
                      text={getOrderStatusStyles(selectedOrder.status).text}
                    />
                  }
                />
              )}

              {/* ── Order form ─────────────────────────────────────────── */}
              {drawerView === "form" && (
                <DrawerBoxContent
                  heading={
                    formMode === "create"
                      ? "New order details"
                      : formMode === "update"
                        ? "Update item"
                        : formMode === "add"
                          ? "Add item"
                          : "Order item details"
                  }
                  content={
                    <OrderForm
                      order={selectedOrder as any}
                      orderItem={selectedOrderItem as any}
                      handleSubmitForm={handleSaveEntry}
                      loading={creating || updating}
                      closeDialog={() => setOpen(false)}
                      products={products?.data}
                      wholesalers={wholesalers?.data}
                      onResetReady={(fn) => {
                        ordersFormResetRef.current = fn;
                      }}
                      formMode={formMode}
                    />
                  }
                  actionDropdown={
                    selectedOrderItem && isDraft(selectedOrder) ? (
                      <FormDropdown
                        heading="Select item status"
                        onMarkItemPending={() =>
                          handleUpdateOrderItemStatus(
                            "PENDING",
                            selectedOrderItem.id,
                            selectedOrder?.orderNumber ?? "",
                          )
                        }
                        onMarkItemCancelled={() =>
                          handleUpdateOrderItemStatus(
                            "CANCELLED",
                            selectedOrderItem.id,
                            selectedOrder?.orderNumber ?? "",
                          )
                        }
                        onMarkItemComplete={() =>
                          handleUpdateOrderItemStatus(
                            "DELIVERED",
                            selectedOrderItem.id,
                            selectedOrder?.orderNumber ?? "",
                          )
                        }
                        onMarkItemInProgress={() =>
                          handleUpdateOrderItemStatus(
                            "SOURCING",
                            selectedOrderItem.id,
                            selectedOrder?.orderNumber ?? "",
                          )
                        }
                      />
                    ) : undefined
                  }
                  statusTag={
                    selectedOrderItem ? (
                      <TableTag
                        small
                        className={
                          getItemStatusStyles(selectedOrderItem.status).styles
                        }
                        text={
                          getItemStatusStyles(selectedOrderItem.status).text
                        }
                      />
                    ) : selectedOrder ? (
                      <TableTag
                        small
                        className={
                          getOrderStatusStyles(selectedOrder.status).styles
                        }
                        text={getOrderStatusStyles(selectedOrder.status).text}
                      />
                    ) : undefined
                  }
                />
              )}
            </DashboardDrawer>
          </div>
        </div>

        <OrdersGroupedTable
          orders={orders}
          officers={officers?.data}
          loading={isOrdersPending || isRefetching}
          onOrderClick={handleOrderClick}
          onOrderItemClick={handleOrderItemClick}
          onDelete={(rows) =>
            deleteMultipleOrders({ orderIds: rows.map((o) => o.id) })
          }
          onMarkItemPending={(item, order) =>
            handleUpdateOrderItemStatus("PENDING", item.id, order.orderNumber)
          }
          onMarkItemCancelled={(item, order) =>
            handleUpdateOrderItemStatus("CANCELLED", item.id, order.orderNumber)
          }
          onMarkItemComplete={(item, order) =>
            handleUpdateOrderItemStatus("DELIVERED", item.id, order.orderNumber)
          }
          onMarkItemInProgress={(item, order) =>
            handleUpdateOrderItemStatus("SOURCING", item.id, order.orderNumber)
          }
          actionLoading={updatingItem}
          showActions
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          emptyHeader="No orders yet"
          emptyDescription="No order records yet. Orders will appear here once placed."
          emptyImage="/dashboard/import-csv.svg"
          emptyCta="Refresh"
          onEmptyCta={refetch}
        />
      </div>
    </div>
  );
};

export default OrderLogsPage;
