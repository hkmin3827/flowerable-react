import { OrderStatus, BaseEntity } from "@/shared/types";

// API Request Types
export interface OrderItemRequest {
  shopFlowerId: number;
  quantity: number;
  wrappingOptionId?: number;
}

export interface OrderCreateRequest {
  shopId: number;
  items: OrderItemRequest[];
  deliveryDate: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  message?: string;
}

export interface OrderStatusChangeRequest {
  status: OrderStatus;
}

// API Response Types
export interface OrderItemResponse extends BaseEntity {
  orderId: number;
  shopFlowerId: number;
  flowerName: string;
  flowerImageUrl: string;
  quantity: number;
  unitPrice: number;
  wrappingOptionId?: number;
  wrappingOptionName?: string;
  wrappingPrice: number;
}

export interface OrderListResponse extends BaseEntity {
  orderId: number;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderDetailResponse extends BaseEntity {
  orderNumber: string;
  shopId: number;
  shopName: string;
  userId: number;
  userName: string;
  userPhone: string;
  totalPrice: number;
  status: OrderStatus;
  deliveryDate: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  message?: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

// Domain Types (UI용)
export interface CartItem {
  shopFlowerId: number;
  flowerName: string;
  flowerImageUrl: string;
  quantity: number;
  unitPrice: number;
  wrappingOptionId?: number;
  wrappingOptionName?: string;
  wrappingPrice: number;
}

export interface OrderSummary {
  subtotal: number;
  wrappingTotal: number;
  total: number;
}
