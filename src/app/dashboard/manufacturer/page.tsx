"use client";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import ManufacturerForm from "@/features/manufacturers/components/ManufacturerForm";
import {
  useCreateManufacturer,
  useDeleteManufacturer,
  useDeleteMultipleManufacturers,
  useGetManufacturers,
  useGetManufacturersStats,
  useUpdateManufacturer,
} from "@/features/manufacturers/services/manufacturers.api";
import { Tab } from "@/interfaces/general";
import React, { useRef, useState } from "react";
import DataTable from "@/components/general/DataTable";
import { ManufacturerItem } from "@/features/manufacturers/types";
import FilterContainer from "@/components/filters/FilterContainer";
import SortFilter from "@/components/filters/SortFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import { useDynamicDrawer } from "@/hooks/useDynamicDrawer";
import { BULK_FORM_ID, useBulkTabSetup } from "@/hooks/useBulkTabSetup";
import {
  useBulkUploadProduct,
} from "@/features/products/services/products.api";

const MANUAL_FORM_ID = "manufacturer-form";
const ManufacturerPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | "">("");
  const debouncedQuery = useDebounce(query);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    ManufacturerItem | undefined
  >(undefined);
  const [selectedManufacturers, setSelectedManufacturers] = useState<
    ManufacturerItem[] | []
  >([]);
    const manufacturerFormResetRef = useRef<(() => void) | null>(null);

  const { mutateAsync: updateManufacturer, isPending: updating } =
    useUpdateManufacturer();
  // lift mutation here so drawer footer can show loading and we can close on success
  const { mutateAsync: createManufacturer, isPending: creating } =
    useCreateManufacturer();
  const {
    mutateAsync: deleteMultipleManufacturers,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleManufacturers();
  const { mutateAsync: deleteManufacturer, isPending: deleting } =
    useDeleteManufacturer();
  const { mutateAsync: bulkUpload, isPending: bulkUploading } =
    useBulkUploadProduct();

  const { data: stats, isPending: isStatsPending } = useGetManufacturersStats();
  const {
    data,
    isPending: isManufacturersPending,
    isRefetching,
    refetch,
  } = useGetManufacturers({ search: debouncedQuery, sortOrder });
  const manufacturers = data?.data;

  //─ Dynamic drawer (tracks which tab is active) ───────────────────────────
  const { activeFormId, onActiveFormIdChange, resetToManual, isBulkTab } =
    useDynamicDrawer(MANUAL_FORM_ID);

  const { bulkTabContent } = useBulkTabSetup({
    catalog: "product",
    // onDownload: handleDownloadTemplate,
    onUpload: async (formData) => {
      await bulkUpload(formData);
    },
    onSuccess: () => setOpen(false),
  });

  const handleCreate = async (values: any) => {
    if (selectedManufacturer) {
      await updateManufacturer(values);
    } else {
      await createManufacturer(values);
    }
    // close drawer on success
    setOpen(false);
    setSelectedManufacturer(undefined);
  };

  const handleBulkDelete = async (
    selectedManufacturers: ManufacturerItem[],
  ) => {
    const idsToDelete = selectedManufacturers.map(
      (manufacturer) => manufacturer?.id,
    );
    await deleteMultipleManufacturers({ manufacturerIds: idsToDelete });
  };

  const handleDelete = async () => {
    await deleteManufacturer({ id: selectedManufacturer?.id ?? "" });
    setOpen(false);
    setSelectedManufacturer(undefined);
  };

  const displayStats = [
    { value: stats?.total ? `${stats?.total}` : "0", label: "Manufacturers" },
    {
      value: stats?.suspended ? `${stats?.suspended}` : "0",
      label: "Archived",
    },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: `${selectedManufacturer ? "Edit" : "Enter"} manufacturer details`,
      content: (
        <ManufacturerForm
          manufacturer={selectedManufacturer}
          handleSubmitForm={handleCreate}
          loading={updating || creating}
          closeDialog={() => setOpen(false)}
          onResetReady={(fn) => {
            manufacturerFormResetRef.current = fn;
          }}
        />
      ),
      ...(selectedManufacturer
        ? {
            actionDropdown: (
              <FormDropdown
                deleteAction={handleDelete}
                onReset={() => manufacturerFormResetRef.current?.()}
              />
            ),
          }
        : {}),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      formId: BULK_FORM_ID,
      content: bulkTabContent,
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
                  setSelectedManufacturer(undefined);
                  resetToManual();
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={activeFormId}
              submitLoading={updating || creating || deleting || bulkUploading}
              submitLabel={isBulkTab ? "Upload CSV" : "Save record"}
              children={
                <DrawerTabs
                  onActiveFormIdChange={onActiveFormIdChange}
                  tabs={tabs}
                />
              }
              showFooter
            />
          </div>
        </div>

        <DataTable
          withCheckbox
          getRowId={(row) => row.id}
          onRowClick={(row) => {
            setSelectedManufacturer(row);
            setOpen(!open);
          }}
          onSelectionChange={(selectedRows) => {
            console.log("Selected rows:", selectedRows);
            setSelectedManufacturers(selectedRows);
          }}
          onDelete={(selectedRows) => {
            console.log("Delete these:", selectedRows);
            handleBulkDelete(selectedRows);
          }}
          loading={isManufacturersPending || isRefetching}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          data={manufacturers ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Manufacturer", activeColor: true },
            { key: "updatedAt", label: "Modified" },
            { key: "createdAt", label: "Created" },
          ]}
          page={page}
          pageSize={20}
          totalCount={data?.meta?.totalItems}
          hasNext={data?.meta?.hasNextPage}
          hasPrevious={data?.meta?.hasPreviousPage}
          onPageChange={setPage}
          header="Create manufacturer"
          description="No manufacturer record yet. Add records to see manufacturer list"
          image={"/dashboard/import-csv.svg"}
          cta="Add Manufacturer"
        />
      </div>
    </div>
  );
};

export default ManufacturerPage;
