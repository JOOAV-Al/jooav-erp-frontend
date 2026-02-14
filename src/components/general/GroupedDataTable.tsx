"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudUpload, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import Spinner from "@/components/general/Spinner";
import EmptyState from "@/components/general/EmptyState";
import { TableSkeleton } from "@/components/general/TableSkeleton";
import GroupTableHeader from "@/components/general/GroupTableHeader";
// import GroupTableHeader from "@/components/general/GroupTableHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

type Column<T> = {
  key?: keyof T | string;
  activeColor?: boolean;
  label?: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  /** Optional fixed width class e.g. "w-10" or "w-36" */
  width?: string;
};

export interface UserGroup<T> {
  /** Header label: "Admin accounts" */
  label: string;
  /** The data rows for this group */
  data: T[];
  /** Override displayed count (defaults to data.length) */
  count?: number;
}

interface GroupedDataTableProps<T> {
  groups: UserGroup<T>[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => any;
  withCheckbox?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  onDelete?: (selectedRows: T[]) => void;
  onPublish?: (selectedRows: T[]) => void;
  deletingMultiple?: boolean;
  deletingMultipleStatus?: string;
  publishingMultiple?: boolean;
  publishingMultipleStatus?: string;
  emptyHeader?: string;
  emptyDescription?: string;
  emptyImage?: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((acc, part) => acc?.[part], obj);

const isISODate = (str: string): boolean =>
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(str);

const resolveCell = <T,>(col: Column<T>, row: T): React.ReactNode => {
  if (col.render) return col.render(row);
  if (!col.key) return "Nil";

  const val = (col.key as string).includes(".")
    ? getNestedValue(row, col.key as string)
    : row[col.key as keyof T];

  if (val instanceof Date) return format(val, "dd MMMM, yyyy");
  if (typeof val === "string" && isISODate(val)) {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) return format(parsed, "dd/MM/yyyy");
  }

  return String(val ?? "Nil");
};

// ─── Single group card ────────────────────────────────────────────────────────

function GroupCard<T>({
  group,
  columns,
  onRowClick,
  getRowId,
  withCheckbox,
  selectedRows,
  onSelectRow,
  onSelectAll,
}: {
  group: UserGroup<T>;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  getRowId: (row: T) => any;
  withCheckbox?: boolean;
  selectedRows: Set<any>;
  onSelectRow: (row: T, checked: boolean) => void;
  onSelectAll: (checked: boolean, rows: T[]) => void;
}) {
  const { label, data, count } = group;
  const displayCount = count ?? data.length;

  const groupIds = new Set(data.map(getRowId));
  const selectedInGroup = [...selectedRows].filter((id) => groupIds.has(id));
  const isAllSelected =
    data.length > 0 && selectedInGroup.length === data.length;
  const isSomeSelected =
    selectedInGroup.length > 0 && selectedInGroup.length < data.length;

  return (
    <div className="rounded-2xl border-[1.5px] border-border-main overflow-hidden">
      {/*
        GroupTableHeader is a plain flex div — intentionally NOT a <thead>.
        It spans the full card width as a single bar regardless of column count,
        which is exactly what the design calls for. The actual <table> below
        has no <thead> at all — just a body with a <colgroup> for width hints.
      */}
      <GroupTableHeader
        label={label}
        count={displayCount}
        withCheckbox={false}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onSelectAll={(checked) => onSelectAll(checked, data)}
      />

      <Table className="mb-0!" >
        {/*
          <colgroup> gives the browser column-width hints without needing
          visible header cells. This keeps cell alignment stable across all
          rows even though there's no <thead>.
        */}
        <colgroup>
          {withCheckbox && <col className="w-12" />}
          {columns.map((col, i) => (
            <col key={i} className={col.width ?? ""} />
          ))}
        </colgroup>

        <TableBody className="">
          {data.map((row, i) => {
            const rowId = getRowId(row);
            const isSelected = selectedRows.has(rowId);
            const isLast = i === data.length - 1;

            return (
              <TableRow
                key={i}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('[role="checkbox"]')) {
                    onRowClick?.(row);
                  }
                }}
                className={`
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${isSelected ? "bg-storey-foreground" : "hover:bg-storey-foreground"}
                  ${isLast ? "border-b-0" : ""}
                `}
                data-state={isSelected ? "selected" : undefined}
              >
                {withCheckbox && (
                  <TableCell className="w-12">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelectRow(row, !!checked)}
                      aria-label={`Select row ${i + 1}`}
                    />
                  </TableCell>
                )}

                {columns.map((col, j) => (
                  <TableCell
                    key={j}
                    className={`${
                      col.activeColor ? "text-body" : "text-body-passive"
                    } ${col.width ?? ""}`}
                  >
                    {resolveCell(col, row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function GroupedDataTable<T>({
  groups,
  columns,
  loading = false,
  onRowClick,
  getRowId = (row: any) => row.id,
  withCheckbox,
  onSelectionChange,
  onDelete,
  onPublish,
  deletingMultiple = false,
  deletingMultipleStatus,
  publishingMultiple = false,
  publishingMultipleStatus,
  emptyHeader = "No records",
  emptyDescription = "No data to display yet.",
  emptyImage = "/dashboard/import-csv.svg",
  emptyCta,
  onEmptyCta,
}: GroupedDataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());

  const allData = groups.flatMap((g) => g.data);

  const updateSelection = (next: Set<any>) => {
    setSelectedRows(next);
    onSelectionChange?.(allData.filter((r) => next.has(getRowId(r))));
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const next = new Set(selectedRows);
    if (checked) next.add(getRowId(row));
    else next.delete(getRowId(row));
    updateSelection(next);
  };

  const handleSelectAll = (checked: boolean, rows: T[]) => {
    const next = new Set(selectedRows);
    rows.forEach((r) =>
      checked ? next.add(getRowId(r)) : next.delete(getRowId(r)),
    );
    updateSelection(next);
  };

  const handleClearSelection = () => updateSelection(new Set());

  const handleDelete = () =>
    onDelete?.(allData.filter((r) => selectedRows.has(getRowId(r))));

  const handlePublish = () =>
    onPublish?.(allData.filter((r) => selectedRows.has(getRowId(r))));

  useEffect(() => {
    if (deletingMultipleStatus === "success") handleClearSelection();
  }, [deletingMultipleStatus]);

  useEffect(() => {
    if (publishingMultipleStatus === "success") handleClearSelection();
  }, [publishingMultipleStatus]);

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[6, 4].map((rows, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border-main overflow-hidden"
          >
            <div className="h-[49px] bg-[#F7F7F7] border-b border-border-main animate-pulse" />
            <TableSkeleton
              columns={columns.length}
              rows={rows}
              withCheckbox={withCheckbox}
            />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────

  const hasAnyData = groups.some((g) => g.data.length > 0);
  if (!hasAnyData) {
    return (
      <div className="bg-white rounded-2xl border border-border-main p-8">
        <EmptyState
          header={emptyHeader}
          description={emptyDescription}
          image={emptyImage}
          cta={emptyCta}
          onCTAClick={onEmptyCta}
        />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-7 py-sm relative">
      {groups
        .filter((g) => g.data.length > 0)
        .map((group, i) => (
          <GroupCard
            key={i}
            group={group}
            columns={columns}
            onRowClick={onRowClick}
            getRowId={getRowId}
            withCheckbox={withCheckbox}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
          />
        ))}

      {/* ── Floating bulk actions ── */}
      {withCheckbox && selectedRows.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center max-w-97.5 w-full gap-6">
          <div className="bg-storey-foreground rounded-lg shadow-input flex items-center h-11">
            <span className="text-body px-md py-sm border-r-2 border-border-main">
              {selectedRows.size} Selected
            </span>
            <button
              onClick={handleClearSelection}
              className="flex items-center justify-center px-md py-3 cursor-pointer group"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5 text-outline group-hover:scale-105 group-hover:text-brand-primary" />
            </button>
          </div>

          {onPublish && (
            <div
              onClick={handlePublish}
              className="bg-storey-foreground rounded-lg shadow-input flex items-center group h-11 cursor-pointer"
            >
              <div className="flex items-center justify-center pl-md py-3">
                {publishingMultiple ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <CloudUpload className="w-5 h-5 text-outline" />
                )}
              </div>
              <span className="text-body pr-md pl-3 py-sm">Publish</span>
            </div>
          )}

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

export default GroupedDataTable;
