import { useAuthStore } from "@/features/auth/store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Axios instance 생성
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken, accountStatus } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axiosInstance.post("/auth/reissue", null, {
          headers: {
            "X-Refresh-Token": refreshToken,
          },
        });

        const {
          accessToken,
          refreshToken: newRefreshToken,
          accountStatus: newAccountStatus,
        } = res.data;
        useAuthStore.getState().updateTokens({
          accessToken,
          refreshToken: newRefreshToken,
          accountStatus: newAccountStatus ?? accountStatus,
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (reissueError) {
        useAuthStore.getState().clearAuth();
        // window.location.href = "/login";
        return Promise.reject(reissueError);
      }
    }

    if (status === 403) {
      alert(message ?? "접근 권한이 없습니다.");
      return Promise.reject(error);
    }
    alert(message ?? "알 수 없는 오류가 발생했습니다.");
    return Promise.reject(error);
  },
);
