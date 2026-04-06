import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  items: Map<string, number>;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  getQuantity: (productId: string) => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: new Map<string, number>(),
      toggle: (productId) =>
        set((state) => {
          const next = new Map(state.items);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.set(productId, 1);
          }
          return { items: next };
        }),
      has: (productId) => get().items.has(productId),
      increment: (productId) =>
        set((state) => {
          const next = new Map(state.items);
          const current = next.get(productId) ?? 0;
          next.set(productId, current + 1);
          return { items: next };
        }),
      decrement: (productId) =>
        set((state) => {
          const next = new Map(state.items);
          const current = next.get(productId) ?? 0;
          if (current <= 1) {
            next.delete(productId);
          } else {
            next.set(productId, current - 1);
          }
          return { items: next };
        }),
      remove: (productId) =>
        set((state) => {
          const next = new Map(state.items);
          next.delete(productId);
          return { items: next };
        }),
      getQuantity: (productId) => get().items.get(productId) ?? 0,
    }),
    {
      name: "rbt-cart",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (!value) return null;
          const parsed = JSON.parse(value);
          parsed.state.items = new Map<string, number>(parsed.state.items);
          return parsed;
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: { ...value.state, items: [...value.state.items] },
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
