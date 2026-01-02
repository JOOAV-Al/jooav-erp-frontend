import { fetchDeactivatedCategories, fetchCategoryDetails, fetchCategories, fetchCategoriesStats, fetchCategoriesTree, fetchCategoriesSubcategories } from "@/features/categories/services/queryFunctions";
import { CreateCategoryPayload, CategoryItem, UpdateBulkCategoryPayload } from "@/features/categories/types";
import { GeneralFetchingParams } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";


export const useGetCategories = (params: GeneralFetchingParams) => {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit} = params
  return useQuery({
    queryKey: ["all-categories", search, status, manufacturerId, sortBy, sortOrder, page, limit],
    queryFn: () => fetchCategories(params),
    retry: 2,
  });
};

export const useGetDeactivatedCategories = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-deactivated-categories"],
    queryFn: () => fetchDeactivatedCategories(params),
    retry: 2,
  });
};

export const useGetCategoriesTree = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-categories-tree"],
    queryFn: () => fetchCategoriesTree(params),
    retry: 2,
  });
};

export const useGetCategoriesSubcategories = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-categories-subcategories"],
    queryFn: () => fetchCategoriesSubcategories(params),
    retry: 2,
  });
};

export const useGetCategoryDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["category-details", id],
    queryFn: () => fetchCategoryDetails({id}),
    retry: 2,
  });
};

export const useCreateCategory = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      api.post<CategoryItem>("/categories", payload), 
    invalidateQueries: [["all-categories"]]
  });
};

export const useUpdateCategory = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateCategoryPayload, id: string}) =>
      api.patch<CategoryItem>(`/categories/${id}`, payload), 
    invalidateQueries: [["all-categories"], ["category-details"]]
  });
};

export const useDeleteCategory = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete<CategoryItem>(`/categories/${id}`), 
    invalidateQueries: [["all-categories"], ["category-details"]]
  });
};

export const useDeactivateCategory = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.patch<CategoryItem>(`/categories/${id}/deactivate`), 
    invalidateQueries: [["all-categories"], ["category-details"]]
  });
};

export const useActivateCategory = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.patch<CategoryItem>(`/categories/${id}/activate`), 
    invalidateQueries: [["all-categories"], ["category-details"]]
  });
};

export const useBulkDeactivateCategory = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload}: {payload: UpdateBulkCategoryPayload}) =>
      api.post<{updatedCount: number}>(`/categories/bulk-deactivate`, payload), 
    invalidateQueries: [["all-categories"], ["category-details"]]
  });
};

export const useBulkActivateCategory = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload}: {payload: UpdateBulkCategoryPayload}) =>
      api.post<{updatedCount: number}>(`/categories/bulk-activate`, payload), 
    invalidateQueries: [["all-categories"], ["category-details"]]
  });
};

export const useGetCategoriesStats = () => {
  return useQuery({
    queryKey: ["categories-stats"],
    queryFn: fetchCategoriesStats,
    retry: 2,
  });
};