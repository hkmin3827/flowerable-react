import { axiosInstance } from "@/shared/api/axios";
import { PageResponse } from "@/shared/types";
import {
  AdminUser,
  AdminShop,
  AdminFlower,
  AdminOrder,
  UserDetail,
  ShopDetail,
  FlowerCreateReq,
  FlowerUpdateReq,
  OrderSearchParams,
  AdminOrderDetail,
} from "./types";

// 사용자 관리 API
export const adminUserAPI = {
  getUsers: (status?: string, page: number = 0, size: number = 20) =>
    axiosInstance.get<PageResponse<AdminUser>>("/admin/users", {
      params: { accountStatus: status, page, size },
    }),

  getUserDetail: (userId: number) =>
    axiosInstance.get<UserDetail>(`/admin/users/${userId}`),

  activateUser: (userId: number) =>
    axiosInstance.patch(`/admin/users/${userId}/activate`),

  suspendUser: (userId: number) =>
    axiosInstance.patch(`/admin/users/${userId}/suspend`),

  searchUsers: (keyword: string, page: number = 0, size: number = 20) =>
    axiosInstance.get<PageResponse<AdminUser>>("/admin/users/search", {
      params: { keyword, page, size },
    }),
};

// 샵 관리 API
export const adminShopAPI = {
  getShops: (
    shopStatus?: string,
    accountStatus?: string,
    page: number = 0,
    size: number = 20,
  ) => {
    const params: Record<string, string | number | undefined> = { page, size };

    if (shopStatus) params.shopStatus = shopStatus;
    if (accountStatus) params.accountStatus = accountStatus;

    return axiosInstance.get("/admin/shops", { params });
  },

  getShopDetail: (shopId: number) =>
    axiosInstance.get<ShopDetail>(`/admin/shops/${shopId}`),

  activeShopAccount: (shopId: number) =>
    axiosInstance.patch(`/admin/shops/${shopId}/activate-account`),

  suspendShopAccount: (shopId: number) =>
    axiosInstance.patch(`/admin/shops/${shopId}/suspend-account`),

  approveShop: (shopId: number) =>
    axiosInstance.patch(`/admin/shops/${shopId}/approve`),

  rejectShop: (shopId: number) =>
    axiosInstance.patch(`/admin/shops/${shopId}/reject`),

  activateShop: (shopId: number) =>
    axiosInstance.patch(`/admin/shops/${shopId}/activate`),

  suspendShop: (shopId: number) =>
    axiosInstance.patch(`/admin/shops/${shopId}/suspend`),

  searchShops: (keyword: string, page: number = 0, size: number = 20) =>
    axiosInstance.get<PageResponse<AdminShop>>("/admin/shops/search", {
      params: { keyword, page, size },
    }),
};

// 꽃 관리 API
export const adminFlowerAPI = {
  getFlowers: (active?: boolean, page: number = 0, size: number = 20) =>
    axiosInstance.get<PageResponse<AdminFlower>>("/admin/flowers/list", {
      params: { active, page, size },
    }),

  registerFlower: (data: FlowerCreateReq) =>
    axiosInstance.post<number>("/admin/flowers/register", data),

  updateFlower: (flowerId: number, data: FlowerUpdateReq) =>
    axiosInstance.patch(`/admin/flowers/${flowerId}/update`, data),

  activateFlower: (flowerId: number) =>
    axiosInstance.patch(`/admin/flowers/${flowerId}/activate`),

  deactivateFlower: (flowerId: number) =>
    axiosInstance.patch(`/admin/flowers/${flowerId}/deactivate`),
};

// 주문 모니터링 API
export const adminOrderAPI = {
  getOrders: (params: OrderSearchParams, page: number = 0, size: number = 20) =>
    axiosInstance.get<PageResponse<AdminOrder>>("/admin/orders", {
      params: { ...params, page, size },
    }),

  getOrderDetail: (orderId: number) =>
    axiosInstance.get<AdminOrderDetail>(`/admin/orders/${orderId}`),
};
