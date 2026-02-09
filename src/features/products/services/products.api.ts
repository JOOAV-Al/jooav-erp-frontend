import { fetchDeactivatedProducts, fetchProductDetails, fetchProducts, fetchProductsStats, fetchProductsByManufacturer } from "@/features/products/services/queryFunctions";
import { CreateProductPayload, ProductItem } from "@/features/products/types";
import { GeneralFetchingParams } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestHeaders } from "axios";


export const useGetProducts = (params: GeneralFetchingParams) => {
  const {search, status, brandId, page, limit} = params
  return useQuery({
    queryKey: ["all-products", search, status, brandId, page, limit],
    queryFn: () => fetchProducts(params),
    retry: 2,
  });
};

export const useGetDeactivatedProducts = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-deactivated-products"],
    queryFn: () => fetchDeactivatedProducts(params),
    retry: 2,
  });
};

export const useGetProductsByManufacturer = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-products-by-manufacturer"],
    queryFn: () => fetchProductsByManufacturer(params),
    retry: 2,
  });
};

export const useGetProductDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["product-details", id],
    queryFn: () => fetchProductDetails({id}),
    retry: 2,
  });
};

export const useCreateProduct = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateProductPayload) =>
      api.post<ProductItem>("/products", payload, {headers: {
          "Content-Type": "multipart/form-data",
        } as AxiosRequestHeaders}), 
    invalidateQueries: [["all-products"], ["products-stats"]]
  });
};

export const useUpdateProduct = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateProductPayload, id: string}) =>
      api.patch<ProductItem>(`/products/${id}`, payload, {headers: {
          "Content-Type": "multipart/form-data",
        } as AxiosRequestHeaders}), 
    invalidateQueries: [["all-products"], ["product-details"]]
  });
};

export const useDeleteProduct = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete<ProductItem>(`/products/${id}`), 
    invalidateQueries: [["all-products"], ["product-details"], ["products-stats"]]
  });
};

export const useDeleteMultipleProducts = () => {
  return useInvalidatingMutation({
    mutationFn: ({productIds}: {productIds: string[]}) =>
      api.post(`/products/bulk-delete`, {productIds}), 
    invalidateQueries: [["all-products"], ["product-details"], ["products-stats"]]
  });
};

export const usePublishMultipleProducts = () => {
  return useInvalidatingMutation({
    mutationFn: ({productIds}: {productIds: string[]}) =>
      api.post(`/products/bulk-publish`, {productIds}), 
    invalidateQueries: [["all-products"], ["product-details"], ["products-stats"]]
  });
};

export const useDeactivateProduct = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<ProductItem>(`/products/${id}/deactivate`), 
    invalidateQueries: [["all-products"]]
  });
};

export const useActivateProduct = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<ProductItem>(`/products/${id}/activate`), 
    invalidateQueries: [["all-products"], ["product-details"]]
  });
};

export const useGetProductsStats = () => {
  return useQuery({
    queryKey: ["products-stats"],
    queryFn: fetchProductsStats,
    retry: 2,
  });
};