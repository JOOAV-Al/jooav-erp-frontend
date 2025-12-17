import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

//FETCH USER
export function useFetchCurrentUser() {
  return useMutation({
    mutationFn: () => {
      return api.get(`/users/user`, {noAuth: false} as CustomAxiosRequestConfig);
    },
    retry: 1
  })
}