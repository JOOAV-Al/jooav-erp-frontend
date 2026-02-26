import { fetchOrderDetails, fetchOrders, fetchOrdersStats } from "@/features/orders/services/queryFunctions";
import { Order, CreateOrderPayload, UpdateOrderItemStatusPayload, UpdateMultipleOrderItemStatusPayload } from "@/features/orders/types";
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

export const useGetOrderDetails = ({orderNumber}: {orderNumber: string}) => {
  return useQuery({
    queryKey: ["order-details", orderNumber],
    queryFn: () => fetchOrderDetails({orderNumber}),
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

export const useUpdateOrderItemStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({orderNumber, id, payload}: {orderNumber: string; id: string, payload: UpdateOrderItemStatusPayload}) =>
      api.patch<Order>(`/orders/${orderNumber}/items/${id}/status`, payload), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useUpdateMultipleOrderItemStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({orderNumber, payload}: {orderNumber: string; payload: UpdateMultipleOrderItemStatusPayload}) =>
      api.patch<Order>(`/orders/${orderNumber}/items/bulk-update`, payload), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useAssignOfficerToOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({orderNumber, payload}: {orderNumber: string, payload: CreateOrderPayload}) =>
      api.patch<Order>(`/orders/${orderNumber}/assign`, payload), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useAutoAssignOfficerToOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({orderNumber}: {orderNumber: string}) =>
      api.post<Order>(`/orders/${orderNumber}/auto-assign`), 
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]]
  });
};

export const useOfficerResponseToOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({orderNumber, payload}: {orderNumber: string, payload: CreateOrderPayload}) =>
      api.patch<Order>(`/orders/${orderNumber}/assignment/respond`, payload), 
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