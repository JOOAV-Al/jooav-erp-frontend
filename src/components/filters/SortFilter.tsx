import React, { useState } from "react";
import { ListEnd, ListStart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortFilterProps {
  value?: "desc" | "asc";
  onChange?: (value: "desc" | "asc") => void;
}

const SortFilter: React.FC<SortFilterProps> = ({
  value = "asc",
  onChange,
}) => {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">(value);

  const handleToggle = (newValue: "desc" | "asc") => {
    setSortOrder(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-6">
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("desc")}
        className={`
          
          ${sortOrder === "desc" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <ListEnd strokeWidth={2.5} className="w-4 h-4 text-outline-passive" />
        Oldest
      </Button>

      <Button
        onClick={() => handleToggle("asc")}
        size={"filter"}
        variant={"filter"}
        className={`
          
          ${sortOrder === "asc" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <ListStart strokeWidth={2.5} className="w-4 h-4 text-outline-passive" />
        Newest
      </Button>
    </div>
  );
};

export default SortFilter;
