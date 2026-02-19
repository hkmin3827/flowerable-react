// 백엔드 Enum 타입들
export type Role = "ROLE_USER" | "ROLE_SHOP" | "ROLE_ADMIN";
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
export type NotificationType = "ORDER" | "CHAT" | "ADMIN";
export type SenderType = "USER" | "SHOP";

// 공통 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  timestamp: string;
}

// 기본 Entity 타입
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
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
