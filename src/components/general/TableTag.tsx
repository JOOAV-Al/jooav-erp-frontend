import { toProperCase } from '@/lib/utils';
import React from 'react'

interface TableTagProps {
  text?: string;
  className?: string;
  small?: boolean
}
const TableTag = ({text="status", small=false, className}: TableTagProps) => {
  return (
    <div
      className={`flex justify-center items-center rounded-md ${small ? "h-[21px] p-5" : "h-[25px] p-sm"} border-[0.5px] table-tag w-fit ${className}`}
    >
      <span className="text-[13px] leading-[1] tracking-[0.05em] text-center text-xs font-semibold">
        {toProperCase(text)}
      </span>
    </div>
  );
}

export default TableTag