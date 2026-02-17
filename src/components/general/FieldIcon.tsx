import { LucideProps, Package } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

interface FieldIconProps {
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  className?: string;
}
const FieldIcon = ({ Icon=Package }: FieldIconProps) => {
  return <Icon className={`h-5 w-5 text-outline-passive `} strokeWidth={2} />;
};

export default FieldIcon;
