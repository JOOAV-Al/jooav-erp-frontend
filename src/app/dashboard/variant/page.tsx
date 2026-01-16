"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DashboardCard from "@/components/general/DashboardCard";
import DrawerTabs from "@/components/general/DrawerTabs";
import EmptyState from "@/components/general/EmptyState";
import VariantForm from "@/features/variants/components/VariantForm";
import {
  useCreateVariant,
  useGetVariants,
} from "@/features/variants/services/variants.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { VariantItem } from "@/features/variants/types";

const VariantPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  // lift mutation here so drawer footer can show loading and we can close on success
  const { mutateAsync: createVariant, isPending } = useCreateVariant();
  const [selectedVariant, setSelectedVariant] = useState<
    VariantItem | undefined
  >(undefined);
  const {
    data,
    isPending: isVariantsPending,
    isRefetching,
    refetch,
  } = useGetVariants({});

  const variants = data?.data;
  console.log({ variants });

  const handleCreate = async (values: any) => {
    await createVariant(values);
    // close drawer on success
    setOpen(false);
    // optionally show toast or refresh list
  };
  const stats = [
    { value: "200", label: "Total Variants" },
    { value: "10", label: "In Draft" },
    { value: "190", label: "Total Published" },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: "Enter variant details",
      content: (
        <VariantForm
          variant={selectedVariant}
          handleSubmitForm={handleCreate}
          loading={isPending}
          closeDialog={() => setOpen(false)}
        />
      ),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      // heading: "Upload variant details",
      content: (
        <CSVUpload
          catalog={"variant"}
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
      {variants && variants?.length > 0 && (
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
            setSelectedVariant(row);
            setOpen(!open);
          }}
          loading={isVariantsPending || isRefetching}
          data={variants ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Variant" },
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
          header="Create variant"
          description="No variant record yet. Add records to see variant list"
          image={"/dashboard/import-csv.svg"}
          cta="Add Variant"
        />

        <DashboardDrawer
          openDrawer={() => setOpen(!open)}
          isOpen={open}
          submitFormId="variant-form"
          submitLoading={isPending}
          submitLabel="Save record"
          children={<DrawerTabs tabs={tabs} />}
          showFooter
        />
      </div>
    </div>
  );
};

export default VariantPage;
