import { useAuthStore } from "@/features/auth/store";
import { reconnectSSE } from "@/features/notification/hooks";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const reissueAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Axios Request Error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (originalRequest.url?.includes("/auth/reissue")) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (status === 401) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      const { refreshToken, accountStatus } = useAuthStore.getState();

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = reissueAxios
            .post("/auth/reissue", null, {
              headers: { "X-Refresh-Token": refreshToken },
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }
        const res = await refreshPromise;

        const {
          accessToken,
          refreshToken: newRefreshToken,
          accountStatus: newAccountStatus,
        } = res.data;

        const current = useAuthStore.getState();
        useAuthStore.getState().updateTokens({
          accessToken,
          refreshToken: newRefreshToken ?? current.refreshToken,
          accountStatus: newAccountStatus ?? accountStatus,
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        reconnectSSE(accessToken);

        return axiosInstance(originalRequest);
      } catch (reissueError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(reissueError);
      }
    }

    if (status === 403) {
      alert(message ?? "접근 권한이 없습니다.");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
