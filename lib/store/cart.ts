import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  stock: number;
  tierUnitOfMeasure: string | null;
  tierShownAs: string | null;
  imageUrl: string;
  productType: "sativa" | "indica" | "hybrid" | null;
  categoryName: string | null;
}

interface CartStore {
  items: CartItem[];
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  setQty: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  clear: () => void;
  totalCents: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQty: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(quantity, i.stock) }
                : i
            ),
          };
        }),

      setQty: (item, quantity) =>
        set((state) => {
          const clamped = Math.min(quantity, item.stock);
          if (clamped <= 0) {
            return { items: state.items.filter((i) => i.productId !== item.productId) };
          }
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: clamped } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clamped }] };
        }),

      clear: () => set({ items: [] }),

      totalCents: () =>
        get().items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "terra-cart" }
  )
);
