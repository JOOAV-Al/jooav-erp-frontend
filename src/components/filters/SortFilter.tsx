import React, { useState } from "react";
import { List, ListEnd, ListStart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortFilterProps {
  value?: "desc" | "asc" | "";
  onChange?: (value: "desc" | "asc" | "") => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ value = "asc", onChange }) => {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | "">(value);

  const handleToggle = (newValue: "desc" | "asc" | "") => {
    setSortOrder(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center flex-wrap gap-6">
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("")}
        className={`
                ${sortOrder === "" ? "bg-storey-foreground text-body" : ""}
              `}
      >
        <List strokeWidth={2.5} className="w-3.5 h-3.5 text-outline-passive" />
        All
      </Button>
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("asc")}
        className={`
          
          ${sortOrder === "asc" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <ListEnd
          strokeWidth={2.5}
          className="w-3.5 h-3.5 text-outline-passive"
        />
        Oldest
      </Button>

      <Button
        onClick={() => handleToggle("desc")}
        size={"filter"}
        variant={"filter"}
        className={`
          
          ${sortOrder === "desc" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <ListStart
          strokeWidth={2.5}
          className="w-3.5 h-3.5 text-outline-passive"
        />
        Newest
      </Button>
    </div>
  );
};

export default SortFilter;
