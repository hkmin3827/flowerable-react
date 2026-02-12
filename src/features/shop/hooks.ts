import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopApi } from "./api";
import { ShopUpdateRequest } from "./types";

export const shopKeys = {
  all: ["shops"] as const,
  search: (flowerIds: number[], region?: string) =>
    [...shopKeys.all, "search", flowerIds, region] as const,
  detail: (shopId: number) => [...shopKeys.all, "detail", shopId] as const,
  myShop: () => [...shopKeys.all, "me"] as const,
};

// 샵 상세 조회
export const useShopDetail = (shopId: number) => {
  return useQuery({
    queryKey: shopKeys.detail(shopId),
    queryFn: () => shopApi.getShopDetail(shopId),
    enabled: !!shopId,
  });
};

// 내 샵 조회
export const useMyShop = () => {
  return useQuery({
    queryKey: shopKeys.myShop(),
    queryFn: () => shopApi.getMyShop(),
  });
};

// 샵 정보 수정
export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShopUpdateRequest) => shopApi.updateShop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.myShop() });
    },
  });
};
