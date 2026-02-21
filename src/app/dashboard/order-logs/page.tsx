"use client";

import DashboardDrawer from "@/components/general/DashboardDrawer";
import OrderForm from "@/features/orders/components/OrderForm";
import {
  useCreateOrder,
  useDeleteOrder,
  useDeleteMultipleOrders,
  useGetOrders,
  useGetOrdersStats,
  useUpdateOrder,
  useUpdateOrderItemStatus,
} from "@/features/orders/services/orders.api";
import React, { useRef, useState } from "react";
import { Order, OrderItem } from "@/features/orders/types";
import FilterContainer from "@/components/filters/FilterContainer";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import StatusFilter from "@/components/filters/StatusFilter";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import TableTag from "@/components/general/TableTag";
import { useGetBrands } from "@/features/brands/services/brands.api";
import { useGetCategories } from "@/features/categories/services/category.api";
import OrdersGroupedTable from "@/features/orders/components/OrdersGroupedTable";
import SearchBox from "@/components/filters/SearchBox";

const getOrderStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return {
        styles: "border-green-200 bg-green-50 text-green-600",
        text: "Active",
      };
    case "PENDING":
    case "PENDING_APPROVAL":
      return {
        styles: "border-orange-200 bg-orange-50 text-orange-500",
        text: "Pending",
      };
    case "SUSPENDED":
    case "BLOCKED":
      return { styles: "border-red-200 bg-red-50 text-red-500", text: status };
    case "DEACTIVATED":
      return {
        styles: "border-border-main bg-tag-draft text-body-passive",
        text: "Deactivated",
      };
    default:
      return {
        styles: "border-border-main bg-tag-draft text-body-passive",
        text: status || "Draft",
      };
  }
};

const OrderLogsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  // const [showLink, setShowLink] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | undefined>(
    undefined,
  );

  const debouncedQuery = useDebounce(query);
  const ordersFormResetRef = useRef<(() => void) | null>(null);

  const { mutateAsync: updateOrder, isPending: updating } = useUpdateOrder();
  const { mutateAsync: createOrder, isPending: creating } = useCreateOrder();
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

  const { data: brands } = useGetBrands({});
  const { data: categories } = useGetCategories({});

  const orders: Order[] = data?.data?.orders ?? [];

  const handleCreate = async (values: any) => {
    if (selectedOrder) {
      await updateOrder(values);
      setOpen(false);
    } else {
      await createOrder(values);
    }
    setSelectedOrder(undefined);
    setSelectedOrderItem(undefined);
  };

  const handleUpdateOrderItemStatus = async (
    status: string,
    itemId: string,
  ) => {
    await updateItemStatus({
      orderNumber: selectedOrder?.orderNumber ?? "",
      id: itemId,
      payload: {
        status,
        processingNotes: "",
      },
    });
    setSelectedOrder(undefined);
  };

  const handleDelete = async () => {
    await deleteOrder({ id: selectedOrder?.id ?? "" });
    setOpen(false);
    setSelectedOrder(undefined);
    setSelectedOrderItem(undefined);
  };

  const displayStats = [
    { value: `${stats?.totalOrders ?? 0}`, label: "Orders" },
    { value: `${stats?.archived ?? 0}`, label: "Archived" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {isStatsPending ? (
        <StatsSkeleton count={2} />
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
              // isCustomWidth
              // customWidthStyle="aspect-829/959 max-w-md mdl:max-w-md lg:max-w-[829px]"
              // customImage="/dashboard/wide-drawer-top-img.svg"
              showTrigger
              triggerText="Create Order"
              openDrawer={(isOpen) => {
                // setShowLink(false);
                if (isOpen) {
                  setSelectedOrder(undefined);
                  setSelectedOrderItem(undefined);
                } 
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId="order-form"
              submitLoading={updating || creating || deleting}
              submitLabel="Save order"
              // showFooter={!showLink}
            >
              <DrawerBoxContent
                heading={`${selectedOrderItem ? "Update item" : "New order"} details`}
                content={
                  <OrderForm
                    product={selectedOrderItem as any}
                    handleSubmitForm={handleCreate}
                    loading={creating || updating}
                    closeDialog={() => setOpen(false)}
                    brands={brands?.data}
                    categories={categories?.data}
                    onResetReady={(fn) => {
                      ordersFormResetRef.current = fn;
                    }}
                  />
                }
                actionDropdown={
                  <FormDropdown
                    deleteAction={handleDelete}
                    onMarkItemPending={() =>
                      handleUpdateOrderItemStatus("PENDING", selectedOrderItem?.id ?? "")
                    }
                    onMarkItemCancelled={() =>
                      handleUpdateOrderItemStatus("CANCELLED", selectedOrderItem?.id ?? "")
                    }
                    onMarkItemComplete={() =>
                      handleUpdateOrderItemStatus("DELIVERED", selectedOrderItem?.id ?? "")
                    }
                    onMarkItemInProgress={() =>
                      handleUpdateOrderItemStatus("SOURCING", selectedOrderItem?.id ?? "")
                    }
                    onReset={() => ordersFormResetRef.current?.()}
                  />
                }
                statusTag={
                  <TableTag
                    className={
                      getOrderStatusStyles(selectedOrder?.status).styles
                    }
                    text={getOrderStatusStyles(selectedOrder?.status).text}
                  />
                }
              />
            </DashboardDrawer>
          </div>
        </div>

        <OrdersGroupedTable
          orders={orders}
          loading={isOrdersPending || isRefetching}
          onOrderClick={(order) => {
            setSelectedOrder(order);
            // setOpen(true);
          }}
          onOrderItemClick={(orderItem) => {
            setSelectedOrderItem(orderItem);
            setOpen(true);
          }}
          onDelete={(rows) =>
            deleteMultipleOrders({ orderIds: rows.map((o) => o.id) })
          }
          onMarkItemPending={(item) =>
            handleUpdateOrderItemStatus("PENDING", item?.id)
          }
          onMarkItemCancelled={(item) =>
            handleUpdateOrderItemStatus("CANCELLED", item?.id)
          }
          onMarkItemComplete={(item) =>
            handleUpdateOrderItemStatus("DELIVERED", item?.id)
          }
          onMarkItemInProgress={(item) =>
            handleUpdateOrderItemStatus("SOURCING", item?.id)
          }
          actionLoading={updatingItem}
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
