import { FileDataProps } from "@/features/uploads/types"
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance"

export async function fetchFileDetails ({publicId}: {publicId: string}): Promise<FileDataProps> {
  const response = await api.get(`/upload/details/${publicId}`, { noToast: true } as CustomAxiosRequestConfig)
  return response.data
}