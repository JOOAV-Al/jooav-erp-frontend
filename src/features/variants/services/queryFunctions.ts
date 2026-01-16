import { VariantItem, VariantStatsItem } from "@/features/variants/types"
import { GeneralFetchingParams, PaginatedResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchVariants (params: GeneralFetchingParams): Promise<PaginatedResponse<VariantItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(manufacturerId) filterParams.append('manufacturerId', manufacturerId)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/variants?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchVariantsByManufacturer (params: GeneralFetchingParams): Promise<PaginatedResponse<VariantItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/variants/manufacturer/${manufacturerId}/products?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchDeletedVariants (params: GeneralFetchingParams): Promise<PaginatedResponse<VariantItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(manufacturerId) filterParams.append('manufacturerId', manufacturerId)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/variants/deleted?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchVariantDetails ({id}: {id: string}): Promise<VariantItem> {
  const response = await api.get(`/variants/${id}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchVariantsStats (): Promise<VariantStatsItem> {
  const response = await api.get(`/variants/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}