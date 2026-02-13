"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import ProductForm from "@/features/products/components/ProductForm";
import {
  useCreateProduct,
  useDeleteProduct,
  useDeleteMultipleProducts,
  useGetProducts,
  useUpdateProduct,
  useGetProductsStats,
  useUpdateMultipleProductStatus,
} from "@/features/products/services/products.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { ProductItem } from "@/features/products/types";
import FilterContainer from "@/components/filters/FilterContainer";
import StatusFilter from "@/components/filters/StatusFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import TableTag from "@/components/general/TableTag";
import { CloudUpload, SquareStack } from "lucide-react";

const ProductPage = () => {
  const [submitAction, setSubmitAction] = useState<"primary" | "secondary">(
    "primary",
  );
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<
    ProductItem | undefined
  >(undefined);
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[] | []>(
    [],
  );
  const debouncedQuery = useDebounce(query);

  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();
  const { mutateAsync: createProduct, isPending: creating } =
    useCreateProduct();
  const {
    mutateAsync: deleteMultipleProducts,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleProducts();
  const {
    mutateAsync: publishMultipleProducts,
    isPending: publishingMultiple,
    status: publishingStatus,
  } = useUpdateMultipleProductStatus();
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useDeleteProduct();

  const { data: stats, isPending: isStatsPending } = useGetProductsStats();
  const {
    data,
    isPending: isProductsPending,
    isRefetching,
    refetch,
  } = useGetProducts({ search: debouncedQuery, status: statusFilter });
  const products = data?.data;

  const handleCreate = async (values: any) => {
    console.log(values);
    if (selectedProduct) {
      await updateProduct(values);
    } else {
      await createProduct(values);
    }
    // close drawer on success and reset state
    setSubmitAction("primary");
    setOpen(false);
    setSelectedProduct(undefined);
  };

  const handleBulkDelete = async (selectedProducts: ProductItem[]) => {
    const idsToDelete = selectedProducts.map((product) => product?.id);
    await deleteMultipleProducts({ productIds: idsToDelete });
  };

  const handleBulkPublish = async (selectedProducts: ProductItem[]) => {
    const idsToPublish = selectedProducts.map((product) => product?.id);
    const payload = {
      productIds: idsToPublish,
      status: "LIVE"
    };
    await publishMultipleProducts({payload});
  };

  const handleDelete = async () => {
    await deleteProduct({ id: selectedProduct?.id ?? "" });
    setOpen(false);
    setSelectedProduct(undefined);
  };

  const displayStats = [
    {
      value: stats?.totalProducts ? `${stats?.totalProducts}` : "0",
      label: "Products",
    },
    {
      value: stats?.totalVariants ? `${stats?.totalVariants}` : "0",
      label: "Variants",
    },
    { value: stats?.drafts ? `${stats?.drafts}` : "0", label: "Draft" },
    { value: stats?.archived ? `${stats?.archived}` : "0", label: "Archived" },
  ];
  const getTagStyles = (value: string = "DRAFT") => {
    if (value === "QUEUE") {
      return {
        styles: `border-border-brand-stroke bg-tag-added text-brand-primary`,
        text: `Queue`,
      };
    }
    // else if (value === "PROCUREMENT_OFFICER") {
    //   return {
    //     styles: `border-border-accent bg-tag-queue text-brand-signal`,
    //     text: `Procurement`,
    //   };
    // }
    else if (value === "LIVE") {
      return {
        styles: `border-border-main bg-tag-active text-success-500`,
        text: `Live`,
      };
    } else {
      return {
        styles: `border-border-main bg-tag-draft text-body-passive`,
        text: `Draft`,
      };
    }
  };

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: `${selectedProduct ? "Edit" : "Enter"} product details`,
      content: (
        <ProductForm
          product={selectedProduct}
          handleSubmitForm={handleCreate}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
          submitAction={submitAction}
        />
      ),
      ...(selectedProduct
        ? { actionDropdown: <FormDropdown deleteAction={handleDelete} /> }
        : {}),
      statusTag: (
        <TableTag
          className={`${getTagStyles(selectedProduct?.status)?.styles}`}
          text={getTagStyles(selectedProduct?.status)?.text}
        />
      ),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      // heading: "Upload product details",
      content: (
        <CSVUpload
          catalog={"product"}
          onCTAClick={() => setOpen(!open)}
          onDownload={() => {
            console.log("download");
          }}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {isStatsPending ? (
        <StatsSkeleton count={4} />
      ) : (
        <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="Filter">
            <StatusFilter
              isProducts
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
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
              isCustomWidth={true}
              customWidthStyle={
                "aspect-829/959 max-w-md mdl:max-w-md lg:max-w-[829px]"
              }
              customImage={"/dashboard/wide-drawer-top-img.svg"}
              showTrigger
              openDrawer={(isOpen) => {
                if (isOpen) {
                  setSelectedProduct(undefined);
                  setSubmitAction("primary"); // Reset on open
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={"product-form"}
              submitLoading={updating || creating || deleting}
              submitLabel="Queue"
              secondarySubmitLabel="Publish"
              secondarySubmitLoading={updating || creating || deleting}
              submitAction={submitAction}
              onSubmitActionChange={setSubmitAction}
              primaryBtnIcon={
                <SquareStack
                  className="text-secondary"
                  size={17}
                  strokeWidth={2.5}
                />
              }
              secondaryBtnIcon={
                <CloudUpload
                  className="text-outline"
                  size={17}
                  strokeWidth={2.5}
                />
              }
              showFooter
            >
              <DrawerTabs tabs={tabs} />
            </DashboardDrawer>
          </div>
        </div>
        <DataTable
          onRowClick={(row) => {
            setSelectedProduct(row);
            setOpen(!open);
          }}
          withCheckbox
          getRowId={(row) => row.id}
          onSelectionChange={(selectedRows) => {
            setSelectedProducts(selectedRows);
          }}
          onDelete={(selectedRows) => {
            handleBulkDelete(selectedRows);
          }}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          onPublish={(selectedRows) => {
            handleBulkPublish(selectedRows);
          }}
          loading={isProductsPending || isRefetching}
          publishingMultiple={publishingMultiple}
          publishingMultipleStatus={publishingStatus}
          data={products ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Name", activeColor: true },
            {
              key: "subcategory.category.name",
              label: "Category",
            },
            {
              key: "subcategory.name",
              label: "Sub Category",
            },
            {
              key: "brand.name",
              label: "Brand",
            },
            {
              key: "packSize.name",
              label: "Pack Size",
            },
            {
              key: "packType.name",
              label: "Pack Type",
            },
            {
              key: "sku",
              label: "SKU",
              activeColor: true,
            },
            {
              key: "price",
              label: "Price(N)",
              activeColor: true,
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <TableTag
                  className={`${getTagStyles(item?.status)?.styles}`}
                  text={getTagStyles(item?.status)?.text}
                />
              ),
            },
          ]}
          page={page}
          pageSize={20}
          totalCount={data?.meta?.totalItems}
          hasNext={data?.meta?.hasNextPage}
          hasPrevious={data?.meta?.hasPreviousPage}
          onPageChange={setPage}
          header="Create product"
          description="No product record yet. Add records to see product list"
          image={"/dashboard/import-csv.svg"}
          cta="Add Product"
        />
      </div>
    </div>
  );
};

export default ProductPage;
