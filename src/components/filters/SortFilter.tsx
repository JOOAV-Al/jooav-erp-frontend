import React, { useState } from "react";
import { ListEnd, ListStart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortFilterProps {
  value?: "oldest" | "newest";
  onChange?: (value: "oldest" | "newest") => void;
}

const SortFilter: React.FC<SortFilterProps> = ({
  value = "newest",
  onChange,
}) => {
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">(value);

  const handleToggle = (newValue: "oldest" | "newest") => {
    setSortOrder(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-6">
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("oldest")}
        className={`
          
          ${sortOrder === "oldest" ? "bg-storey-foreground text-heading" : ""}
        `}
      >
        <ListEnd className="w-4 h-4 text-outline-passive" />
        Oldest
      </Button>

      <Button
        onClick={() => handleToggle("newest")}
        size={"filter"}
        variant={"filter"}
        className={`
          
          ${sortOrder === "newest" ? "bg-storey-foreground text-heading" : ""}
        `}
      >
        <ListStart className="w-4 h-4 text-outline-passive" />
        Newest
      </Button>
    </div>
  );
};

export default SortFilter;
