import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

/* ============================
   TYPES
============================ */

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;      // Skip auth header
  noToast?: boolean;     // Skip toast notifications
  _retry?: boolean;      // Internal flag to prevent infinite refresh loops
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/* ============================
   AXIOS INSTANCE
============================ */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000",
  // timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // REQUIRED for refresh-token cookies
});

/* ============================
   UTILITY FUNCTIONS
============================ */

/**
 * Get auth token from cookies
 */
const getAuthToken = (): string | undefined => {
  return Cookies.get("authToken");
};

/**
 * Get refresh token from cookies
 */
const getRefreshToken = (): string | undefined => {
  return Cookies.get("refreshToken");
};

/**
 * Update auth tokens in cookies
 */
const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set("authToken", accessToken, { 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  Cookies.set("refreshToken", refreshToken, { 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

/**
 * Clear auth tokens from cookies
 */
const clearAuthTokens = (): void => {
  Cookies.remove("authToken");
  Cookies.remove("refreshToken");
};

/**
 * Extract error message from error response
 */
const getErrorMessage = (error: AxiosError<ErrorResponse>): string => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

/* ============================
   REQUEST INTERCEPTOR
   Attach auth token to requests
============================ */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const customConfig = config as CustomAxiosRequestConfig;
    
    // Skip auth if noAuth flag is set
    if (customConfig.noAuth) {
      return config;
    }

    // Get token and attach to request
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/* ============================
   RESPONSE INTERCEPTOR
   Handle success toasts & errors
============================ */

axiosInstance.interceptors.response.use(
  // SUCCESS HANDLER
  (response: AxiosResponse): AxiosResponse => {
    const config = response.config as CustomAxiosRequestConfig;

    // Show success toast for mutations (POST, PUT, PATCH, DELETE)
    const isMutation = config.method && !["get", "options", "head"].includes(config.method.toLowerCase());
    
    if (isMutation && !config.noToast) {
      const successMessage = response.data?.message || "Operation successful";
      // toast.success(successMessage);
      toast.success("Success!", {
        description: successMessage,
        className: "force-white-toast",
        style: { backgroundColor: "hsl(216 82% 55%)", borderRadius: "12px" },
      });
    }

    return response;
  },

  // ERROR HANDLER
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    /* ============================
       401 UNAUTHORIZED → REFRESH TOKEN
    ============================ */
    if (status === 401 && !originalRequest._retry && !originalRequest.noAuth) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          // No refresh token available, can't refresh
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const refreshResponse = await axios.post<RefreshTokenResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/auth/refresh`,
          { refreshToken },
          { 
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Update cookies with new tokens
        setAuthTokens(accessToken, newRefreshToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh failed → clear tokens and reject
        clearAuthTokens();

        // Optional: Dispatch logout action if you have access to store
        // store.dispatch(logout());

        // Optional: Redirect to login (handle in auth guard instead)
        if (typeof window !== "undefined") {
          // window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    /* ============================
       OTHER ERRORS → SHOW TOAST
    ============================ */
    const isMutation = originalRequest.method && 
      !["get", "options", "head"].includes(originalRequest.method.toLowerCase());

    // Show error toast for mutations only (unless noToast is set)
    if (isMutation && !originalRequest.noToast) {
      const errorMessage = getErrorMessage(error);
      // toast.error(errorMessage);
      toast.error("Failed", {
        style: { backgroundColor: '#F43F5E', borderRadius: "12px" },
        description: errorMessage,
        className: "force-white-toast",
      })
    }

    /* ============================
       SPECIFIC STATUS HANDLERS
    ============================ */
    switch (status) {
      case 403:
        // Forbidden - user doesn't have permission
        if (!originalRequest.noToast) {
          toast.error("You don't have permission to perform this action");
        }
        break;

      case 404:
        // Not found
        if (!originalRequest.noToast && isMutation) {
          toast.error("The requested resource was not found");
        }
        break;

      case 422:
        // Validation error
        if (!originalRequest.noToast) {
          toast.error("Please check your input and try again");
        }
        break;

      case 429:
        // Rate limit
        if (!originalRequest.noToast) {
          toast.error("Too many requests. Please try again later");
        }
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        if (!originalRequest.noToast) {
          toast.error("Server error. Please try again later");
        }
        break;
    }

    return Promise.reject(error);
  }
);

/* ============================
   API EXPORT WITH TYPE SAFETY
============================ */

export const api = {
  get: <T = any>(url: string, config?: CustomAxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),
    
  delete: <T = any>(url: string, config?: CustomAxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

/* ============================
   ADDITIONAL UTILITIES
============================ */

/**
 * Manual token refresh (for edge cases)
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setAuthTokens(accessToken, newRefreshToken);

    return true;
  } catch (error) {
    clearAuthTokens();
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Logout helper
 */
export const logout = (): void => {
  clearAuthTokens();
  // Optional: call backend logout endpoint
  // api.post("/admin/auth/logout", {}, { noToast: true, noAuth: true });
};

export default axiosInstance;
