import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "./api";
import type { AddToCartRequest, UpdateCartItemRequest } from "./types";
import { useAuthStore } from "../auth/store";

// 장바구니 조회
export const useCart = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["cart"],
    enabled: isAuthenticated,
    queryFn: cartApi.getCart, // 그대로 사용 (이미 data 반환)
    initialData: [] as any, // CartInfo 타입에 맞게 수정 가능
    staleTime: 1000 * 30, // 30초 캐싱 (선택)
  });
};

// 장바구니 아이템 개수 조회
export const useCartCount = (enabled: boolean) => {
  return useQuery({
    queryKey: ["cart", "count"],
    queryFn: cartApi.getCartCount,
    initialData: { count: 0 },
    staleTime: 1000 * 30,
    enabled,
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

// 장바구니 항목 수정
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItemId,
      request,
    }: {
      cartItemId: number;
      request: UpdateCartItemRequest;
    }) => cartApi.updateCartItem(cartItemId, request),
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
