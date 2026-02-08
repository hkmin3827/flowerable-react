import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './types';

interface CartState {
  items: CartItem[];
  shopId: number | null;
  addItem: (item: CartItem, shopId: number) => void;
  removeItem: (shopFlowerId: number) => void;
  updateQuantity: (shopFlowerId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shopId: null,

      addItem: (item, shopId) => {
        const currentShopId = get().shopId;
        
        // 다른 샵의 상품이면 기존 장바구니 초기화
        if (currentShopId && currentShopId !== shopId) {
          const confirmed = confirm(
            '다른 샵의 상품이 담겨있습니다. 장바구니를 초기화하고 추가하시겠습니까?'
          );
          if (!confirmed) return;
          
          set({ items: [item], shopId });
          return;
        }

        set((state) => {
          const existingItem = state.items.find(
            (i) => i.shopFlowerId === item.shopFlowerId
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.shopFlowerId === item.shopFlowerId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item], shopId };
        });
      },

      removeItem: (shopFlowerId) =>
        set((state) => ({
          items: state.items.filter((item) => item.shopFlowerId !== shopFlowerId),
        })),

      updateQuantity: (shopFlowerId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.shopFlowerId === shopFlowerId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [], shopId: null }),

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (sum, item) => sum + (item.unitPrice + item.wrappingPrice) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
