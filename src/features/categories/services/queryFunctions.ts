import { CategoryItem, CategoryStatsItem } from "@/features/categories/types"
import { GeneralFetchingParams, PaginatedResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchCategories (params: GeneralFetchingParams): Promise<PaginatedResponse<CategoryItem>> {
  const {search, parentId, includeChildren, isActive, includeProductCount, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(parentId) filterParams.append('parentId', parentId)
  if(isActive) filterParams.append('isActive', String(isActive))
  if(includeProductCount) filterParams.append('includeProductCount', String(includeProductCount))
  if(includeChildren) filterParams.append('includeChildren', String(includeChildren))
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/categories?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchCategoriesTree (params: GeneralFetchingParams): Promise<PaginatedResponse<CategoryItem>> {
  const {search, parentId, includeChildren, isActive, includeProductCount, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(parentId) filterParams.append('parentId', parentId)
  if(isActive) filterParams.append('isActive', String(isActive))
  if(includeProductCount) filterParams.append('includeProductCount', String(includeProductCount))
  if(includeChildren) filterParams.append('includeChildren', String(includeChildren))
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/categories/tree?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchCategoriesSubcategories (params: GeneralFetchingParams): Promise<PaginatedResponse<CategoryItem>> {
  const {search, parentId, includeChildren, isActive, includeProductCount, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(parentId) filterParams.append('parentId', parentId)
  if(isActive) filterParams.append('isActive', String(isActive))
  if(includeProductCount) filterParams.append('includeProductCount', String(includeProductCount))
  if(includeChildren) filterParams.append('includeChildren', String(includeChildren))
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/categories/subcategories?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchDeactivatedCategories (params: GeneralFetchingParams): Promise<PaginatedResponse<CategoryItem>> {
  const {search, brandId, categoryId, variant, isActive, includeRelations, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(brandId) filterParams.append('brandId', brandId)
  if(categoryId) filterParams.append('categoryId', categoryId)
  if(variant) filterParams.append('variant', variant)
  if(isActive) filterParams.append('isActive', String(isActive))
  if(includeRelations) filterParams.append('includeRelations', String(includeRelations))
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/categories/deactivated?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchCategoryDetails ({id}: {id: string}): Promise<CategoryItem> {
  const response = await api.get(`/categories/${id}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchCategoriesStats (): Promise<CategoryStatsItem> {
  const response = await api.get(`/categories/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}