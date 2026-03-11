"use client";

import { useCallback, useReducer, useState } from "react";
import {
  ProductFilters,
  ProductStatus,
  DEFAULT_PRODUCT_FILTERS,
} from "@/features/marketplace/types";
import { useFetchProducts } from "@/features/marketplace/services/marketplace.api";

// ── Action types ───────────────────────────────────────────────────────

type FilterAction =
  | { type: "SET_FILTER"; field: keyof ProductFilters; value: ProductFilters[keyof ProductFilters] }
  | { type: "CHANGE_PAGE"; payload: number }
  | { type: "RESET_FILTERS" };

// ── Reducer ────────────────────────────────────────────────────────────

function filtersReducer(state: ProductFilters, action: FilterAction): ProductFilters {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.field]: action.value, page: 1 }; // reset to page 1 on any filter change
    case "CHANGE_PAGE":
      return { ...state, page: action.payload };
    case "RESET_FILTERS":
      return { ...DEFAULT_PRODUCT_FILTERS };
    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────────────────────

/**
 * Central marketplace filter/query hook.
 *
 * Pattern adapted from internal `useAllLoansFilters` — useReducer manages
 * staged filter state, a separate `committedFilters` state is what actually
 * triggers the API call (so typing in a search box doesn't spam the API).
 */
export function useMarketplaceFilters() {
  const [filters, dispatch] = useReducer(filtersReducer, { ...DEFAULT_PRODUCT_FILTERS });

  // Committed filters are what actually drive the API query.
  // Filters are staged locally until the user submits (search) or immediately
  // applied (category, status, etc.).
  const [committedFilters, setCommittedFilters] = useState<ProductFilters>({ ...DEFAULT_PRODUCT_FILTERS });

  // ── Data ─────────────────────────────────────────────────────────────

  const { data, isLoading, isFetching, isError } = useFetchProducts(committedFilters);

  const products = data?.data ?? [];
  const meta = data?.meta;

  // ── Setters ───────────────────────────────────────────────────────────

  /** Generic filter setter — immediately commits to API (for category, status…) */
  const setFilter = useCallback(
    (field: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]) => {
      dispatch({ type: "SET_FILTER", field, value });
      setCommittedFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
    },
    []
  );

  /** Stage the search string only — doesn't commit until handleSearch() */
  const setSearch = useCallback((value: string) => {
    dispatch({ type: "SET_FILTER", field: "search", value });
  }, []);

  /** Commit the staged search string & reset to page 1 */
  const handleSearch = useCallback(
    (value?: string) => {
      const query = value !== undefined ? value : filters.search;
      setCommittedFilters((prev) => ({
        ...prev,
        search: query,
        page: 1,
      }));
    },
    [filters.search]
  );

  /** Category quick-select (sets categoryId and commits immediately) */
  const handleCategorySelect = useCallback((categoryId: string) => {
    dispatch({ type: "SET_FILTER", field: "categoryId", value: categoryId });
    setCommittedFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  /** Status filter */
  const handleStatusChange = useCallback((status: ProductStatus | "") => {
    dispatch({ type: "SET_FILTER", field: "status", value: status });
    setCommittedFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  /** Pagination */
  const handlePageChange = useCallback((page: number) => {
    dispatch({ type: "CHANGE_PAGE", payload: page });
    setCommittedFilters((prev) => ({ ...prev, page }));
  }, []);

  /** Full reset */
  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
    setCommittedFilters({ ...DEFAULT_PRODUCT_FILTERS });
  }, []);

  return {
    // staged filters (reflect UI state)
    filters,
    // committed filters (what's sent to API)
    committedFilters,
    // data
    products,
    meta,
    isLoading,
    isFetching,
    isError,
    // actions
    setFilter,
    setSearch,
    handleSearch,
    handleCategorySelect,
    handleStatusChange,
    handlePageChange,
    resetFilters,
  };
}
