import { UserItem, UserStatsItem } from "@/features/users/types"
import { GeneralFetchingParams, PaginatedResponse } from "@/interfaces/general"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

const LIMIT = 20
export async function fetchUsers (params: GeneralFetchingParams): Promise<PaginatedResponse<UserItem>> {
  const {search, status, role, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(role) filterParams.append('role', role)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/users?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchUsersByManufacturer (params: GeneralFetchingParams): Promise<PaginatedResponse<UserItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/users/manufacturer/${manufacturerId}/products?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchDeletedUsers (params: GeneralFetchingParams): Promise<PaginatedResponse<UserItem>> {
  const {search, status, manufacturerId, sortBy, sortOrder, page, limit=LIMIT} = params
  const filterParams = new URLSearchParams({})
  if(search) filterParams.append('search', search)
  if(status) filterParams.append('status', status)
  if(manufacturerId) filterParams.append('manufacturerId', manufacturerId)
  if(sortBy) filterParams.append('sortBy', sortBy)
  if(sortOrder) filterParams.append('sortOrder', sortOrder)
  if(page) filterParams.append('page', page.toString())
  if(limit) filterParams.append('limit', limit.toString())

  const response = await api.get(`/users/deleted?${filterParams.toString()}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchUserDetails ({id}: {id: string}): Promise<UserItem> {
  const response = await api.get(`/users/${id}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}

export async function fetchUsersStats (): Promise<UserStatsItem> {
  const response = await api.get(`/users/stats`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data.data
}