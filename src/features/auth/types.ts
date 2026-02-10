import { Role, Provider, AccountStatus } from "@/shared/types";

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
  providerId: string;
  email?: string;
  name?: string;
}

export interface OAuth2CompleteRequest {
  accountId: number;
  email: string;
  telnum: string;
}

export interface AuthResponse {
  accessToken: string | null; // TEMP 대비
  refreshToken: string | null; // TEMP 대비
  role: Role;
  id: number;
  name: string | null;
  telnum: string | null;
  profileImgUrl: string | null;
  accountStatus: AccountStatus;
  provider: Provider;
}

// Domain Types (UI에서 사용)
export interface UserInfo {
  id: number;
  name: string;
  role: Role;
  profileImgUrl: string | null;
  provider: Provider;
}

export interface OAuthTokenExchangeRequest {
  code: string;
  provider: string;
}

export interface OAuthCompleteRequest {
  accountId: number;
  email: string;
  telnum: string;
  name: string;
}
