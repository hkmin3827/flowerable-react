import { apiClient } from '@/shared/api';
import { ShopDetailResponse, ShopSearchResponse, ShopUpdateRequest } from './types';

export const shopApi = {
  // 샵 검색 (꽃을 보유한 샵 조회)
  searchShops: (flowerIds: number[], region?: string) => {
    const params = new URLSearchParams();
    flowerIds.forEach(id => params.append('flowerIds', String(id)));
    if (region) params.append('region', region);
    return apiClient.get<ShopSearchResponse[]>(`/shops/search?${params}`);
  },

  // 샵 상세 조회
  getShopDetail: (shopId: number) =>
    apiClient.get<ShopDetailResponse>(`/shops/${shopId}`),

  // 내 샵 정보 조회
  getMyShop: () =>
    apiClient.get<ShopDetailResponse>('/shops/me'),

  // 샵 정보 수정
  updateShop: (data: ShopUpdateRequest) =>
    apiClient.patch<ShopDetailResponse>('/shops/me', data),
};
