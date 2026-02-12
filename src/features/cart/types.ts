import { Color } from "@/shared/types";

export interface FlowerDetailInfo {
  detailId: number;
  shopFlowerId: number;
  flowerName: string;
  flowerColor: Color;
  quantity: number;
  basePrice: number;
  totalPrice: number;
}

export interface CartItemInfo {
  cartItemId: number;
  shopId: number;
  shopName: string;
  wrappingColorName?: string;
  wrappingExtraPrice?: number;
  message?: string;
  flowers: FlowerDetailInfo[];
  totalFlowerPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface CartInfo {
  cartId: number;
  totalShopCount: number;
  items: CartItemInfo[];
  totalPrice: number;
}

export interface CartCount {
  count: number;
}

export interface FlowerItem {
  shopFlowerId: number;
  quantity: number;
  flowerColor: Color;
}

export interface AddToCartRequest {
  shopId: number;
  wrappingColorName?: string;
  wrappingExtraPrice?: number;
  message?: string;
  flowers: FlowerItem[];
}

export interface UpdateCartItemRequest {
  wrappingColorName?: string;
  wrappingExtraPrice?: number;
  message?: string;
  flowers: FlowerItem[];
}
