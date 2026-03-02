import { Role, Provider, AccountStatus, ShopStatus } from "@/shared/types";

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
  regionCode: string;
  districtCode: string;
  address: string;
}

export interface OAuth2CompleteRequest {
  accountId: number;
  email: string;
  telnum: string;
}

export interface WithdrawReq {
  confirmText: string;
  password?: string;
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
  shopStatus: ShopStatus | null;
}

// Domain Types (UI에서 사용)
export interface UserInfo {
  id: number;
  name: string;
  role: Role;
  profileImgUrl: string | null;
  provider: Provider;
  shopStatus: ShopStatus | null;
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
