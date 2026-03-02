import { AccountStatus, Color, OrderStatus, ShopStatus } from "@/shared/types";

// 관리자 사용자 타입
export interface AdminUser {
  id: number;
  accountEmail: string;
  name: string;
  accountTelnum: string;
  accountStatus: AccountStatus;
  createdAt: string;
}

// 관리자 샵 타입
export interface AdminShop {
  id: number;
  shopName: string;
  accountEmail: string;
  regionDesc: string;
  districtDesc: string;
  address: string;
  accountTelnum: string;
  accountStatus: AccountStatus;
  status: ShopStatus;
  registerAt: string;
}

// 관리자 꽃 타입
export interface AdminFlower {
  id: number;
  name: string;
  active: boolean;
  floralLang: string;
  category: string;
  imageUrl: string;
}

// 관리자 주문 타입
export interface AdminOrder {
  orderId: number;
  orderNumber: string;
  shopName: string;
  userName: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  canceledBy?: "USER" | "SHOP";
  cancelReason?: string;
}

// 사용자 상세
export interface UserDetail {
  id: number;
  email: string;
  telnum: string;
  name: string;
  accountTellnum: string;
  active: boolean;
  createdAt: string;
  deletedAt?: string;
  provider?: string;
  providerId?: string;
}

// 샵 상세
export interface ShopDetail {
  id: number;
  shopName: string;
  description?: string;
  regionDesc: string;
  districtDesc: string;
  address: string;
  telnum: string;
  status: string;
  email: string;
  registerAt: string;
  deletedAt: string;
}

// 꽃 생성 요청
export interface FlowerCreateReq {
  name: string;
  floralLang: string;
  category: string;
}

// 꽃 수정 요청
export interface FlowerUpdateReq {
  name?: string;
  floralLang?: string;
  category?: string;
}

// 주문 검색 조건
export interface OrderSearchParams {
  status?: string;
  shopId?: number;
  userId?: number;
  from?: string;
  to?: string;
}

export interface AdminOrderDetail {
  orderId: number;
  status: OrderStatus;
  orderNumber: string;
  userId: number;
  shopId: number;
  shopName: string;
  userName: string;
  shopTelnum: string;
  userTelnum: string;
  totalFlowerPrice: number;
  totalPrice: number;
  wrappingColorName: string;
  wrappingExtraPrice: number;
  createdAt: string;
  canceledAt?: string;
  message?: string;
  cancelBy?: string;
  cancelReason?: string;
  items: AdminOrderItemRes[];
}

export interface AdminOrderItemRes {
  orderItemId: number;
  shopFlowerId: number;
  flowerName: string;
  quantity: number;
  flowerColor: Color;
  basePrice: number;
  itemTotalPrice: number;
}
