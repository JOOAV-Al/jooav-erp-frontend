import React from "react";
import { LucideIcon } from "lucide-react";

interface FieldIconProps {
  Icon: LucideIcon;
  className?: string;
}

const FieldIcon: React.FC<FieldIconProps> = ({ Icon, className }) => {
  return (
    <Icon
      className={className || "h-5 w-5 text-gray-400"}
      strokeWidth={1.5}
    />
  );
};

export default FieldIcon;
