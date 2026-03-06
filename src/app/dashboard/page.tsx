"use client";
import DashboardStatsCard from "@/components/general/DashboardStatsCard";
import EmptyState from "@/components/general/EmptyState";
import Spinner from "@/components/general/Spinner";
import LogoutButton from "@/features/auth/components/LogoutButton";
import DashboardActiveOrders from "@/features/orders/components/DashboardActiveOrders";
import DashboardUsers from "@/features/users/components/DashboardUsers";
import { useGetDashboardData } from "@/hooks/dashboard.api";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const SuperAdminDashboardHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isPending, refetch } = useGetDashboardData();
  const users = data?.recentUsers;
  const orders = data?.activeOrders;
  const stats = data?.stats;

  const displayStats = [
    {
      value: stats?.totalRevenue ? `${stats?.totalRevenue}` : "0",
      label: "Revenue",
    },
    {
      value: stats?.completedOrders ? `${stats?.completedOrders}` : "0",
      label: "Completed Orders",
    },
    {
      value: stats?.liveProducts ? `${stats?.liveProducts}` : "0",
      label: "Live Products",
    },
    {
      value: stats?.allUsers ? `${stats?.allUsers}` : "0",
      label: "All Users",
    },
  ];
  return (
    <div className="flex flex-col gap-5 px-sm pb-main">
      {isPending ? (
        <div className="flex min-h-[80vh] justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col mdx:flex-row py-main gap-6">
            {displayStats?.map((stat, i) => (
              <DashboardStatsCard
                key={i}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-main">
            <div className="col-span-10 xl:col-span-7 pt-sm pb-md bg-white rounded-2xl flex flex-col min-h-[70vh]">
              <DashboardActiveOrders orders={orders} />
            </div>
            <div className="col-span-10 xl:col-span-3 pt-sm pb-md bg-white rounded-2xl flex flex-col min-h-[70vh]">
              <DashboardUsers users={users} />
            </div>
          </div>

          {/* <div>
            <h2>
              Hi {user?.firstName} {user?.lastName}
            </h2>
            <LogoutButton />
          </div> */}
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboardHome;
