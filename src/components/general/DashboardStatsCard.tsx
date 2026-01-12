import React from "react";

interface DashboardStatsCardProps {
  value: string;
  label: string;
}
const DashboardStatsCard = ({ value, label }: DashboardStatsCardProps) => {
  return (
    <div className="py-main px-lg flex flex-col gap-sm bg-storey-foreground border border-[#EDEDED] max-w-[228px] w-full rounded-lg">
      <h1>{value}</h1>
      <p className="font-mono text-xs uppercase text-body-passive">{label}</p>
    </div>
  );
};

export default DashboardStatsCard;
