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
    <div className="flex items-center gap-6">
      {label && (
        <span className="text-sm text-heading font-medium">{label}:</span>
      )}
      {children}
    </div>
  );
};

export default FilterContainer;
