import { fetchFileDetails } from "@/features/uploads/services/queryFunctions";
import { CreateFilePayload, FileDataProps } from "@/features/uploads/types";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";

export const useGetFileDetails = ({publicId}: {publicId: string}) => {
  return useQuery({
    queryKey: ["file-details", publicId],
    queryFn: () => fetchFileDetails({publicId}),
    retry: 2,
  });
};

export const useCreateFile = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateFilePayload) =>
      api.post<FileDataProps>("/upload/single", payload), 
    invalidateQueries: [["all-files"]]
  });
};

export const useCreateMultipleFiles = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateFilePayload[], id: string}) =>
      api.patch<FileDataProps[]>(`/upload/multiple/${id}`, payload), 
    invalidateQueries: [["all-files"], ["file-details"]]
  });
};

export const useDeleteFile = () => {
  return useInvalidatingMutation({
    mutationFn: ({publicId}: {publicId: string}) =>
      api.delete<FileDataProps>(`/upload/files/${publicId}`), 
    invalidateQueries: [["all-files"], ["file-details"]]
  });
};