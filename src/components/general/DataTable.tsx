import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/general/EmptyState";
import Spinner from "@/components/general/Spinner";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudUpload, Trash2, X } from "lucide-react";
import { TableSkeleton } from "@/components/general/TableSkeleton";
// import Pagination from "./Pagination";
// import CustomLoader from "@/components/layouts/landing-page/CustomLoader";
// import NoDataBox from "./NoDataBox";
// import { format } from "date-fns";

type Column<T> = {
  key: keyof T | string;
  activeColor?: boolean;
  label: React.ReactNode;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  withPagination?: boolean;
  loading?: boolean;
  deletingMultiple?: boolean;
  deletingMultipleStatus?: string;
  publishingMultiple?: boolean;
  publishingMultipleStatus?: string;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onPageChange?: (newPage: number) => void;
  onRowClick?: (row: T) => void;
  noDataText?: string;
  mainFilter?: string;
  image?: string;
  refetch?: () => void;
  // isRefetching?: boolean;
  header: string;
  description: string;
  cta?: string;
  onCTAClick?: () => void;
  withCheckbox?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  getRowId?: (row: T) => any;
  onDelete?: (selectedRows: T[]) => void;
  onPublish?: (selectedRows: T[]) => void;
}

//Helper function to get nested values (e.g., "brand.name")
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Helper to check if a string is a valid ISO date
const isISODate = (str: string): boolean => {
  // Match ISO 8601 format (YYYY-MM-DD or full ISO string)
  const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  return isoPattern.test(str);
};

function DataTable<T>({
  data,
  columns,
  loading = false,
  deletingMultiple = false,
  deletingMultipleStatus,
  publishingMultiple = false,
  publishingMultipleStatus,
  withPagination = true,
  page,
  pageSize,
  totalCount,
  hasNext,
  hasPrevious,
  onPageChange,
  onRowClick,
  image = "/dashboard/import-csv.svg",
  refetch,
  header,
  description,
  cta,
  onCTAClick,
  withCheckbox,
  onSelectionChange,
  getRowId = (row: any) => row.id,
  onDelete,
  onPublish,
}: // isRefetching = false,
DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map(getRowId));
      setSelectedRows(allIds);
      onSelectionChange?.(data);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  // Handle individual row selection
  const handleSelectRow = (row: T, checked: boolean) => {
    const rowId = getRowId(row);
    const newSelected = new Set(selectedRows);

    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }

    setSelectedRows(newSelected);

    // Get actual selected row objects
    const selectedRowObjects = data.filter((r) => newSelected.has(getRowId(r)));
    onSelectionChange?.(selectedRowObjects);
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedRows(new Set());
    onSelectionChange?.([]);
  };

  // Handle delete action
  const handleDelete = async () => {
    const selectedRowObjects = data.filter((r) =>
      selectedRows.has(getRowId(r)),
    );
    onDelete?.(selectedRowObjects);
  };

  // Handle publish action
  const handlePublish = async () => {
    const selectedRowObjects = data.filter((r) =>
      selectedRows.has(getRowId(r)),
    );
    onPublish?.(selectedRowObjects);
  };

  useEffect(() => {
    if (deletingMultipleStatus !== "success") return;
    handleClearSelection();
  }, [deletingMultipleStatus]);

  useEffect(() => {
    if (publishingMultipleStatus !== "success") return;
    handleClearSelection();
  }, [publishingMultipleStatus]);

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isSomeSelected =
    selectedRows.size > 0 && selectedRows.size < data.length;

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="flex flex-col gap-4 relative">
        <TableSkeleton
          columns={columns.length}
          rows={10}
          withCheckbox={withCheckbox}
          columnLabels={columns.map((col) => col.label)}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 relative">
      <Table>
        <TableHeader className="bg-[#F7F7F7] gap-8">
          <TableRow>
            {withCheckbox && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={`border-border-accent!
                    ${
                      isSomeSelected
                        ? "data-[state=checked]:bg-brand-primary"
                        : ""
                    }
                  `}
                />
              </TableHead>
            )}
            {columns.map((col, i) => (
              <TableHead
                key={i}
                title={typeof col.label === "string" ? col.label : undefined}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {/* loading ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length + (withCheckbox ? 1 : 0)}
                className="hover:bg-white"
              >
                <div className="bg-white flex flex-col items-center justify-center rounded-[10px] py-8 px-4 overflow-hidden h-[400px]">
                  <Spinner className="text-brand-primary" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) :  */}
        {data?.length === 0 ? (
          <TableBody>
            <TableRow className="hover:bg-white">
              <TableCell colSpan={columns.length + (withCheckbox ? 1 : 0)}>
                <EmptyState
                  header={header ?? "Create brand"}
                  description={description}
                  cta={cta}
                  image={image}
                  onCTAClick={() => refetch?.()}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {data?.map((row, i) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.has(rowId);
              return (
                <TableRow
                  key={i}
                  onClick={(e) => {
                    // Don't trigger row click if clicking checkbox
                    if (
                      // !withCheckbox &&
                      !(e.target as HTMLElement).closest('[role="checkbox"]')
                    ) {
                      onRowClick?.(row);
                    }
                  }}
                  className={`${
                    onRowClick || withCheckbox ? "cursor-pointer" : ""
                  } 
                    ${isSelected ? "bg-[#EBF4FF]" : "hover:bg-muted/50"}`}
                  data-state={isSelected ? "selected" : undefined}
                >
                  {withCheckbox && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(row, !!checked)
                        }
                        aria-label={`Select row ${i + 1}`}
                      />
                    </TableCell>
                  )}
                  {columns?.map((col, j) => (
                    <TableCell
                      className={`${col?.activeColor ? "text-body" : "text-body-passive"}`}
                      key={j}
                    >
                      {(() => {
                        if (!col.key) return "nil";
                        if (col.render) return col.render(row);

                        // Support nested keys (e.g., "brand.name")
                        const val = (col.key as string).includes(".")
                          ? getNestedValue(row, col.key as string)
                          : row[col.key as keyof T];

                        // If it's already a Date object
                        if (val instanceof Date) {
                          return format(val, "dd MMMM, yyyy");
                        }

                        // Only parse strings that match ISO date format
                        if (typeof val === "string" && isISODate(val)) {
                          const parsed = new Date(val);
                          if (!isNaN(parsed.getTime())) {
                            return format(parsed, "dd/MM/yyyy");
                          }
                        }

                        // Return as-is for everything else (numbers, non-ISO strings, etc.)
                        return String(val ?? "nil");
                      })()}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {/* {withPagination &&
        page &&
        pageSize &&
        totalCount !== undefined &&
        data &&
        data?.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            hasNext={!!hasNext}
            hasPrevious={!!hasPrevious}
            onPageChange={onPageChange!}
            isLoading={loading}
          />
        )} */}
      {/* Floating Selection Actions - Shows when items are selected */}
      {withCheckbox && selectedRows.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center max-w-97.5 w-full gap-6">
          {/* Selection count card */}
          <div className="bg-storey-foreground rounded-lg shadow-input flex items-center h-11">
            <span
              className=" 
            text-body px-md py-sm border-r-2 border-border-main"
            >
              {selectedRows.size} Selected
            </span>
            <button
              onClick={handleClearSelection}
              className="flex items-center justify-center px-md py-3 cursor-pointer group"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5 text-outline group-hover:scale-108 group-hover:text-brand-primary" />
            </button>
          </div>

          {onPublish && (
            <div
              onClick={handlePublish}
              className="bg-storey-foreground rounded-lg shadow-input flex items-center group h-11"
            >
              <div
                // onClick={handleClearSelection}
                className="flex items-center justify-center pl-md py-3 cursor-pointer"
              >
                {publishingMultiple ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <CloudUpload className="w-5 h-5 text-outline" />
                )}
              </div>
              <span className="text-body pr-md pl-3 py-sm cursor-pointer">
                Publish
              </span>
            </div>
          )}

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="bg-storey-foreground rounded-lg shadow-input px-main py-md flex items-center gap-5 group cursor-pointer h-11"
              aria-label="Delete selected"
            >
              {deletingMultiple ? (
                <Spinner color="red" className="w-5 h-5" />
              ) : (
                <Trash2 className="w-5 h-5 text-outline group-hover:text-red-500 group-hover:scale-105" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
