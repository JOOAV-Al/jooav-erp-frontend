import React from "react";

interface DashboardCardProps {
  value: string;
  label: string;
  className?: string;
}
const DashboardCard = ({ value, label, className }: DashboardCardProps) => {
  return (
    <div
      className={`py-main px-xl flex flex-col gap-sm bg-white mdx:max-w-[236px] w-full ${className}`}
    >
      <p className="font-mono text-xs uppercase text-body-passive">{label}</p>
      <h1>{value}</h1>
    </div>
  );
};

export default DashboardCard;
