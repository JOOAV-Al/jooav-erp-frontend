import React, { useState } from "react";
import { CloudUpload, List, ListPlus, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleFilterProps {
  value?: string;
  onChange?: (value: string) => void;
  isUsers?: boolean;
}

const RoleFilter: React.FC<RoleFilterProps> = ({
  value = "",
  onChange,
  isUsers,
}) => {
  const [role, setRole] = useState<string>(value);

  const handleToggle = (newValue: string) => {
    setRole(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center flex-wrap gap-6">
      <Button
        size={"filter"}
        variant={"filter"}
        onClick={() => handleToggle("")}
        className={`
          ${role === "" ? "bg-storey-foreground text-body" : ""}
        `}
      >
        {/* <List strokeWidth={2.5} className="w-3.5 h-3.5 text-outline-passive" /> */}
        All
      </Button>
      {isUsers && (
        <>
          <Button
            size={"filter"}
            variant={"filter"}
            onClick={() => handleToggle("SUPER_ADMIN")}
            className={`
          ${role === "SUPER_ADMIN" ? "bg-storey-foreground text-body" : ""}
        `}
          >
            {/* <PenLine
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            /> */}
            S. admin
          </Button>

          <Button
            onClick={() => handleToggle("ADMIN")}
            size={"filter"}
            variant={"filter"}
            className={`
          ${role === "ADMIN" ? "bg-storey-foreground text-body" : ""}
        `}
          >
            {/* <ListPlus
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            /> */}
            Admin
          </Button>
          <Button
            onClick={() => handleToggle("PROCUREMENT_OFFICER")}
            size={"filter"}
            variant={"filter"}
            className={`
          ${role === "PROCUREMENT_OFFICER" ? "bg-storey-foreground text-body hover:bg-storey-foreground" : ""}
        `}
          >
            {/* <CloudUpload
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            /> */}
            Procurement
          </Button>
          <Button
            onClick={() => handleToggle("WHOLESALER")}
            size={"filter"}
            variant={"filter"}
            className={`
          ${role === "WHOLESALER" ? "bg-storey-foreground text-body hover:bg-storey-foreground" : ""}
        `}
          >
            {/* <CloudUpload
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-outline-passive"
            /> */}
            Wholesaler
          </Button>
        </>
      )}
    </div>
  );
};

export default RoleFilter;
