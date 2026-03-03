import { fetchDeletedVariants, fetchVariantDetails, fetchVariants, fetchVariantsStats, fetchVariantsByManufacturer } from "@/features/variants/services/queryFunctions";
import { VariantItem, CreateVariantPayload } from "@/features/variants/types";
import { GeneralFetchingParams } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { handleBulkMutationMessage } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetVariants = (params: GeneralFetchingParams) => {
  const {search, status, brandId, sortBy, sortOrder, page, limit} = params
  return useQuery({
    queryKey: ["all-variants", search, status, brandId, sortBy, sortOrder, page, limit],
    queryFn: () => fetchVariants(params),
    retry: 2,
  });
};

export const useGetDeletedVariants = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-deleted-variants"],
    queryFn: () => fetchDeletedVariants(params),
    retry: 2,
  });
};

export const useGetVariantsByManufacturer = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-variants-by-manufacturer"],
    queryFn: () => fetchVariantsByManufacturer(params),
    retry: 2,
  });
};

export const useGetVariantDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["variant-details", id],
    queryFn: () => fetchVariantDetails({id}),
    retry: 2,
  });
};

export const useCreateVariant = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateVariantPayload) =>
      api.post<VariantItem>("/variants", payload), 
    invalidateQueries: [["all-variants"], ["variants-stats"]]
  });
};

export const useUpdateVariant = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateVariantPayload, id: string}) =>
      api.patch<VariantItem>(`/variants/${id}`, payload), 
    invalidateQueries: [["all-variants"], ["variant-details"]]
  });
};

export const useDeleteVariant = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/variants/${id}`), 
    invalidateQueries: [["all-variants"], ["variant-details"], ["variants-stats"]]
  });
};

export const useDeleteMultipleVariants = () => {
  const queryClient = useQueryClient()
  return useInvalidatingMutation({
    mutationFn: ({variantIds}: {variantIds: string[]}) =>
      api.post(`/variants/bulk/delete`, {variantIds}), 
    invalidateQueries: [["all-variants"], ["variants-stats"]],
        onSuccess: (data) => {
      const res = data?.data
      const {hasSuccess} = handleBulkMutationMessage(res, "Variant")
      if(hasSuccess) {
        queryClient.invalidateQueries({queryKey: ["all-variant"]})
        queryClient.invalidateQueries({queryKey: ["variant-stats"]})
      }
    }
  });
};

export const useUpdateVariantStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, status}: {id: string, status: string}) =>
      api.patch<VariantItem>(`/variants/${id}/status`, {status}), 
    invalidateQueries: [["all-variants"], ["variant-details"]]
  });
};

export const useUpdateVariantLogo = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, logo}: {id: string, logo: string}) =>
      api.put(`/variants/${id}/logo`, {logo}), 
    invalidateQueries: [["all-variants"], ["variant-details"]]
  });
};
export const useDeleteVariantLogo = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/variants/${id}/logo`), 
    invalidateQueries: [["all-variants"], ["variant-details"]]
  });
};

export const useActivateVariant = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<VariantItem>(`/variants/${id}/activate`), 
    invalidateQueries: [["all-variants"], ["variant-details"]]
  });
};
export const useSuspendVariant = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<VariantItem>(`/variants/${id}/suspend`), 
    invalidateQueries: [["all-variants"], ["variant-details"]]
  });
};

export const useGetVariantsStats = () => {
  return useQuery({
    queryKey: ["variants-stats"],
    queryFn: fetchVariantsStats,
    retry: 2,
  });
};