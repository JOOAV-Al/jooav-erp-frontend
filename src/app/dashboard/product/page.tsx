"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import ProductForm from "@/features/products/components/ProductForm";
import {
  useCreateProduct,
  useGetProducts,
  useUpdateProduct,
} from "@/features/products/services/products.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { ProductItem } from "@/features/products/types";
import FilterContainer from "@/components/filters/FilterContainer";
import AllFilter from "@/components/filters/AllFilter";
import SortFilter from "@/components/filters/SortFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";

const ProductPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();
  const { mutateAsync: createProduct, isPending: creating } =
    useCreateProduct();
  const [selectedProduct, setSelectedProduct] = useState<
    ProductItem | undefined
  >(undefined);
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[] | []>(
    []
  );
  const debouncedQuery = useDebounce(query);

  const {
    data,
    isPending: isProductsPending,
    isRefetching,
    refetch,
  } = useGetProducts({ search: debouncedQuery, sortOrder });

  const products = data?.data;

  const handleCreate = async (values: any) => {
    if (selectedProduct) {
      await updateProduct(values);
    } else {
      await createProduct(values);
    }
    // close drawer on success
    setOpen(false);
    setSelectedProduct(undefined);
  };

  const handleBulkDelete = async (
    selectedProducts: ProductItem[]
  ) => {
    console.log({ selectedProducts });
  };

  const stats = [
    { value: "200", label: "Total Products" },
    { value: "10", label: "In Draft" },
    { value: "190", label: "Total Published" },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: "Enter product details",
      content: (
        <ProductForm
          product={selectedProduct}
          handleSubmitForm={handleCreate}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
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
      {products && products?.length > 0 && <StatsContainer stats={stats} />}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="Filter">
            <AllFilter />
            <SortFilter
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
            />
          </FilterContainer>
          <div className="flex items-center gap-6">
            <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            />
            <DashboardDrawer
              showTrigger
              openDrawer={(isOpen) => {
                if (isOpen) {
                  setSelectedProduct(undefined);
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={"product-form"}
              submitLoading={updating || creating}
              submitLabel="Save record"
              children={<DrawerTabs tabs={tabs} />}
              showFooter
            />
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
            console.log("Selected rows:", selectedRows);
            setSelectedProducts(selectedRows);
          }}
          onDelete={(selectedRows) => {
            console.log("Delete these:", selectedRows);
            // Call your delete API here
            handleBulkDelete(selectedRows);
          }}
          loading={isProductsPending || isRefetching}
          data={products ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Product" },
            {
              key: "brand.name",
              label: "Brand Name",
            },
            {
              key: "sku",
              label: "SKU",
            },
            {
              key: "packSize",
              label: "Package Size",
            },
            {
              key: "price",
              label: "Price",
            },
            {
              key: "category.parent.name",
              label: "Category",
            },
            {
              key: "category.name",
              label: "Sub Category",
            },
            {
              key: "status",
              label: "Status",
            },
            { key: "updatedAt", label: "Modified" },
            { key: "createdAt", label: "Created" },
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
