import { Order, OrderStatsItem } from "@/features/orders/types"
import { GeneralFetchingParams, PaginatedOrdersResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchOrders (params: GeneralFetchingParams): Promise<PaginatedOrdersResponse<Order>> {
  const {search, status, sortOrder, page, limit} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/orders?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchOrderDetails ({orderNumber}: {orderNumber: string}): Promise<Order> {
  const response = await api.get(`/orders/${orderNumber}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchOrdersStats (): Promise<OrderStatsItem> {
  const response = await api.get(`/orders/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}