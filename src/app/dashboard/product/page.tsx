"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DashboardCard from "@/components/general/DashboardCard";
import DrawerTabs from "@/components/general/DrawerTabs";
import EmptyState from "@/components/general/EmptyState";
import ProductForm from "@/features/products/components/ProductForm";
import {
  useCreateProduct,
  useGetProducts,
} from "@/features/products/services/products.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { ProductItem } from "@/features/products/types";

const ProductPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  // lift mutation here so drawer footer can show loading and we can close on success
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | undefined>(
    undefined
  );
  const {
    data,
    isPending: isProductsPending,
    isRefetching,
    refetch,
  } = useGetProducts({});

  const products = data?.data;
  console.log({ products });

  const handleCreate = async (values: any) => {
    await createProduct(values);
    // close drawer on success
    setOpen(false);
    // optionally show toast or refresh list
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
          loading={isPending}
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
      {products && products?.length > 0 && (
        <div className="flex py-main gap-6 border-y border-[#EDEDED]">
          {stats.map((stat, i) => (
            <DashboardCard
              className={`${
                i !== stats.length - 1 ? "border-r border-[#EDEDED]" : ""
              }`}
              key={i}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-8 h-full px-xl mt-5">
        <DataTable
          onRowClick={(row) => {
            setSelectedProduct(row);
            setOpen(!open);
          }}
          loading={isProductsPending || isRefetching}
          data={products ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Product" },
            {
              key: "variants",
              label: "No of Var.",
            },
            {
              key: "logo",
              label: "Logo",
            },
            {
              key: "manufacturer",
              label: "Manufacturer",
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

        <DashboardDrawer
          openDrawer={() => setOpen(!open)}
          isOpen={open}
          submitFormId="product-form"
          submitLoading={isPending}
          submitLabel="Save record"
          children={<DrawerTabs tabs={tabs} />}
          showFooter
        />
      </div>
    </div>
  );
};

export default ProductPage;
