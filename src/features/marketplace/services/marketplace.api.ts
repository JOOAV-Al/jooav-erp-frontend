import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { ProductFilters, ProductsResponse, CategoriesResponse, Order, CreateOrderPayload, Category } from "@/features/marketplace/types";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { ConfirmationData, GeneralFetchingParams, MutationResponse } from "@/interfaces/general";
import { fetchCategoryDetails, fetchOrderDetails, fetchOrders } from "@/features/marketplace/services/queryFunctions";

// ── Build query string from filters (omit empty values) ────────────────

function buildProductsQueryString(filters: Partial<ProductFilters>): string {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.brandId) params.set("brandId", filters.brandId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.variant) params.set("variant", filters.variant);
  if (filters.status) params.set("status", filters.status);
  params.set("includeRelations", String(filters.includeRelations ?? true));

  return params.toString();
}

// ── Products list (public — no auth required) ──────────────────────────

export const useFetchProducts = (filters: Partial<ProductFilters> = {}) => {
  const queryString = buildProductsQueryString(filters);

  return useQuery<ProductsResponse>({
    queryKey: ["products", queryString],
    queryFn: async () => {
      const res = await api.get(
        `/products?${queryString}`,
        { noAuth: true, noToast: true } as CustomAxiosRequestConfig
      );
      // axios wraps in `.data`; our api instance may unwrap it — handle both
      return res.data ?? res;
    },
    staleTime: 2 * 60 * 1000, // 2 min
    placeholderData: (prev) => prev, // keep old data while refetching (v5 equivalent of keepPreviousData)
  });
};

// ── Single product ─────────────────────────────────────────────────────

export const useFetchProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(
        `/products/${id}?includeRelations=true`,
        { noAuth: true, noToast: true } as CustomAxiosRequestConfig
      );
      return res.data ?? res;
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

// ── Categories (public) ──────────────────────────────────────────────

export const useFetchCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get(
        `/categories?page=1&limit=100&status=ACTIVE&includeSubcategories=true`,
        { noAuth: true, noToast: true } as CustomAxiosRequestConfig
      );
      return res.data ?? res;
    },
    staleTime: 10 * 60 * 1000, // categories don't change often
  });
};

export const useGetCategoryDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["category-details", id],
    queryFn: () => fetchCategoryDetails({id}),
    retry: 2,
  });
};


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

export const useCreateDraftOrder = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      api.post<MutationResponse<{order: Order}>>("/orders", payload), 
    invalidateQueries: [["orders-stats"], ["order-details"]]
  });
};

export const useUpdateDraftOrder = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateOrderPayload, id: string}) =>
      api.patch<MutationResponse<{order: Order}>>(`/orders/${id}`, payload), 
    invalidateQueries: [["orders-stats"], ["order-details"]]
  });
};

// Initiates payment for an order — generates virtual account
export const useInitiateOrderPayment = () => {
  return useInvalidatingMutation({
    mutationFn: ({ orderNumber }: { orderNumber: string }) =>
      api.post<MutationResponse<{order: Order, checkoutUrl: string; paymentExpiresAt: string;}>>(`/orders/${orderNumber}/initiate-payment`, {}, {noToast: true} as CustomAxiosRequestConfig),
    invalidateQueries: [["order-details"], ["orders-stats"]],
  });
};
export const useReInitiateOrderPayment = () => {
  return useInvalidatingMutation({
    mutationFn: ({ orderNumber }: { orderNumber: string }) =>
      api.post<MutationResponse<{order: Order, checkoutUrl: string; paymentExpiresAt: string;}>>(`/orders/${orderNumber}/reinitiate-payment`, {}, {noToast: true} as CustomAxiosRequestConfig),
    invalidateQueries: [["order-details"], ["orders-stats"]],
  });
};

export const useConfirmOrderPayment = () => {
  return useInvalidatingMutation({
    mutationFn: ({ orderNumber }: { orderNumber: string }) =>
      api.post<MutationResponse<ConfirmationData>>(`/orders/${orderNumber}/verify-payment`,),
    invalidateQueries: [["all-orders"], ["order-details"], ["orders-stats"]],
  });
};