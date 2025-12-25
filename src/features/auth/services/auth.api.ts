import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.post("/admin/auth/login", payload, {noAuth: true} as CustomAxiosRequestConfig),
  });
};
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (payload: {refreshToken: string }) =>
      api.post("/admin/auth/refresh", payload, { noAuth: true, noToast: true } as CustomAxiosRequestConfig),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.post("/admin/auth/logout", { noToast: true } as CustomAxiosRequestConfig),
  });
};

export const useFetchCurrentUser = () => {
  return useQuery({
    queryKey: ["admin-auth-me"],
    queryFn: () => api.get("/admin/auth/me", { noToast: true } as CustomAxiosRequestConfig),
    retry: 2,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      api.post("/auth/forgot-password", payload, { noAuth: true } as CustomAxiosRequestConfig),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: { password: string; token: string }) =>
      api.post("/auth/reset-password", payload, { noAuth: true } as CustomAxiosRequestConfig),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      api.post("/auth/change-password", payload),
  });
};
