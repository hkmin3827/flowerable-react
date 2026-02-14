import { Color } from "@/shared/types";

export enum OrderStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  READY = "READY",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export interface OrderItem {
  flowerName: string;
  flowerColor: Color;
  itemTotalPrice: number;
  shopFlowerId: number;
  quantity: number;
  flowerBasePrice: number;
}

export interface OrderList {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  shopName: string;
  userName: string;
  totalCount: number;
}

export interface OrderDetail {
  orderId: number;
  orderNumber: string;
  opponentTelnum: string;
  status: OrderStatus;
  userId: number;
  userName: string;
  shopId: number;
  shopName: string;
  shopAddress: string;
  totalFlowerPrice: number;
  totalPrice: number;
  wrappingColorName: string | null;
  wrappingExtraPrice: number;
  message: string | null;
  createdAt: string;
  canceledAt: string | null;
  items: OrderItem[];
}

export interface OrderCreateReq {
  orderItems: {
    shopFlowerId: number;
    quantity: number;
  }[];
  wrappingColorName: string | null;
  message: string | null;
}

// Shop 관련
export interface ShopDetail {
  shopId: number;
  name: string;
  address: string;
  phoneNumber: string;
  description: string | null;
  latitude: number;
  longitude: number;
  imageUrls: string[];
  shopFlowers: ShopFlower[];
}

export interface ShopFlower {
  shopFlowerId: number;
  flowerName: string;
  flowerPrice: number;
  stockQuantity: number;
  imageUrl: string | null;
  availableForSale: boolean;
}

export interface WrappingOption {
  shopId: number;
  colorNames: string[];
  price: number;
}
