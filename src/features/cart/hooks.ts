import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "./api";
import type { AddToCartRequest, UpdateCartItemRequest } from "./types";
import { useAuthStore } from "../auth/store";

// 장바구니 조회
export const useCart = () => {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: cartApi.getCart,
    staleTime: 1000 * 30, // 30초 캐싱 (선택)
  });
};

// 장바구니 아이템 개수 조회
export const useCartCount = (enabled: boolean) => {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ["cart", "count", userId],
    queryFn: cartApi.getCartCount,
    initialData: { count: 0 },
    staleTime: 1000 * 30,
    enabled: !!userId && enabled,
  });
};

// 장바구니에 추가
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddToCartRequest) => cartApi.addToCart(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
  });
};

// 장바구니 항목 삭제
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
  });
};

// 장바구니 전체 비우기
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
  });
};
