import { axiosInstance } from "@/shared/api/axios";
import {
  LoginRequest,
  UserSignupRequest,
  ShopSignupRequest,
  AuthResponse,
  OAuth2CompleteRequest,
  OAuthTokenExchangeRequest,
  OAuthCompleteRequest,
  WithdrawReq,
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  signupUser: async (data: UserSignupRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>(
      "/auth/users/signup",
      data,
    );
    return res.data;
  },

  signupShop: async (data: ShopSignupRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>(
      "/auth/shops/signup",
      data,
    );
    return res.data;
  },

  exchangeOAuthToken: async (
    data: OAuthTokenExchangeRequest,
  ): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post("/auth/oauth/token", data);

      return response.data;
    } catch (error: any) {
      console.error("🌐 API Error - exchangeOAuthToken:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  completeOAuthSignup: async (
    data: OAuthCompleteRequest,
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/oauth/complete", data);
    return response.data;
  },

  oauth2ProfileComplete: async (
    data: OAuth2CompleteRequest,
  ): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>(
      "/auth/oauth2/complete",
      data,
    );
    return res.data;
  },

  // 로그아웃
  logout: () => axiosInstance.post("/auth/logout"),

  // 토큰 리프레시
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/reissue", {
      refreshToken,
    });
    return res.data;
  },

  // 이메일 중복 체크
  checkEmail: (email: string) =>
    axiosInstance.get<{ available: boolean }>(
      `/auth/check-email?email=${email}`,
    ),

  // 회원 탈퇴
  withdraw: (data: WithdrawReq) => {
    return axiosInstance.post("/auth/withdraw", data);
  },

  // 비밀번호 찾기 - 재설정 링크 이메일 전송
  forgotPassword: (email: string): Promise<void> =>
    axiosInstance
      .post("/auth/password/forgot", { email })
      .then(() => undefined),

  // 비밀번호 재설정
  resetPassword: (token: string, newPassword: string): Promise<void> =>
    axiosInstance
      .post("/auth/password/reset", { token, newPassword })
      .then(() => undefined),
};
