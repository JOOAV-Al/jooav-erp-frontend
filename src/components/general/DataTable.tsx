import React from "react";
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
// import Pagination from "./Pagination";
// import CustomLoader from "@/components/layouts/landing-page/CustomLoader";
// import NoDataBox from "./NoDataBox";
// import { format } from "date-fns";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  withPagination?: boolean;
  loading?: boolean;
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
}

function DataTable<T>({
  data,
  columns,
  loading = false,
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
}: // isRefetching = false,
DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader className="bg-primary-50 hover:bg-primary-100">
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="hover:bg-white">
                <div className="bg-white flex flex-col items-center justify-center rounded-[10px] py-8 px-4 overflow-hidden h-[400px]">
                  <Spinner className="text-brand-primary" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : data?.length === 0 ? (
          <TableBody>
            <TableRow className="hover:bg-white">
              <TableCell colSpan={columns.length}>
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
            {data?.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns?.map((col, j) => (
                  <TableCell key={j}>
                    {(() => {
                      if (!col.key) return "nil";
                      if (col.render) return col.render(row);

                      const val = row[col.key as keyof T];
                      // If it's already a Date
                      if (val instanceof Date) return format(val, "dd MMMM, yyyy");

                      // If it's a string or number that can be parsed as a date (ISO, timestamp, etc.)
                      if (typeof val === "string" || typeof val === "number") {
                        const parsed = new Date(val as any);
                        if (!isNaN(parsed.getTime())) return format(parsed, "dd/MM/yyyy");
                      }

                      return String(val ?? "nil");
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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
    </div>
  );
}

export default DataTable;
