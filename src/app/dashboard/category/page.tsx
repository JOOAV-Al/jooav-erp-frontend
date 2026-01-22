"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import CategoryForm from "@/features/categories/components/CategoryForm";
import {
  useCreateCategory,
  useGetCategories,
  useUpdateCategory,
} from "@/features/categories/services/category.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { CategoryItem } from "@/features/categories/types";
import FilterContainer from "@/components/filters/FilterContainer";
import AllFilter from "@/components/filters/AllFilter";
import SortFilter from "@/components/filters/SortFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";

const CategoryPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { mutateAsync: updateCategory, isPending: updating } =
    useUpdateCategory();
  const { mutateAsync: createCategory, isPending: creating } =
    useCreateCategory();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryItem | undefined
  >(undefined);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryItem[] | []
  >([]);
  const debouncedQuery = useDebounce(query);

  const {
    data,
    isPending: isCategoriesPending,
    isRefetching,
    refetch,
  } = useGetCategories({
    search: debouncedQuery,
    sortOrder,
  });

  const categories = data?.data;

  const handleCreate = async (values: any) => {
    if (selectedCategory) {
      await updateCategory(values);
    } else {
      await createCategory(values);
    }
    // close drawer on success
    setOpen(false);
    setSelectedCategory(undefined);
  };

  const handleBulkDelete = async (
    selectedCategories: CategoryItem[]
  ) => {
    console.log({ selectedCategories });
  };

  const stats = [
    { value: "200", label: "Total Categories" },
    { value: "10", label: "In Draft" },
    { value: "190", label: "Total Published" },
  ];

  const formId = `category-form`;
  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: "Enter category details",
      content: (
        <CategoryForm
          category={selectedCategory}
          handleSubmitForm={(values) => handleCreate(values)}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
          formId={formId}
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
      {categories && categories?.length > 0 && <StatsContainer stats={stats} />}

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
                  setSelectedCategory(undefined);
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={formId}
              submitLoading={updating || creating}
              submitLabel="Save record"
              children={<DrawerTabs tabs={tabs} />}
              showFooter
            />
          </div>
        </div>

        <DataTable
          withCheckbox
          getRowId={(row) => row.id}
          onRowClick={(row) => {
            setSelectedCategory(row);
            setOpen(!open);
          }}
          onSelectionChange={(selectedRows) => {
            console.log("Selected rows:", selectedRows);
            setSelectedCategories(selectedRows);
          }}
          onDelete={(selectedRows) => {
            console.log("Delete these:", selectedRows);
            // Call your delete API here
            handleBulkDelete(selectedRows);
          }}
          loading={isCategoriesPending || isRefetching}
          data={categories ?? []}
          refetch={refetch}
          columns={[
            {
              key: "name",
              label: "Category",
            },
            {
              key: "parentId",
              label: "Type",
              render: (category) => <span>{category.parentId ? "Sub" : "Major"}</span>,
            },
            // {
            //   key: "parent.name",
            //   label: "Parent Category",
            // },
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
      </div>
    </div>
  );
};

export default CategoryPage;
