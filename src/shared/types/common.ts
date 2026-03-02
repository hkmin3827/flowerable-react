export type Role = "ROLE_USER" | "ROLE_SHOP" | "ROLE_ADMIN";

export const ROLE = {
  USER: "ROLE_USER",
  SHOP: "ROLE_SHOP",
  ADMIN: "ROLE_ADMIN",
} as const;

export type Provider = "LOCAL" | "KAKAO" | "NAVER" | "GOOGLE";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED" | "TEMP";

export type OrderStatus =
  | "CREATED"
  | "REQUESTED"
  | "ACCEPTED"
  | "READY"
  | "COMPLETED"
  | "CANCELED";

export type ShopStatus = "ACTIVE" | "PENDING" | "REJECTED" | "SUSPENDED";

export type Color =
  | "RED"
  | "PINK"
  | "WHITE"
  | "YELLOW"
  | "PURPLE"
  | "BLUE"
  | "ORANGE"
  | "GREEN"
  | "BEIGE"
  | "BROWN"
  | "BLACK"
  | "GRAY"
  | "MIXED";

export type Season = "SPRING" | "SUMMER" | "AUTUMN" | "WINTER";

export type Region =
  | "SEOUL"
  | "GYEONGGI"
  | "INCHEON"
  | "GANGWON"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "SEJONG"
  | "DAEJEON"
  | "JEONBUK"
  | "JEONNAM"
  | "GWANGJU"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "DAEGU"
  | "ULSAN"
  | "BUSAN"
  | "JEJU";

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  telnum: string;
  createdAt: string;
  accountStatus: AccountStatus;
  active: boolean;
}

export interface ShopProfile {
  id: number;
  email: string;
  shopName: string;
  telnum: string;
  registerAt: string;
  accountStatus: AccountStatus;
  status: ShopStatus;
}
