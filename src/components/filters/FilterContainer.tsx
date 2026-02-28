import React from "react";

interface FilterContainerProps {
  label?: string;
  children: React.ReactNode;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
  label,
  children,
}) => {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      {label && (
        <span className="text-[13px] text-body leading-[1] tracking-[0.05em] font-semibold">{label}:</span>
      )}
      {children}
    </div>
  );
};

export default FilterContainer;
