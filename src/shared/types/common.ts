// 백엔드 Enum 타입들
export type Role = "ROLE_USER" | "ROLE_SHOP" | "ROLE_ADMIN";
export type Provider = "LOCAL" | "KAKAO" | "NAVER" | "GOOGLE";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type ShopStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type Color =
  | "RED"
  | "PINK"
  | "WHITE"
  | "YELLOW"
  | "PURPLE"
  | "BLUE"
  | "ORANGE"
  | "GREEN"
  | "MIXED";
export type Season = "SPRING" | "SUMMER" | "FALL" | "WINTER" | "ALL";
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
