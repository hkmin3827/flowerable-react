import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/shared/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Axios instance 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data, // 자동으로 data 추출
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 리프레시 시도
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // 원래 요청 재시도
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${data.accessToken}`;
            return axios(error.config);
          }
        } catch (refreshError) {
          // 리프레시 실패 시 로그아웃
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error.message);
  },
);
