import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "./api";
import type { AddToCartRequest } from "./types";
import { useAuthStore } from "../auth/store";
import { extractErrorMessage } from "@/shared/utils/errorHandler";

export const useCart = () => {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: cartApi.getCart,
    staleTime: 1000 * 30, // 30초 캐싱 (선택)
  });
};

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

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddToCartRequest) => cartApi.addToCart(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};
