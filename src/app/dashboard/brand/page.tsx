"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import BrandForm from "@/features/brands/components/BrandForm";
import {
  useCreateBrand,
  useDeleteBrand,
  useDeleteMultipleBrands,
  useGetBrands,
  useGetBrandsStats,
  useUpdateBrand,
} from "@/features/brands/services/brands.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { BrandItem } from "@/features/brands/types";
import FilterContainer from "@/components/filters/FilterContainer";
import SortFilter from "@/components/filters/SortFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import Image from "next/image";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import { ImageIcon } from "lucide-react";
import { useGetManufacturers } from "@/features/manufacturers/services/manufacturers.api";
const BrandPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | "">("");
  const debouncedQuery = useDebounce(query);

  const { mutateAsync: updateBrand, isPending: updating } = useUpdateBrand();
  const { mutateAsync: createBrand, isPending: creating } = useCreateBrand();
  const { mutateAsync: deleteBrand, isPending: deleting } = useDeleteBrand();
  const {
    mutateAsync: deleteMultipleBrands,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleBrands();

  const [selectedBrand, setSelectedBrand] = useState<BrandItem | undefined>(
    undefined,
  );
  const [selectedBrands, setSelectedBrands] = useState<BrandItem[] | []>([]);

  const { data: stats, isPending: isStatsPending } = useGetBrandsStats();
  const {
    data,
    isPending: isBrandsPending,
    isRefetching,
    refetch,
  } = useGetBrands({ search: debouncedQuery, sortOrder });
  const brands = data?.data;
  const { data: manufacturers } = useGetManufacturers({});

  const handleCreate = async (values: any) => {
    console.log({ finalValues: values });
    if (selectedBrand) {
      await updateBrand(values);
    } else {
      await createBrand(values);
    }
    // close drawer on success
    setOpen(false);
    setSelectedBrand(undefined);
  };

  const handleBulkDelete = async (selectedBrands: BrandItem[]) => {
    const idsToDelete = selectedBrands.map((brand) => brand?.id);
    await deleteMultipleBrands({ brandIds: idsToDelete });
  };

  const handleDelete = async () => {
    await deleteBrand({ id: selectedBrand?.id ?? "" });
    setOpen(false);
    setSelectedBrand(undefined);
  };
  const displayStats = [
    { value: stats?.total ? `${stats?.total}` : "0", label: "Brands" },
    {
      value: stats?.totalManufacturers ? `${stats?.totalManufacturers}` : "0",
      label: "Manufacturers",
    },
    { value: stats?.inactive ? `${stats?.inactive}` : "0", label: "Archived" },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: `${selectedBrand ? "Edit" : "Enter"} brand details`,
      content: (
        <BrandForm
          brand={selectedBrand}
          manufacturers={manufacturers?.data}
          handleSubmitForm={handleCreate}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
        />
      ),
      ...(selectedBrand
        ? { actionDropdown: <FormDropdown deleteAction={handleDelete} /> }
        : {}),
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
      {isStatsPending ? (
        <StatsSkeleton count={3} />
      ) : (
        <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="Filter">
            <SortFilter
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
            />
          </FilterContainer>
          <div className="flex items-center flex-wrap gap-6">
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
                  setSelectedBrand(undefined);
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={"brand-form"}
              submitLoading={updating || creating || deleting}
              submitLabel="Save record"
              children={<DrawerTabs tabs={tabs} />}
              showFooter
            />
          </div>
        </div>
        <DataTable
          onRowClick={(row) => {
            setSelectedBrand(row);
            setOpen(!open);
          }}
          withCheckbox
          getRowId={(row) => row.id}
          onSelectionChange={(selectedRows) => {
            console.log("Selected rows:", selectedRows);
            setSelectedBrands(selectedRows);
          }}
          onDelete={(selectedRows) => {
            console.log("Delete these:", selectedRows);
            handleBulkDelete(selectedRows);
          }}
          loading={isBrandsPending || isRefetching}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          data={brands ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Brand", activeColor: true },
            {
              key: "_count.variants",
              label: "No of Var.",
              activeColor: true,
            },
            {
              key: "logo",
              label: (
                <div className="flex justify-center">
                  <ImageIcon
                    strokeWidth={2.5}
                    className="w-5 h-5 text-border-accent"
                  />
                </div>
              ),
              render: (item) => (
                <div className="w-[31.2px] h-7 flex items-center justify-center mx-auto">
                  {item?.logo ? (
                    <Image
                      src={item?.logo ?? ""}
                      alt="Brand logo"
                      width={31.2}
                      height={28}
                    />
                  ) : (
                    <span className="text-body">N/A</span>
                  )}
                </div>
              ),
            },
            {
              key: "manufacturer.name",
              label: "Manufacturer",
              activeColor: true,
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
      </div>
    </div>
  );
};

export default BrandPage;
