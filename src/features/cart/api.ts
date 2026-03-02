import { axiosInstance } from "@/shared/api/axios";
import type { CartInfo, CartCount, AddToCartRequest } from "./types";

export const cartApi = {
  getCart: async (): Promise<CartInfo> => {
    const { data } = await axiosInstance.get("/cart");
    console.log("cart response:", data);
    return data;
  },

  getCartCount: async (): Promise<CartCount> => {
    const { data } = await axiosInstance.get("/cart/count");
    return data;
  },

  addToCart: async (request: AddToCartRequest): Promise<CartInfo> => {
    const { data } = await axiosInstance.post("/cart", request);
    return data;
  },

  removeCartItem: async (cartItemId: number): Promise<CartInfo> => {
    const { data } = await axiosInstance.delete(`/cart/${cartItemId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    await axiosInstance.delete("/cart");
  },
};
