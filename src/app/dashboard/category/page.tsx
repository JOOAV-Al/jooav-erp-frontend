"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DashboardCard from "@/components/general/DashboardCard";
import DrawerTabs from "@/components/general/DrawerTabs";
import EmptyState from "@/components/general/EmptyState";
import CategoryForm from "@/features/categories/components/CategoryForm";
import {
  useCreateCategory,
  useGetCategories,
} from "@/features/categories/services/category.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { CategoryItem } from "@/features/categories/types";

const CategoryPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  // lift mutation here so drawer footer can show loading and we can close on success
  const { mutateAsync: createCategory, isPending } = useCreateCategory();
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | undefined>(
    undefined
  );
  const {
    data,
    isPending: isCategoriesPending,
    isRefetching,
    refetch,
  } = useGetCategories({});

  const categories = data?.data;
  console.log({ categories });

  const handleCreate = async (values: any) => {
    await createCategory(values);
    // close drawer on success
    setOpen(false);
    // optionally show toast or refresh list
  };
  const stats = [
    { value: "200", label: "Total Categories" },
    { value: "10", label: "In Draft" },
    { value: "190", label: "Total Published" },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: "Enter category details",
      content: (
        <CategoryForm
          category={selectedCategory}
          handleSubmitForm={handleCreate}
          loading={isPending}
          closeDialog={() => setOpen(false)}
        />
      ),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      // heading: "Upload category details",
      content: (
        <CSVUpload
          catalog={"category"}
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
      {categories && categories?.length > 0 && (
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
            setSelectedCategory(row);
            setOpen(!open);
          }}
          loading={isCategoriesPending || isRefetching}
          data={categories ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Category" },
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
          header="Create category"
          description="No category record yet. Add records to see category list"
          image={"/dashboard/import-csv.svg"}
          cta="Add Category"
        />

        <DashboardDrawer
          openDrawer={() => setOpen(!open)}
          isOpen={open}
          submitFormId="category-form"
          submitLoading={isPending}
          submitLabel="Save record"
          children={<DrawerTabs tabs={tabs} />}
          showFooter
        />
      </div>
    </div>
  );
};

export default CategoryPage;
