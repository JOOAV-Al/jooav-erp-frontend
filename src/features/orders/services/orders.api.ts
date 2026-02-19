import { fetchOrderDetails, fetchOrders, fetchOrdersStats } from "@/features/orders/services/queryFunctions";
import { Order, CreateOrderPayload } from "@/features/orders/types";
import { GeneralFetchingParams, MutationResponse } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";
import { AxiosHeaders, AxiosRequestHeaders } from "axios";


export const useGetOrders = (params: GeneralFetchingParams) => {
  const {search, status, sortOrder, page, limit} = params
  return useQuery({
    queryKey: ["all-orders", search, status, sortOrder, page, limit],
    queryFn: () => fetchOrders(params),
    retry: 2,
  });
};

export const useGetOrderDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["order-details", id],
    queryFn: () => fetchOrderDetails({id}),
    retry: 2,
  });
};

export const useCreateOrder = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      api.post<MutationResponse<Order>>("/orders", payload,), 
    invalidateQueries: [["all-orders"], ["orders-stats"]]
  });
};

export const useSubmitDraftOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateOrderPayload, id: string}) =>
      api.post<Order>(`/orders/${id}/submit`, payload), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useUpdateOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateOrderPayload, id: string}) =>
      api.patch<MutationResponse<Order>>(`/orders/${id}`, payload), 
    invalidateQueries: [["all-orders"], ["order-details"]]
  });
};

export const useDeleteOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/orders/${id}`), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useDeleteMultipleOrders = () => {
  return useInvalidatingMutation({
    mutationFn: ({orderIds}: {orderIds: string[]}) =>
      api.post(`/orders/bulk/delete`, {orderIds}), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useUpdateOrderStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, payload}: {id: string, payload: CreateOrderPayload}) =>
      api.patch<Order>(`/orders/${id}/status`, {payload}), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useAssignOfficerToOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, payload}: {id: string, payload: CreateOrderPayload}) =>
      api.patch<Order>(`/orders/${id}/assign`, {payload}), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useConfirmOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.patch<Order>(`/orders/${id}/confirm`), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useGetOrdersStats = () => {
  return useQuery({
    queryKey: ["orders-stats"],
    queryFn: fetchOrdersStats,
    retry: 2,
  });
};