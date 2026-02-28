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
      <p className="font-mono text-xs leading-[1.2] tracking-[0.08em] uppercase text-body-passive">{label}</p>
      <h2>{value}</h2>
    </div>
  );
};

export default DashboardCard;
