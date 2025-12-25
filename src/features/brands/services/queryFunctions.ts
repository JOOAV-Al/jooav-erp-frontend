import { BrandItem, BrandOrderItem, BrandStatsItem } from "@/features/brands/types"
import { GeneralFetchingParams, PaginatedResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchBrands (params: GeneralFetchingParams): Promise<PaginatedResponse<BrandItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(manufacturerId) filterParams.append('manufacturerId', manufacturerId)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/brands?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchBrandsByManufacturer (params: GeneralFetchingParams): Promise<PaginatedResponse<BrandItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/brands/manufacturer/${manufacturerId}/products?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchDeletedBrands (params: GeneralFetchingParams): Promise<PaginatedResponse<BrandItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(manufacturerId) filterParams.append('manufacturerId', manufacturerId)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/brands/deleted?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchBrandDetails ({id}: {id: string}): Promise<BrandItem> {
  const response = await api.get(`/brands/${id}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchBrandsStats (): Promise<BrandStatsItem> {
  const response = await api.get(`/brands/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}