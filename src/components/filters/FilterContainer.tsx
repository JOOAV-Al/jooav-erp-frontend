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
        <span className="text-[13px] text-body font-semibold">{label}:</span>
      )}
      {children}
    </div>
  );
};

export default FilterContainer;
