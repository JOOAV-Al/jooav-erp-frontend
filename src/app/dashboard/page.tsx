"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

const MarketplaceDashboardHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening on Jooav today.
        </p>
      </div>

      {/* Placeholder stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: "—" },
          { label: "Pending Payments", value: "—" },
          { label: "Saved Items", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 flex flex-col gap-2"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder recent activity */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold text-base mb-4">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">
          No recent activity yet. Head to the{" "}
          <Link
            href="/dashboard/marketplace"
            className="text-primary underline"
          >
            Marketplace
          </Link>{" "}
          to start browsing products.
        </p>
      </div>
    </div>
  );
};

export default MarketplaceDashboardHome;
