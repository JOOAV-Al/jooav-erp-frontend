import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  withCheckbox?: boolean;
  columnLabels?: string[];
}

export function TableSkeleton({
  columns,
  rows = 10,
  withCheckbox = false,
  columnLabels = [],
}: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader className="bg-[#F7F7F7] h-10.5 gap-8">
        <TableRow>
          {withCheckbox && (
            <TableHead className="w-12">
              <Checkbox disabled aria-label="Select all" />
            </TableHead>
          )}
          {columnLabels.length > 0
            ? columnLabels.map((label, i) => (
                <TableHead key={i}>{label}</TableHead>
              ))
            : Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-transparent">
            {withCheckbox && (
              <TableCell className="w-12">
                <Checkbox disabled aria-label={`Select row ${rowIndex + 1}`} />
              </TableCell>
            )}
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton
                  className="h-5"
                  style={{
                    width: `${Math.floor(Math.random() * 40) + 60}%`,
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
