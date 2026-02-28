"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import ProductForm from "@/features/products/components/ProductForm";
import {
  useCreateProduct,
  useDeleteProduct,
  useDeleteMultipleProducts,
  useGetProducts,
  useUpdateProduct,
  useGetProductsStats,
  useUpdateMultipleProductStatus,
  useGetTemplate,
  useBulkUploadProduct,
} from "@/features/products/services/products.api";
import { Tab } from "@/interfaces/general";
import React, { useRef, useState } from "react";
import DataTable from "@/components/general/DataTable";
import { ProductItem } from "@/features/products/types";
import FilterContainer from "@/components/filters/FilterContainer";
import StatusFilter from "@/components/filters/StatusFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import TableTag from "@/components/general/TableTag";
import {
  CloudUpload,
  FileSpreadsheet,
  SquareStack,
  Trash2,
} from "lucide-react";
import { useGetBrands } from "@/features/brands/services/brands.api";
import { useGetCategories } from "@/features/categories/services/category.api";
import { useFileObjectUpload } from "@/features/uploads/hooks/useFileObjectUpload";
import { toProperCase } from "@/lib/utils";

const MANUAL_FORM_ID = "product-form";
const BULK_FORM_ID = "bulk-upload-form";

const ProductPage = () => {
  const [submitAction, setSubmitAction] = useState<"primary" | "secondary">(
    "primary",
  );
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<
    ProductItem | undefined
  >(undefined);
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[] | []>(
    [],
  );
  // Tracks which tab is active so the footer targets the right form
  const [activeFormId, setActiveFormId] = useState<string>(MANUAL_FORM_ID);
  // Stores the reset function surfaced by ProductForm via onResetReady
  const productFormResetRef = useRef<(() => void) | null>(null);

  const debouncedQuery = useDebounce(query);

  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();
  const { mutateAsync: createProduct, isPending: creating } =
    useCreateProduct();
  const {
    mutateAsync: deleteMultipleProducts,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleProducts();
  const {
    mutateAsync: publishMultipleProducts,
    isPending: publishingMultiple,
    status: publishingStatus,
  } = useUpdateMultipleProductStatus();
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useDeleteProduct();
  const { mutateAsync: bulkUpload, isPending: bulkUploading } =
    useBulkUploadProduct();

  const { data: stats, isPending: isStatsPending } = useGetProductsStats();
  const {
    data,
    isPending: isProductsPending,
    isRefetching,
    refetch,
  } = useGetProducts({ search: debouncedQuery, status: statusFilter });
  const products = data?.data;
  const { data: brands } = useGetBrands({});
  const { data: categories } = useGetCategories({});
  const { refetch: fetchTemplate } = useGetTemplate();
  const {
    files,
    inputRef,
    openFileDialog,
    handleFileChange,
    removeFile,
    clearFiles,
  } = useFileObjectUpload(true);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCreate = async (values: any) => {
    if (selectedProduct) {
      await updateProduct(values);
    } else {
      await createProduct(values);
    }
    // close drawer on success and reset state
    setSubmitAction("primary");
    setOpen(false);
    setSelectedProduct(undefined);
  };

  const handleBulkDelete = async (selectedProducts: ProductItem[]) => {
    const idsToDelete = selectedProducts.map((product) => product?.id);
    await deleteMultipleProducts({ productIds: idsToDelete });
  };

  const handleBulkPublish = async (selectedProducts: ProductItem[]) => {
    const idsToPublish = selectedProducts.map((product) => product?.id);
    const payload = {
      productIds: idsToPublish,
      status: "LIVE",
    };
    await publishMultipleProducts({ payload });
  };

  const handleDelete = async () => {
    await deleteProduct({ id: selectedProduct?.id ?? "" });
    setOpen(false);
    setSelectedProduct(undefined);
  };

  const handleStatusChange = async (status: string = "QUEUE") => {
    const payload = {
      productIds: [selectedProduct?.id ?? ""],
      status,
    };
    await publishMultipleProducts({ payload });
    setOpen(false);
    setSelectedProduct(undefined);
  };

  const handleDownloadTemplate = async () => {
    const { data } = await fetchTemplate();
    console.log(data);

    if (!data) return;

    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-template.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleBulkUpload = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!files.length) return;

    const formData = new FormData();

    // files.forEach((fileObj) => {
    //   formData.append("file", fileObj.file);
    // });
    if (files?.[0]) {
      formData.append("file", files?.[0]?.file);
    }

    await bulkUpload(formData);

    clearFiles();
    setOpen(false);
  };

  const displayStats = [
    {
      value: stats?.totalProducts ? `${stats?.totalProducts}` : "0",
      label: "Products",
    },
    {
      value: stats?.totalVariants ? `${stats?.totalVariants}` : "0",
      label: "Variants",
    },
    { value: stats?.drafts ? `${stats?.drafts}` : "0", label: "Draft" },
    { value: stats?.archived ? `${stats?.archived}` : "0", label: "Archived" },
  ];
  const getTagStyles = (value: string = "DRAFT") => {
    // if (value === "QUEUE") {
    //   return {
    //     styles: `border-border-brand-stroke bg-tag-added text-brand-primary`,
    //     text: `Queue`,
    //   };
    // }
    if (value === "QUEUE") {
      return {
        styles: `border-border-accent bg-tag-queue text-brand-signal`,
        text: `Queue`,
      };
    } else if (value === "LIVE") {
      return {
        styles: `border-border-main bg-tag-active text-success-500`,
        text: `Live`,
      };
    } else {
      return {
        styles: `border-border-main bg-tag-draft text-body-passive`,
        text: `Draft`,
      };
    }
  };

  const isBulkTab = activeFormId === BULK_FORM_ID;

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      formId: MANUAL_FORM_ID,
      heading: `${selectedProduct ? "Edit" : "Enter"} product details`,
      content: (
        <ProductForm
          product={selectedProduct}
          handleSubmitForm={handleCreate}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
          submitAction={submitAction}
          brands={brands?.data}
          categories={categories?.data}
          // ProductForm calls this once with its own reset function.
          // We store it in a ref so FormDropdown can call it on demand.
          onResetReady={(fn) => {
            productFormResetRef.current = fn;
          }}
        />
      ),
      ...(selectedProduct
        ? {
            actionDropdown: (
              <FormDropdown
                deleteAction={handleDelete}
                publish={
                  selectedProduct?.status !== "LIVE"
                    ? () => handleStatusChange("LIVE")
                    : undefined
                }
                unpublish={
                  selectedProduct?.status !== "QUEUE"
                    ? () => handleStatusChange("QUEUE")
                    : undefined
                }
                onReset={() => productFormResetRef.current?.()}
              />
            ),
          }
        : {
            actionDropdown: (
              <FormDropdown onReset={() => productFormResetRef.current?.()} />
            ),
          }),
      statusTag: (
        <TableTag
          className={`${getTagStyles(selectedProduct?.status)?.styles}`}
          text={getTagStyles(selectedProduct?.status)?.text}
        />
      ),
      loading: publishingMultiple || deleting,
    },
    {
      value: "bulk",
      label: "Bulk Import",
      formId: BULK_FORM_ID,
      content: (
        <>
          {/*
            Hidden form — has no visible fields.
            The footer's submit button fires this via form={BULK_FORM_ID}.
            onSubmit calls handleBulkUpload which reads `files` from the hook.
          */}
          <form id={BULK_FORM_ID} onSubmit={handleBulkUpload} />

          {/* Selected files list */}
          {files.length > 0 ? (
            <div className="flex flex-col gap-main">
              <div className={`flex flex-col gap-5 py-main`}>
                <h4 className="leading-[1.2] tracking-[0.01em]">File Uploaded</h4>
                <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
                  The list shows files you selected
                </p>
              </div>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex jify-between items-center bg-[#F7F7F7] shadow-input rounded-lg p-md gap-5"
                >
                  <div className="flex justify-center items-center h-[24px] w-[24px] p-3">
                    <FileSpreadsheet
                      className="text-brand-primary"
                      strokeWidth={2}
                      width={20}
                      height={20}
                    />
                  </div>
                  <p className="flex-1 text-[14px] font-medium leading-[1.5] tracking-[0.04em] pb-3">
                    {file?.name}
                  </p>
                  <div
                    onClick={() => removeFile(file.id)}
                    className="cursor-pointer flex justify-center items-center h-[24px] w-[24px] p-3"
                  >
                    <Trash2
                      className="text-outline-passive"
                      strokeWidth={2}
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <CSVUpload
                catalog="product"
                onCTAClick={openFileDialog} // opens the file picker
                onDownload={handleDownloadTemplate}
              />

              {/* Hidden file input wired to the hook */}
              <input
                type="file"
                accept=".csv, .xlsx"
                multiple
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {isStatsPending ? (
        <StatsSkeleton count={4} />
      ) : (
        <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="Filter">
            <StatusFilter
              isProducts
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </FilterContainer>
          <div className="flex items-center gap-6 flex-wrap">
            <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            />
            <DashboardDrawer
              isCustomWidth={true}
              customWidthStyle={
                "aspect-829/959 max-w-md mdl:max-w-md lg:max-w-[829px]"
              }
              customImage={"/dashboard/wide-drawer-top-img.svg"}
              showTrigger
              openDrawer={(isOpen) => {
                if (isOpen) {
                  setSelectedProduct(undefined);
                  setSubmitAction("primary"); // Reset on open
                  setActiveFormId(MANUAL_FORM_ID);
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={activeFormId}
              submitLoading={updating || creating || deleting || bulkUploading}
              submitLabel={isBulkTab ? "Upload CSV" : "Queue"}
              secondarySubmitLabel={isBulkTab ? undefined : "Publish"}
              secondarySubmitLoading={updating || creating || deleting}
              submitAction={submitAction}
              onSubmitActionChange={setSubmitAction}
              primaryBtnIcon={
                isBulkTab ? undefined : (
                  <SquareStack
                    className="text-secondary"
                    size={17}
                    strokeWidth={2}
                  />
                )
              }
              secondaryBtnIcon={
                !isBulkTab ? (
                  <CloudUpload
                    className="text-outline"
                    size={17}
                    strokeWidth={2}
                  />
                ) : undefined
              }
              showFooter
            >
              <DrawerTabs
                tabs={tabs}
                onActiveFormIdChange={(formId) =>
                  setActiveFormId(formId ?? MANUAL_FORM_ID)
                }
              />
            </DashboardDrawer>
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
            setSelectedProducts(selectedRows);
          }}
          onDelete={(selectedRows) => {
            handleBulkDelete(selectedRows);
          }}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          onPublish={(selectedRows) => {
            handleBulkPublish(selectedRows);
          }}
          loading={isProductsPending || isRefetching}
          publishingMultiple={publishingMultiple}
          publishingMultipleStatus={publishingStatus}
          data={products ?? []}
          refetch={refetch}
          columns={[
            { key: "name", label: "Name", activeColor: true },
            {
              key: "subcategory.category.name",
              label: "Category",
            },
            {
              key: "subcategory.name",
              label: "Sub Category",
            },
            {
              key: "brand.name",
              label: "Brand",
            },
            {
              key: "packSize.name",
              label: "Pack Size",
            },
            {
              key: "packType.name",
              label: "Pack Type",
            },
            {
              key: "sku",
              label: "SKU",
              activeColor: true,
              render: (row) => toProperCase(row?.sku ?? "")
            },
            {
              key: "price",
              label: "Price(N)",
              activeColor: true,
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <TableTag
                  className={`${getTagStyles(item?.status)?.styles}`}
                  text={getTagStyles(item?.status)?.text}
                />
              ),
            },
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
