import { fetchDeletedBrands, fetchBrandDetails, fetchBrands, fetchBrandsStats, fetchBrandsByManufacturer } from "@/features/brands/services/queryFunctions";
import { CreateBrandPayload } from "@/features/brands/types";
import { GeneralFetchingParams } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";


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
      api.post("/brands", payload), 
    invalidateQueries: [["all-brands"]]
  });
};

export const useUpdateBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateBrandPayload, id: string}) =>
      api.patch(`/brands/${id}`, payload), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};

export const useDeleteBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/brands/${id}`), 
    invalidateQueries: [["all-brands"]]
  });
};

export const useUpdateBrandStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, status}: {id: string, status: string}) =>
      api.patch(`/brands/${id}/status`, {status}), 
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
      api.post(`/brands/${id}/activate`), 
    invalidateQueries: [["all-brands"], ["brand-details"]]
  });
};
export const useSuspendBrand = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post(`/brands/${id}/suspend`), 
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