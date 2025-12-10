import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosHeaders,
} from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie"
// import { AxiosRequestConfig } from "axios";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;
  noToast?: boolean;
  forceToast?: boolean;
}


// Create a shared Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  withCredentials: false, // Important for cookie-based auth to set to true
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig ) => {
    // const token = localStorage.getItem("authToken"); // Optional fallback (if not using cookies)
    const token = Cookies.get("authToken")

    // Only set Authorization if token exists AND request isn't marked as noAuth
    if (token && !config.noAuth) {
      // Make sure headers exist and are of correct type
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse & { config?: any }) => {
    const config = response.config;

    // Automatically show toast for successful non-GET requests
    if (config?.method !== "get" && !config?.noToast) {
     toast.success("Success!", {
        description: response.data?.message || "Success",
        className: "force-white-toast",
        style: { backgroundColor: "#1B66F8" },
      }); 
    }

    return response;
  },
  (error: AxiosError & { config?: any }) => {
    const config = error.config;

    // Optional error message
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "Something went wrong";
      console.log(error)
    // Automatically show error toast if not disabled
    if (config?.method !== "get" && !config?.noToast) {
      if(typeof error.status == "number" && error?.status >= 500) {
        toast.error("Failed", {
        style: { backgroundColor: '#F43F5E' },
        description: "Server Error. Please try again",
        className: "force-white-toast",
      })
      } else {
        toast.error("Failed", {
          style: { backgroundColor: '#F43F5E' },
          description: errorMessage,
          className: "force-white-toast",
        })
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
