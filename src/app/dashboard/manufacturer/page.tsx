"use client";
import CSVUpload from "@/components/general/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DashboardStatsCard from "@/components/general/DashboardStatsCard";
import DrawerTabs from "@/components/general/DrawerTabs";
import EmptyState from "@/components/general/EmptyState";
import ManufacturerForm from "@/features/manufacturers/components/ManufacturerForm";
import { useCreateManufacturer } from "@/features/manufacturers/services/manufacturers.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";

const ManufacturerPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  // lift mutation here so drawer footer can show loading and we can close on success
  const { mutateAsync: createManufacturer, isPending } =
    useCreateManufacturer();

  const handleCreate = async (values: any) => {
    await createManufacturer(values);
    // close drawer on success
    setOpen(false);
    // optionally show toast or refresh list
  };
  const stats = [
    { value: "200", label: "Total Manufacturers" },
    { value: "10", label: "In Draft" },
    { value: "190", label: "Total Published" },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: "Enter manufacturer details",
      content: (
        <ManufacturerForm
          handleSubmitForm={handleCreate}
          loading={isPending}
          closeDialog={() => setOpen(false)}
        />
      ),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      heading: "Upload manufacturer details",
      content: <CSVUpload />,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-8 h-full px-md mt-5">
        <div className="flex py-main gap-6">
          {stats.map((stat, i) => (
            <DashboardStatsCard key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
        <EmptyState
          header={"Create manufacturer"}
          description="No manufacturer record yet. Add records to see manufacturer list"
          cta="Add Manufacturer"
          image="/dashboard/import-csv.svg"
          onCTAClick={() => setOpen(!open)}
        />

        <DashboardDrawer
          openDrawer={() => setOpen(!open)}
          isOpen={open}
          submitFormId="manufacturer-form"
          submitLoading={isPending}
          submitLabel="Create manufacturer"
          children={<DrawerTabs tabs={tabs} />}
        />
      </div>
    </div>
  );
};

export default ManufacturerPage;
