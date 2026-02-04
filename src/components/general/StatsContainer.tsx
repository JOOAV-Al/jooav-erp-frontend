import DashboardCard from '@/components/general/DashboardCard';
import React from 'react'

interface StatsContainerProps {
 value: string;
 label: string;
}
const StatsContainer = ({ stats }: {stats: StatsContainerProps[]}) => {
  return (
    <div className="flex flex-col mdx:flex-row py-main gap-6 border-b border-[#EDEDED]">
      {stats.map((stat, i) => (
        <DashboardCard
          className={`${
            i !== stats.length - 1
              ? "border-b mdx:border-b-0 mdx:border-r border-[#EDEDED]"
              : ""
          }`}
          key={i}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
};

export default StatsContainer