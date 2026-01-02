import { ProductItem, ProductStatsItem } from "@/features/products/types"
import { GeneralFetchingParams, PaginatedResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchProducts (params: GeneralFetchingParams): Promise<PaginatedResponse<ProductItem>> {
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

  const response = await api.get(`/products?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchProductsByManufacturer (params: GeneralFetchingParams): Promise<PaginatedResponse<ProductItem>> {
const {manufacturerId, search, brandId, categoryId, variant, isActive, includeRelations, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(brandId) filterParams.append('brandId', brandId)
  if(categoryId) filterParams.append('categoryId', categoryId)
  if(variant) filterParams.append('variant', variant)
  if(isActive) filterParams.append('isActive', String(isActive))
  if(includeRelations) filterParams.append('includeRelations', String(includeRelations))
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/products/manufacturer/${manufacturerId}/products?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchDeactivatedProducts (params: GeneralFetchingParams): Promise<PaginatedResponse<ProductItem>> {
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

  const response = await api.get(`/products/deactivated?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchProductDetails ({id}: {id: string}): Promise<ProductItem> {
  const response = await api.get(`/products/${id}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchProductsStats (): Promise<ProductStatsItem> {
  const response = await api.get(`/products/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}