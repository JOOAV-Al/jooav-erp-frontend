"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface GroupTableHeaderProps {
  label: string;
  count: number;
  withCheckbox?: boolean;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

/** Zero-pad count to 2 digits: 2 → "02", 14 → "14" */
const padCount = (n: number) => String(n).padStart(2, "0");

/**
 * GroupTableHeader
 *
 * A full-width header bar that sits above a <table>.
 * It intentionally does NOT use <thead>/<th> — it's a plain flex div
 * that stretches across the entire card width regardless of column count.
 *
 */
const GroupTableHeader = ({
  label,
  count,
  withCheckbox = false,
  isAllSelected = false,
  isSomeSelected = false,
  onSelectAll,
}: GroupTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-md py-3 border-b-2 border-border-main bg-white w-full h-[39px]">
      <div className="flex items-center gap-3">
        {withCheckbox && (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={(checked) => onSelectAll?.(!!checked)}
            aria-label={`Select all ${label}`}
            className={`border-border-accent! shrink-0 ${
              isSomeSelected ? "data-[state=checked]:bg-brand-primary" : ""
            }`}
          />
        )}
        <h5 className="">{label}</h5>
      </div>
      <div
        className={`flex justify-center items-center rounded-main bg-storey-foreground h-[18px] py-2 px-5 table-tag w-fit`}
      >
        <span className="text-[12px] tracking-[0.08em] leading-[1.2] text-center font-normal text-heading font-mono">
          {padCount(count)}
        </span>
      </div>
      
    </div>
  );
};

export default GroupTableHeader;
