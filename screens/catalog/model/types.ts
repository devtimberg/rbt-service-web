export type ProductAvailability = "in-stock" | "low-stock" | "pre-order";

export type Product = {
  id: string;
  name: string;
  article?: string;
  brand: string;
  image?: string;
  price: number;
  oldPrice?: number;
  availability: ProductAvailability;
  isFavorite?: boolean;
  isInCart?: boolean;
  preOrderDate?: string;
};

export type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

export type FilterGroup = {
  title: string;
  type: "checkbox" | "radio";
  options: FilterOption[];
};

export type PriceRange = {
  min: number;
  max: number;
};
