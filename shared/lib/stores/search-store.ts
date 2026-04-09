import { create } from "zustand";

type SearchStore = {
  query: string;
  setQuery: (query: string) => void;
  reset: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  reset: () => set({ query: "" }),
}));
