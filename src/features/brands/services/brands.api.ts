import { fetchDeletedBrands, fetchBrandDetails, fetchBrands, fetchBrandsStats, fetchBrandsByManufacturer } from "@/features/brands/services/queryFunctions";
import { BrandItem, CreateBrandPayload } from "@/features/brands/types";
import { BulkMutationResponse, DefaultBulkMutationData, GeneralFetchingParams } from "@/interfaces/general";
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { handleBulkMutationMessage } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosHeaders, AxiosRequestHeaders } from "axios";
import { toast } from "sonner";


export const useGetBrands = (params: GeneralFetchingParams) => {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit} = params
  return useQuery({
    queryKey: ["all-brands", search, status, manufacturerId, sortBy, sortOrder, page, limit],
    queryFn: () => fetchBrands(params),
    retry: 2,
  });
};

export const useGetDeletedBrands = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-deleted-brands"],
    queryFn: () => fetchDeletedBrands(params),
    retry: 2,
  });
};

export const useGetBrandsByManufacturer = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-brands-by-manufacturer"],
    queryFn: () => fetchBrandsByManufacturer(params),
    retry: 2,
  });
};

export const useGetBrandDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["brand-details", id],
    queryFn: () => fetchBrandDetails({id}),
    retry: 2,
  });
};

export const useCreateBrand = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateBrandPayload) =>
      api.post<BrandItem>("/brands", payload, {headers: {
          "Content-Type": "multipart/form-data",
        } as AxiosRequestHeaders}), 
    invalidateQueries: [["all-brands"], ["brands-stats"]]
  });
};

export const useUpdateBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateBrandPayload, id: string}) =>
      api.patch<BrandItem>(`/brands/${id}`, payload, {headers: {
          "Content-Type": "multipart/form-data",
        } as AxiosRequestHeaders}), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};

export const useDeleteBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/brands/${id}`), 
    invalidateQueries: [["all-brands"], ["brand-details"], ["brands-stats"]]
  });
};

export const useDeleteMultipleBrands = () => {
  const queryClient = useQueryClient()
  return useInvalidatingMutation({
    mutationFn: ({brandIds}: {brandIds: string[]}) =>
      api.post<BulkMutationResponse<DefaultBulkMutationData>>(`/brands/bulk/delete`, {brandIds}, {noToast: true} as CustomAxiosRequestConfig), 
    // invalidateQueries: [["all-brands"], ["brand-details"], ["brands-stats"]],
    onSuccess: (data) => {
      const res = data?.data
      const {hasSuccess} = handleBulkMutationMessage(res, "Brands")
      if(hasSuccess) {
        queryClient.invalidateQueries({queryKey: ["all-brands"]})
        queryClient.invalidateQueries({queryKey: ["brands-details"]})
        queryClient.invalidateQueries({queryKey: ["brands-stats"]})
      }
    }
  });
};

export const useUpdateBrandStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, status}: {id: string, status: string}) =>
      api.patch<BrandItem>(`/brands/${id}/status`, {status}), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};

export const useUpdateBrandLogo = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, logo}: {id: string, logo: string}) =>
      api.put(`/brands/${id}/logo`, {logo}), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};
export const useDeleteBrandLogo = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/brands/${id}/logo`), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};

export const useActivateBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<BrandItem>(`/brands/${id}/activate`), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};
export const useSuspendBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<BrandItem>(`/brands/${id}/suspend`), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};

export const useGetBrandsStats = () => {
  return useQuery({
    queryKey: ["brands-stats"],
    queryFn: fetchBrandsStats,
    retry: 2,
  });
};