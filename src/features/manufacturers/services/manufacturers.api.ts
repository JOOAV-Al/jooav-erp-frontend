import { fetchDeletedManufacturers, fetchManufacturerDetails, fetchManufacturerOrders, fetchManufacturerProducts, fetchManufacturers, fetchManufacturersStats } from "@/features/manufacturers/services/queryFunctions";
import { CreateManufacturerPayload } from "@/features/manufacturers/types";
import { GeneralFetchingParams } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";


export const useGetManufacturers = (params: GeneralFetchingParams) => {
  const {search, status, country, state, page, limit} = params
  return useQuery({
    queryKey: ["all-manufacturers", search, status, country, state, page, limit],
    queryFn: () => fetchManufacturers(params),
    retry: 2,
  });
};

export const useGetDeletedManufacturers = (params: GeneralFetchingParams) => {
  const {search, status, country, state, page, limit} = params
  return useQuery({
    queryKey: ["all-deleted-manufacturers", search, status, country, state, page, limit],
    queryFn: () => fetchDeletedManufacturers(params),
    retry: 2,
  });
};

export const useGetManufacturerProducts = (params: GeneralFetchingParams) => {
  const {id, search, page, limit} = params
  return useQuery({
    queryKey: ["all-manufacturer-products", id, search, page, limit],
    queryFn: () => fetchManufacturerProducts(params),
    retry: 2,
  });
};
export const useGetManufacturerOrders = (params: GeneralFetchingParams) => {
  const {id, search, page, limit} = params
  return useQuery({
    queryKey: ["all-manufacturer-orders", id, search, page, limit],
    queryFn: () => fetchManufacturerOrders(params),
    retry: 2,
  });
};

export const useGetManufacturerDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["manufacturer-details", id],
    queryFn: () => fetchManufacturerDetails({id}),
    retry: 2,
  });
};

export const useCreateManufacturer = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateManufacturerPayload) =>
      api.post("/manufacturers", payload), 
    invalidateQueries: [["all-manufacturers"]]
  });
};

export const useUpdateManufacturer = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateManufacturerPayload, id: string}) =>
      api.patch(`/manufacturers/${id}`, payload), 
    invalidateQueries: [["all-manufacturers"], ["manufacturer-details"]]
  });
};

export const useDeleteManufacturer = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/manufacturers/${id}`), 
    invalidateQueries: [["all-manufacturers"]]
  });
};

export const useUpdateManufacturerStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, status}: {id: string, status: string}) =>
      api.patch(`/manufacturers/${id}/status`, {status}), 
    invalidateQueries: [["all-manufacturers"], ["manufacturer-details"]]
  });
};

export const useActivateManufacturer = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post(`/manufacturers/${id}/activate`), 
    invalidateQueries: [["all-manufacturers"], ["manufacturer-details"]]
  });
};
export const useSuspendManufacturer = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post(`/manufacturers/${id}/suspend`), 
    invalidateQueries: [["all-manufacturers"], ["manufacturer-details"]]
  });
};

export const useGetManufacturersStats = () => {
  return useQuery({
    queryKey: ["manufacturers-stats"],
    queryFn: fetchManufacturersStats,
    retry: 2,
  });
};