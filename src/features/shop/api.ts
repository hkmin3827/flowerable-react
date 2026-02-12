import { axiosInstance } from "@/shared/api/axios";
import { PageResponse } from "@/shared/types";
import {
  ShopDetailResponse,
  ShopUpdateRequest,
  ShopFlowerResponse,
  ShopFlowerRegisterRequest,
  ShopFlowerUpdateRequest,
  ShopImageResponse,
  WrappingOptionResponse,
  WrappingOptionRequest,
  FlowerOrderStats,
} from "./types";

export const shopApi = {
  // 샵 상세 조회
  getShopDetail: (shopId: number): Promise<ShopDetailResponse> =>
    axiosInstance
      .get<ShopDetailResponse>(`/shops/${shopId}`)
      .then((res) => res.data),

  // 내 샵 정보 조회
  getMyShop: (): Promise<ShopDetailResponse> =>
    axiosInstance.get<ShopDetailResponse>("/shops/me").then((res) => res.data),

  // 샵 정보 수정
  updateShop: (data: ShopUpdateRequest): Promise<void> =>
    axiosInstance.patch("/shops/me", data),

  // ShopFlower 목록 조회
  getMyShopFlowers: (
    onSale?: boolean,
    page: number = 0,
    size: number = 12,
  ): Promise<PageResponse<ShopFlowerResponse>> => {
    const params = new URLSearchParams();
    if (onSale !== undefined) params.append("onSale", onSale.toString());
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sort", "id");

    return axiosInstance
      .get<
        PageResponse<ShopFlowerResponse>
      >(`/shopflowers?${params.toString()}`)
      .then((res) => res.data);
  },

  // ShopFlower 등록
  registerShopFlower: (data: ShopFlowerRegisterRequest): Promise<void> =>
    axiosInstance.post("/shopflowers/register", data),

  // ShopFlower 수정
  updateShopFlower: (
    shopFlowerId: number,
    data: ShopFlowerUpdateRequest,
  ): Promise<void> =>
    axiosInstance.patch(`/shopflowers/update/${shopFlowerId}`, data),

  // ShopFlower 활성화
  activateShopFlower: (shopFlowerId: number): Promise<void> =>
    axiosInstance.patch(`/shopflowers/activate/${shopFlowerId}`),

  // ShopFlower 비활성화
  deactivateShopFlower: (shopFlowerId: number): Promise<void> =>
    axiosInstance.patch(`/shopflowers/deactivate/${shopFlowerId}`),

  getTop5Flowers: () =>
    axiosInstance.get<FlowerOrderStats[]>("/shopflowers/dashboard/top-flowers"),

  // 샵 이미지 목록 조회
  getShopImages: (
    shopId: number,
    lastId?: number,
  ): Promise<ShopImageResponse[]> => {
    const params = new URLSearchParams();
    if (lastId) params.append("lastId", lastId.toString());
    return axiosInstance
      .get<ShopImageResponse[]>(`/shopimages/${shopId}?${params.toString()}`)
      .then((res) => res.data);
  },

  // 최신 샵 이미지 조회
  getLatestImages: (shopId: number): Promise<ShopImageResponse[]> =>
    axiosInstance
      .get<ShopImageResponse[]>(`/shopimages/${shopId}/latest`)
      .then((res) => res.data),

  // 샵 대표 이미지 조회
  getThumbnail: (shopId: number): Promise<ShopImageResponse | null> =>
    axiosInstance
      .get<ShopImageResponse>(`/shopimages/${shopId}/thumbnail`)
      .then((res) => res.data)
      .catch(() => null),

  // 포장 옵션 조회
  getWrappingOptions: (): Promise<WrappingOptionResponse> =>
    axiosInstance
      .get<WrappingOptionResponse>("/shops/wrapping-options")
      .then((res) => res.data),

  // 포장 옵션 저장
  saveWrappingOptions: (data: WrappingOptionRequest): Promise<void> =>
    axiosInstance.put("/shops/wrapping-options", data),
};
