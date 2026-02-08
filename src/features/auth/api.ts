import { apiClient } from "@/shared/api";
import {
  LoginRequest,
  UserSignupRequest,
  ShopSignupRequest,
  OAuth2LoginRequest,
  AuthResponse,
} from "./types";

export const authApi = {
  // 이메일 로그인
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  // 일반 회원가입
  signupUser: (data: UserSignupRequest) =>
    apiClient.post<AuthResponse>("/auth/users/signup", data),

  // 샵 회원가입
  signupShop: (data: ShopSignupRequest) =>
    apiClient.post<AuthResponse>("/auth/shos/signup", data),

  // OAuth2 로그인
  oauth2Login: (data: OAuth2LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/oauth2/login", data),

  // 로그아웃
  logout: () => apiClient.post("/auth/logout"),

  // 토큰 리프레시
  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/auth/refresh", { refreshToken }),

  // 이메일 중복 체크
  checkEmail: (email: string) =>
    apiClient.get<{ available: boolean }>(`/auth/check-email?email=${email}`),

  // 회원 탈퇴
  withdraw: (password: string) =>
    apiClient.delete("/auth/withdraw", { data: { password } }),
};
