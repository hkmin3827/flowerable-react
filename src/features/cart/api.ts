import { axiosInstance } from "@/shared/api/axios";
import type {
  CartInfo,
  CartCount,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "./types";

export const cartApi = {
  // 장바구니 조회
  getCart: async (): Promise<CartInfo> => {
    const { data } = await axiosInstance.get("/cart");
    console.log("cart response:", data);
    return data;
  },

  // 장바구니 아이템 개수 조회
  getCartCount: async (): Promise<CartCount> => {
    const { data } = await axiosInstance.get("/cart/count");
    return data;
  },

  // 장바구니에 추가
  addToCart: async (request: AddToCartRequest): Promise<CartInfo> => {
    const { data } = await axiosInstance.post("/cart", request);
    return data;
  },

  // 장바구니 항목 삭제
  removeCartItem: async (cartItemId: number): Promise<CartInfo> => {
    const { data } = await axiosInstance.delete(`/cart/${cartItemId}`);
    return data;
  },

  // 장바구니 전체 비우기
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete("/cart");
  },
};
