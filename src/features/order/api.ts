import { axiosInstance } from "@/shared/api/axios";
import { PageResponse, OrderStatus } from "@/shared/types";
import {
  OrderCreateRequest,
  OrderStatusChangeRequest,
  OrderListResponse,
  OrderDetailResponse,
} from "./types";

export const orderApi = {
  // 주문 생성 (사용자)
  createOrder: (data: OrderCreateRequest) =>
    axiosInstance.post<OrderDetailResponse>("/orders", data),

  // 사용자 주문 목록 조회
  getUserOrders: (
    page: number = 0,
    size: number = 10,
    status?: OrderStatus,
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (status) params.append("status", status);
    return axiosInstance.get<PageResponse<OrderListResponse>>(
      `/orders/users?page=${page}&size=${size}`,
    );
  },

  // 샵 주문 목록 조회
  getShopOrders: (
    page: number = 0,
    size: number = 10,
    status?: OrderStatus,
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (status) params.append("status", status);
    return axiosInstance.get<PageResponse<OrderListResponse>>(
      `/orders/shops?${params}`,
    );
  },

  // 주문 상세 조회
  getOrderDetail: (orderId: number) =>
    axiosInstance.get<OrderDetailResponse>(`/orders/${orderId}`),

  // 주문 상태 변경 (샵)
  updateOrderStatus: (orderId: number, data: OrderStatusChangeRequest) =>
    axiosInstance.patch<OrderDetailResponse>(`/orders/${orderId}/status`, data),

  // 주문 취소 (사용자)
  cancelOrder: (orderId: number, reason: string) =>
    axiosInstance.post(`/orders/${orderId}/cancel`, { reason }),
};
