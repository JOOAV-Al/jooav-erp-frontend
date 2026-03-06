import React from "react";

interface DashboardStatsCardProps {
  value: string;
  label: string;
  className?: string;
}
const DashboardStatsCard = ({
  value,
  label,
  className,
}: DashboardStatsCardProps) => {
  return (
    <div
      className={`py-lg px-xl flex flex-col gap-sm bg-white w-full rounded-2xl ${className}`}
    >
      <div className="h-[84px] flex flex-col justify-between">
        <p className="font-mono text-xs leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
          {label}
        </p>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

export default DashboardStatsCard;
