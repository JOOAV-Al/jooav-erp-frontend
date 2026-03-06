import { Order } from "@/features/orders/types";
import { User } from "@/interfaces/authentication";
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  activeOrders: Order[];
  recentUsers: User[];
  stats: {
    totalRevenue: number;
    completedOrders: number;
    liveProducts: number;
    allUsers: number;
  }
}
export async function fetchDashboardData (): Promise<DashboardData> {
  const response = await api.get(`/admin/dashboard`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => fetchDashboardData(),
    retry: 2,
  });
};