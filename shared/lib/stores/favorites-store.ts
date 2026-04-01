import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesStore = {
  items: Set<string>;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: new Set<string>(),
      toggle: (productId) =>
        set((state) => {
          const next = new Set(state.items);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return { items: next };
        }),
      has: (productId) => get().items.has(productId),
    }),
    {
      name: "rbt-favorites",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (!value) return null;
          const parsed = JSON.parse(value);
          parsed.state.items = new Set(parsed.state.items);
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
