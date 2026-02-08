import { Role, Provider } from "@/shared/types";

// API Request Types

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

export interface UserSignupRequest {
  email: string;
  password: string;
  name: string;
  telnum: string;
}

export interface ShopSignupRequest {
  email: string;
  password: string;
  name: string;
  telnum: string;
  shopName: string;
  businessNumber: string;
  region: string;
  district: string;
  address: string;
}

export interface OAuth2LoginRequest {
  provider: Provider;
  code: string;
}

// API Response Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: Role;
  accountId: number;
  name: string;
  email: string;
}

// Domain Types (UI에서 사용)
export interface UserInfo {
  id: number;
  name: string;
  role: Role;
  email: string;
  profileImgUrl: string;
  provider: Provider;
}
