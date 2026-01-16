"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DashboardCard from "@/components/general/DashboardCard";
import DrawerTabs from "@/components/general/DrawerTabs";
import EmptyState from "@/components/general/EmptyState";
import BrandForm from "@/features/brands/components/BrandForm";
import {
  useCreateBrand,
  useGetBrands,
} from "@/features/brands/services/brands.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { BrandItem } from "@/features/brands/types";

const BrandPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  // lift mutation here so drawer footer can show loading and we can close on success
  const { mutateAsync: createBrand, isPending } = useCreateBrand();
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | undefined>(
    undefined
  );
  const {
    data,
    isPending: isBrandsPending,
    isRefetching,
    refetch,
  } = useGetBrands({});

  const brands = data?.data;
  console.log({ brands });

  const handleCreate = async (values: any) => {
    await createBrand(values);
    // close drawer on success
    setOpen(false);
    // optionally show toast or refresh list
  };
  const stats = [
    { value: "200", label: "Total Brands" },
    { value: "10", label: "In Draft" },
    { value: "190", label: "Total Published" },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: "Enter brand details",
      content: (
        <BrandForm
          brand={selectedBrand}
          handleSubmitForm={handleCreate}
          loading={isPending}
          closeDialog={() => setOpen(false)}
        />
      ),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      // heading: "Upload brand details",
      content: (
        <CSVUpload
          catalog={"brand"}
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
      {brands && brands?.length > 0 && (
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
            setSelectedBrand(row);
            setOpen(!open);
          }}
          loading={isBrandsPending || isRefetching}
          data={brands ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Brand" },
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
          header="Create brand"
          description="No brand record yet. Add records to see brand list"
          image={"/dashboard/import-csv.svg"}
          cta="Add Brand"
        />

        <DashboardDrawer
          openDrawer={() => setOpen(!open)}
          isOpen={open}
          submitFormId="brand-form"
          submitLoading={isPending}
          submitLabel="Save record"
          children={<DrawerTabs tabs={tabs} />}
          showFooter
        />
      </div>
    </div>
  );
};

export default BrandPage;
