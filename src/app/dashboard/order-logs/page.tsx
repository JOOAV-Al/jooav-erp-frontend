// "use client";
// import DashboardDrawer from "@/components/general/DashboardDrawer";
// import OrderForm from "@/features/orders/components/OrderForm";
// import {
//   useCreateOrder,
//   useDeleteOrder,
//   useDeleteMultipleOrders,
//   useGetOrders,
//   useGetOrdersStats,
//   useUpdateOrder,
// } from "@/features/orders/services/orders.api";
// import React, { useRef, useState } from "react";
// import { Order } from "@/features/orders/types";
// import FilterContainer from "@/components/filters/FilterContainer";
// // import SearchBox from "@/components/filters/SearchBox";
// import { useDebounce } from "@/hooks/useDebounce";
// import StatsContainer from "@/components/general/StatsContainer";
// import FormDropdown from "@/components/general/FormDropdown";
// import StatsSkeleton from "@/components/general/StatsSkeleton";
// import TableTag from "@/components/general/TableTag";
// import StatusFilter from "@/components/filters/StatusFilter";
// import DrawerBoxContent from "@/components/general/DrawerBoxContent";
// import CopyLinkBox from "@/components/general/CopyLinkBox";
// import GroupedDataTable from "@/components/general/GroupedDataTable";
// import Image from "next/image";
// import { useGetBrands } from "@/features/brands/services/brands.api";
// import { useGetCategories } from "@/features/categories/services/category.api";

// // ─── Role grouping config ─────────────────────────────────────────────────────
// // Order here controls the visual order of the cards on the page.

// const ROLE_GROUPS = [
//   { role: "SUPER_ADMIN", label: "Super-admin accounts" },
//   { role: "ADMIN", label: "Admin accounts" },
//   { role: "PROCUREMENT_OFFICER", label: "Procurement accounts" },
//   { role: "WHOLESALER", label: "Wholesaler accounts" },
// ] as const;

// // ─────────────────────────────────────────────────────────────────────────────

// const OrderLogsPage = () => {
//   const [page, setPage] = useState<number>(1);
//   const [open, setOpen] = useState<boolean>(false);
//   const [query, setQuery] = useState<string>("");
//   const [role, setRole] = useState<string>("");
//   const [resetLink, setResetLink] = useState<string>("");
//   const [showLink, setShowLink] = useState<boolean>(false);
//   const debouncedQuery = useDebounce(query);

//   const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
//     undefined,
//   );
//   const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
//   const ordersFormResetRef = useRef<(() => void) | null>(null);

//   const { mutateAsync: updateOrder, isPending: updating } = useUpdateOrder();
//   const { mutateAsync: createOrder, isPending: creating } = useCreateOrder();
//   const { mutateAsync: deleteOrder, isPending: deleting } = useDeleteOrder();
//   const {
//     mutateAsync: deleteMultipleOrders,
//     isPending: deletingMultiple,
//     status,
//   } = useDeleteMultipleOrders();

//   const { data: stats, isPending: isStatsPending } = useGetOrdersStats();
//   const {
//     data,
//     isPending: isOrdersPending,
//     isRefetching,
//     refetch,
//   } = useGetOrders({
//     search: debouncedQuery,
//     role,
//   });
//   const { data: brands } = useGetBrands({});
//   const { data: categories } = useGetCategories({});

//   const orders: Order[] = data?.data ?? [];

//   // ── Handlers ─────────────────────────────────────────────────────────────────

//   const handleCreate = async (values: any) => {
//     if (selectedOrder) {
//       await updateOrder(values);
//       setOpen(false);
//     } else {
//       const res = await createOrder(values);
//     }
//     setSelectedOrder(undefined);
//   };

//   const handleBulkDelete = async (rows: Order[]) => {
//     await deleteMultipleOrders({ orderIds: rows.map((u) => u.id) });
//   };

//   const handleDelete = async () => {
//     await deleteOrder({ id: selectedOrder?.id ?? "" });
//     setOpen(false);
//     setSelectedOrder(undefined);
//   };

//   // ── Display helpers ───────────────────────────────────────────────────────────

//   const displayStats = [
//     { value: `${stats?.totalOrders ?? 0}`, label: "Orders" },
//     { value: `${stats?.archived ?? 0}`, label: "Archived" },
//   ];

//   const getTagStyles = (value = "ADMIN") => {
//     switch (value) {
//       case "SUPER_ADMIN":
//         return {
//           styles: "border-border-brand-stroke bg-tag-added text-brand-primary",
//           text: "S. admin",
//         };
//       case "PROCUREMENT_OFFICER":
//         return {
//           styles: "border-border-accent bg-tag-queue text-brand-signal",
//           text: "Procurement",
//         };
//       case "WHOLESALER":
//         return {
//           styles: "border-border-main bg-tag-active text-success-500",
//           text: "Wholesaler",
//         };
//       default:
//         return {
//           styles: "border-border-main bg-tag-draft text-body-passive",
//           text: "Admin",
//         };
//     }
//   };

//   // No `label` needed — GroupedDataTable has no column header row
//   const columns = [
//     {
//       key: "avatar",
//       render: (item: Order) => (
//         <div className="w-7.5 h-7.5 flex justify-center items-center rounded-full bg-brand-secondary border border-border-main text-[13px] font-semibold tracking-[0.05] text-brand-accent-2">
//           {`${item?.firstName?.[0] ?? ""}${item?.lastName?.[0] ?? ""}`}
//         </div>
//       ),
//     },
//     { key: "firstName", activeColor: true },
//     { key: "lastName", activeColor: true },
//     { key: "email" },
//     { key: "phone" },
//     {
//       key: "role",
//       render: (item: Order) => (
//         <TableTag
//           className={getTagStyles(item?.role).styles}
//           text={getTagStyles(item?.role).text}
//         />
//       ),
//     },
//   ];

//   // ── Render ────────────────────────────────────────────────────────────────────

//   return (
//     <div className="flex flex-col gap-5">
//       {isStatsPending ? (
//         <StatsSkeleton count={2} />
//       ) : (
//         <StatsContainer stats={displayStats} />
//       )}

//       <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
//         {/* Toolbar */}
//         <div className="flex justify-between flex-wrap gap-6">
//           <FilterContainer label="">
//             <StatusFilter value={role} onChange={setRole} isOrders />
//           </FilterContainer>

//           <div className="flex items-center gap-6 flex-wrap">
//             {/* <SearchBox
//               value={query}
//               onChange={(value) => {
//                 setPage(1);
//                 setQuery(value);
//               }}
//             /> */}

//             <DashboardDrawer
//               isCustomWidth
//               customWidthStyle="aspect-460/958 max-w-md mdl:max-w-md lg:max-w-[460px]"
//               showTrigger={false}
//               openDrawer={(isOpen) => {
//                 setShowLink(false);
//                 if (isOpen) setSelectedOrder(undefined);
//                 setOpen(isOpen);
//               }}
//               isOpen={open}
//               submitFormId="order-form"
//               submitLoading={updating || creating || deleting}
//               submitLabel="Save order"
//               showFooter={!showLink}
//             >
//               <DrawerBoxContent
//                 heading={`${selectedOrder ? "Edit" : "Enter"} order details`}
//                 content={
//                   <OrderForm
//                     product={selectedOrder}
//                     handleSubmitForm={handleCreate}
//                     loading={creating || updating}
//                     closeDialog={() => setOpen(false)}
//                     // submitAction={submitAction}
//                     brands={brands?.data}
//                     categories={categories?.data}
//                     onResetReady={(fn) => {
//                       ordersFormResetRef.current = fn;
//                     }}
//                   />
//                 }
//                 actionDropdown={
//                   <FormDropdown
//                     deleteAction={handleDelete}
//                     // publish={
//                     //   selectedOrder?.status !== "LIVE"
//                     //     ? () => handleStatusChange("LIVE")
//                     //     : undefined
//                     // }
//                     // unpublish={
//                     //   selectedOrder?.status !== "QUEUE"
//                     //     ? () => handleStatusChange("QUEUE")
//                     //     : undefined
//                     // }
//                     onReset={() => ordersFormResetRef.current?.()}
//                   />
//                 }
//                 statusTag={
//                   <TableTag
//                     className={`${getTagStyles(selectedOrder?.status)?.styles}`}
//                     text={getTagStyles(selectedOrder?.status)?.text}
//                   />
//                 }
//               />
//             </DashboardDrawer>
//           </div>
//         </div>

//         {/* Grouped table — replaces all the old DataTable instances */}
//         <GroupedDataTable<Order>
//           groups={groups}
//           columns={columns}
//           loading={isOrdersPending || isRefetching}
//           onRowClick={(row) => {
//             setSelectedOrder(row);
//             setOpen(true);
//           }}
//           withCheckbox
//           getRowId={(row) => row.id}
//           onSelectionChange={setSelectedOrders}
//           onDelete={handleBulkDelete}
//           deletingMultiple={deletingMultiple}
//           deletingMultipleStatus={status}
//           emptyHeader="Create order"
//           emptyDescription="No order record yet. Add records to see order list"
//           emptyImage="/dashboard/import-csv.svg"
//           emptyCta="Add Order"
//           onEmptyCta={refetch}
//         />
//       </div>
//     </div>
//   );
// };

// export default OrderLogsPage;

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
import OrdersGroupedTable, {
  OrderGroup,
} from "@/features/orders/components/OrdersGroupedTable";

// ─── Status label + sort config ───────────────────────────────────────────────
// Labels for known statuses. Unknown statuses are humanised automatically.

const STATUS_LABEL_MAP: Record<string, string> = {
  PENDING: "Pending orders",
  PENDING_APPROVAL: "Awaiting approval",
  ACTIVE: "Active orders",
  SUSPENDED: "Suspended orders",
  BLOCKED: "Blocked orders",
  DEACTIVATED: "Deactivated orders",
};

const STATUS_ORDER = [
  "PENDING",
  "PENDING_APPROVAL",
  "ACTIVE",
  "SUSPENDED",
  "BLOCKED",
  "DEACTIVATED",
];

// ─── Tag styles (drawer header) ───────────────────────────────────────────────

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
        text: status || "—",
      };
  }
};

// ─── Dynamic group builder ────────────────────────────────────────────────────
// Buckets whatever orders the API returns into groups by their actual status.
// No order is ever silently dropped by a hardcoded whitelist.

const buildGroups = (orders: Order[]): OrderGroup[] => {
  const buckets = new Map<string, Order[]>();

  for (const order of orders) {
    const s = order.status ?? "UNKNOWN";
    if (!buckets.has(s)) buckets.set(s, []);
    buckets.get(s)!.push(order);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => {
      const ai = STATUS_ORDER.indexOf(a);
      const bi = STATUS_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .map(([status, data]) => ({
      label:
        STATUS_LABEL_MAP[status] ??
        `${status.charAt(0)}${status.slice(1).toLowerCase().replace(/_/g, " ")} orders`,
      data,
    }));
};

// ─────────────────────────────────────────────────────────────────────────────

const OrderLogsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showLink, setShowLink] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );

  const debouncedQuery = useDebounce(query);
  const ordersFormResetRef = useRef<(() => void) | null>(null);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const { mutateAsync: updateOrder, isPending: updating } = useUpdateOrder();
  const { mutateAsync: createOrder, isPending: creating } = useCreateOrder();
  const { mutateAsync: deleteOrder, isPending: deleting } = useDeleteOrder();
  const {
    mutateAsync: deleteMultipleOrders,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleOrders();

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: stats, isPending: isStatsPending } = useGetOrdersStats();
  const {
    data,
    isPending: isOrdersPending,
    isRefetching,
    refetch,
  } = useGetOrders({ search: debouncedQuery, status: statusFilter });

  const { data: brands } = useGetBrands({});
  const { data: categories } = useGetCategories({});

  // Adjust this path once the BE fixes the response shape
  const orders: Order[] = data?.data?.data ?? [];

  // Groups are derived dynamically — no local filtering, API owns that
  const groups = buildGroups(orders);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCreate = async (values: any) => {
    if (selectedOrder) {
      await updateOrder(values);
      setOpen(false);
    } else {
      await createOrder(values);
    }
    setSelectedOrder(undefined);
  };

  const handleBulkDelete = async (rows: Order[]) => {
    await deleteMultipleOrders({ orderIds: rows.map((o) => o.id) });
  };

  const handleDelete = async () => {
    await deleteOrder({ id: selectedOrder?.id ?? "" });
    setOpen(false);
    setSelectedOrder(undefined);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const displayStats = [
    { value: `${stats?.totalOrders ?? 0}`, label: "Orders" },
    { value: `${stats?.archived ?? 0}`, label: "Archived" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {isStatsPending ? (
        <StatsSkeleton count={2} />
      ) : (
        <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        {/* Toolbar */}
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="">
            <StatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
              isOrders
            />
          </FilterContainer>

          <div className="flex items-center gap-6 flex-wrap">
            <DashboardDrawer
              isCustomWidth={true}
              customWidthStyle={
                "aspect-829/959 max-w-md mdl:max-w-md lg:max-w-[829px]"
              }
              customImage={"/dashboard/wide-drawer-top-img.svg"}
              showTrigger={false}
              openDrawer={(isOpen) => {
                setShowLink(false);
                if (isOpen) setSelectedOrder(undefined);
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId="order-form"
              submitLoading={updating || creating || deleting}
              submitLabel="Save order"
              showFooter={!showLink}
            >
              <DrawerBoxContent
                heading={`${selectedOrder ? "Edit" : "Enter"} order details`}
                content={
                  <OrderForm
                    product={selectedOrder as any}
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

        {/* Orders grouped table */}
        <OrdersGroupedTable
          groups={groups}
          loading={isOrdersPending || isRefetching}
          onOrderClick={handleOrderClick}
          onDelete={handleBulkDelete}
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