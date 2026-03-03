import { axiosInstance } from "@/shared/api/axios";
import { PageResponse } from "@/shared/types";
import {
  OrderCreateReq,
  OrderDetail,
  OrderList,
  WrappingOption,
} from "./types";

// 주문 API (User)
export const userOrderAPI = {
  getOrders: (page: number = 0, size: number = 10) =>
    axiosInstance.get<PageResponse<OrderList>>("/orders/users", {
      params: { page, size },
    }),

  getOrderDetail: (orderId: number) =>
    axiosInstance.get<OrderDetail>(`/orders/users/${orderId}`),

  createOrder: (shopId: number, req: OrderCreateReq) =>
    axiosInstance.post<number>(`/orders/users/${shopId}`, req),

  cancelOrder: (orderId: number) =>
    axiosInstance.patch(`/orders/users/${orderId}/cancel`),

  getWrappingOptions: (shopId: number) =>
    axiosInstance.get<WrappingOption>(
      `/orders/users/${shopId}/wrapping-options`,
    ),
};

// 주문 API (Shop)
export const shopOrderAPI = {
  getOrders: (page: number = 0, size: number = 10) =>
    axiosInstance.get<PageResponse<OrderList>>("/orders/shops", {
      params: { page, size },
    }),

  getOrderDetail: (orderId: number) =>
    axiosInstance.get<OrderDetail>(`/orders/shops/${orderId}`),

  changeStatus: (orderId: number, status: string, cancelReason?: string) =>
    axiosInstance.patch(`/orders/shops/${orderId}`, {
      status,
      cancelReason,
    }),

  // 대시보드 API
  getRecentRequests: (page: number = 0, size: number = 5) =>
    axiosInstance.get<PageResponse<OrderList>>(
      "/orders/shops/dashboard/recent-requests",
      {
        params: {
          page,
          size,
          sort: "createdAt,desc",
        },
      },
    ),
};
