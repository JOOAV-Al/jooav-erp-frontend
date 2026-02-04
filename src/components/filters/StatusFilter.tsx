import React, { useState } from "react";
import {
  CloudUpload,
  ListPlus,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusFilterProps {
  value?: "draft" | "queue" | "live";
  onChange?: (value: "draft" | "queue" | "live") => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  value = "queue",
  onChange,
}) => {
  const [status, setStatus] = useState<"draft" | "queue" | "live">(value);

  const handleToggle = (newValue: "draft" | "queue" | "live") => {
    setStatus(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-6">
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("draft")}
        className={`
          ${status === "draft" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <PenLine strokeWidth={2.5} className="w-4 h-4 text-outline-passive" />
        Draft
      </Button>

      <Button
        onClick={() => handleToggle("queue")}
        size={"filter"}
        variant={"filter"}
        className={`
          ${status === "queue" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        <ListPlus strokeWidth={2.5} className="w-4 h-4 text-outline-passive" />
        Queue
      </Button>
      <Button
        onClick={() => handleToggle("live")}
        size={"filter"}
        variant={"filter"}
        className={`
          ${status === "live" ? "bg-storey-foreground text-body hover:bg-storey-foreground" : ""}
        `}
      >
        <CloudUpload
          strokeWidth={2.5}
          className="w-4 h-4 text-outline-passive"
        />
        Live
      </Button>
    </div>
  );
};

export default StatusFilter;
