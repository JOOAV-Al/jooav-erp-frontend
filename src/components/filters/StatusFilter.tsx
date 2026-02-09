import React, { useState } from "react";
import { CloudUpload, List, ListPlus, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusFilterProps {
  value?: string;
  onChange?: (value: string) => void;
  isProducts?: boolean;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  value = "",
  onChange,
  isProducts,
}) => {
  const [status, setStatus] = useState<string>(value);

  const handleToggle = (newValue: string) => {
    setStatus(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center flex-wrap gap-6">
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("")}
        className={`
          ${status === "" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <List strokeWidth={2.5} className="w-3.5 h-3.5 text-outline-passive" />
        All
      </Button>
      {isProducts && (
        <>
          <Button
            size={"filter"}
            variant={"filter"}
            onClick={() => handleToggle("DRAFT")}
            className={`
          ${status === "DRAFT" ? "bg-storey-foreground text-body" : ""}
        `}
          >
            <PenLine
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            />
            Draft
          </Button>

          <Button
            onClick={() => handleToggle("QUEUE")}
            size={"filter"}
            variant={"filter"}
            className={`
          ${status === "QUEUE" ? "bg-storey-foreground text-body" : ""}
        `}
          >
            <ListPlus
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            />
            Queue
          </Button>
          <Button
            onClick={() => handleToggle("LIVE")}
            size={"filter"}
            variant={"filter"}
            className={`
          ${status === "LIVE" ? "bg-storey-foreground text-body hover:bg-storey-foreground" : ""}
        `}
          >
            <CloudUpload
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            />
            Live
          </Button>
        </>
      )}
    </div>
  );
};

export default StatusFilter;
