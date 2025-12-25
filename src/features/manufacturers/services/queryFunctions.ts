import { ManufacturerItem, ManufacturerOrderItem, ManufacturerProductItem, ManufacturerStatsItem } from "@/features/manufacturers/types"
import { GeneralFetchingParams, PaginatedResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchManufacturers (params: GeneralFetchingParams): Promise<PaginatedResponse<ManufacturerItem>> {
  const {search, status, country, state, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(country) filterParams.append('country', country)
  if(state) filterParams.append('state', state)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/manufacturers?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchManufacturerProducts (params: GeneralFetchingParams): Promise<PaginatedResponse<ManufacturerProductItem>> {
  const {id, search, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/manufacturers/${id}/products?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchManufacturerOrders (params: GeneralFetchingParams): Promise<PaginatedResponse<ManufacturerOrderItem>> {
  const {id, search, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/manufacturers/${id}/orders?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchDeletedManufacturers (params: GeneralFetchingParams): Promise<PaginatedResponse<ManufacturerItem>> {
  const {search, status, country, state, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(country) filterParams.append('country', country)
  if(state) filterParams.append('state', state)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/manufacturers/deleted/list?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchManufacturerDetails ({id}: {id: string}): Promise<ManufacturerItem> {
  const response = await api.get(`/manufacturers/${id}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}

export async function fetchManufacturersStats (): Promise<ManufacturerStatsItem> {
  const response = await api.get(`/manufacturers/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}