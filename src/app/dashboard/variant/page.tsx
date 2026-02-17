"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import VariantForm from "@/features/variants/components/VariantForm";
import {
  useCreateVariant,
  useDeleteMultipleVariants,
  useDeleteVariant,
  useGetVariants,
  useGetVariantsStats,
  useUpdateVariant,
} from "@/features/variants/services/variants.api";
import { Tab } from "@/interfaces/general";
import React, { useRef, useState } from "react";
import DataTable from "@/components/general/DataTable";
import { VariantItem } from "@/features/variants/types";
import FilterContainer from "@/components/filters/FilterContainer";
import SortFilter from "@/components/filters/SortFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useGetBrands } from "@/features/brands/services/brands.api";
import { useDynamicDrawer } from "@/hooks/useDynamicDrawer";
import { BULK_FORM_ID, useBulkTabSetup } from "@/hooks/useBulkTabSetup";
import { useBulkUploadProduct } from "@/features/products/services/products.api";

const MANUAL_FORM_ID = "variant-form";

const VariantPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | "">("");
  const debouncedQuery = useDebounce(query);
  const [selectedVariant, setSelectedVariant] = useState<
    VariantItem | undefined
  >(undefined);
  const [selectedVariants, setSelectedVariants] = useState<VariantItem[] | []>(
    [],
  );
  const variantFormResetRef = useRef<(() => void) | null>(null);

  const { mutateAsync: updateVariant, isPending: updating } =
    useUpdateVariant();
  const { mutateAsync: createVariant, isPending: creating } =
    useCreateVariant();
  const {
    mutateAsync: deleteMultipleVariants,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleVariants();
  const { mutateAsync: deleteVariant, isPending: deleting } =
    useDeleteVariant();
  const { mutateAsync: bulkUpload, isPending: bulkUploading } =
    useBulkUploadProduct();

  const { data: stats, isPending: isStatsPending } = useGetVariantsStats();
  const {
    data,
    isPending: isVariantsPending,
    isRefetching,
    refetch,
  } = useGetVariants({ search: debouncedQuery, sortOrder });
  const variants = data?.data;
  const { data: brands } = useGetBrands({});

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
    if (selectedVariant) {
      await updateVariant(values);
    } else {
      await createVariant(values);
    }
    // close drawer on success
    setOpen(false);
    setSelectedVariant(undefined);
  };

  const handleBulkDelete = async (selectedVariants: VariantItem[]) => {
    const idsToDelete = selectedVariants.map((variant) => variant?.id);
    await deleteMultipleVariants({ variantIds: idsToDelete });
  };

  const handleDelete = async () => {
    await deleteVariant({ id: selectedVariant?.id ?? "" });
    setOpen(false);
    setSelectedVariant(undefined);
  };

  const displayStats = [
    {
      value: stats?.totalVariants ? `${stats?.totalVariants}` : "0",
      label: "Variants",
    },
    {
      value: stats?.totalBrands ? `${stats?.totalBrands}` : "0",
      label: "Brands",
    },
    {
      value: stats?.inactiveVariants ? `${stats?.inactiveVariants}` : "0",
      label: "Archived",
    },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: `${selectedVariant ? "Edit" : "Enter"} variant details`,
      content: (
        <VariantForm
          variant={selectedVariant}
          brands={brands?.data}
          handleSubmitForm={handleCreate}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
          onResetReady={(fn) => {
            variantFormResetRef.current = fn;
          }}
        />
      ),
      ...(selectedVariant
        ? {
            actionDropdown: (
              <FormDropdown
                deleteAction={handleDelete}
                onReset={() => variantFormResetRef.current?.()}
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
              inputClassName="max-w-90!"
            />
            <DashboardDrawer
              showTrigger
              openDrawer={(isOpen) => {
                if (isOpen) {
                  setSelectedVariant(undefined);
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
          onRowClick={(row) => {
            setSelectedVariant(row);
            setOpen(!open);
          }}
          withCheckbox
          getRowId={(row) => row.id}
          onSelectionChange={(selectedRows) => {
            console.log("Selected rows:", selectedRows);
            setSelectedVariants(selectedRows);
          }}
          onDelete={(selectedRows) => {
            console.log("Delete these:", selectedRows);
            handleBulkDelete(selectedRows);
          }}
          loading={isVariantsPending || isRefetching}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          data={variants ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Variant", activeColor: true },
            {
              key: "logo",
              label: (
                <div className="flex justify-center">
                  <ImageIcon
                    strokeWidth={2}
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
              key: "brand.name",
              label: "Brand",
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
          header="Create variant"
          description="No variant record yet. Add records to see variant list"
          image={"/dashboard/import-csv.svg"}
          cta="Add Variant"
        />
      </div>
    </div>
  );
};

export default VariantPage;
