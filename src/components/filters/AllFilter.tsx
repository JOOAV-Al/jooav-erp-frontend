import React from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AllFilterProps {
  onClick?: () => void;
}

const AllFilter: React.FC<AllFilterProps> = ({ onClick }) => {
  return (
    <Button size={"filter"} variant={"filter"} onClick={onClick}>
      <List className="w-4 h-4 text-outline-passive" />
      All
    </Button>
  );
};

export default AllFilter;
