import type { Product, FilterGroup, PriceRange } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Плата",
    brand: "Bosch, Samsung",
    image: "/images/placeholder-board.jpg",
    price: 2450,
    oldPrice: 3100,
    availability: "in-stock",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Испаритель",
    brand: "Haier",
    price: 4140,
    oldPrice: 5175,
    availability: "low-stock",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Холодильник-морозильник Бирюса-118",
    brand: "Бирюса",
    price: 16150,
    oldPrice: 18572,
    availability: "in-stock",
  },
  {
    id: "4",
    name: "Холодильник-морозильник Бирюса 880NF",
    brand: "Бирюса",
    price: 7600,
    oldPrice: 8740,
    availability: "pre-order",
    preOrderDate: "23 апреля",
  },
  {
    id: "5",
    name: "Фильтр",
    brand: "Indesit, Ariston, Hotpoint",
    price: 150,
    availability: "in-stock",
  },
  {
    id: "6",
    name: "Интегрированная плата",
    brand: "Maunfeld",
    price: 17770,
    oldPrice: 18650,
    availability: "in-stock",
  },
  {
    id: "7",
    name: "Плата",
    brand: "Атлант",
    price: 1390,
    availability: "in-stock",
  },
  {
    id: "8",
    name: "Плата питания",
    brand: "Seb",
    price: 1580,
    availability: "pre-order",
    preOrderDate: "17 апреля",
  },
];

export const MOCK_FILTER_GROUPS: FilterGroup[] = [
  {
    title: "Тип детали",
    type: "checkbox",
    options: [
      { label: "Платы управления", value: "boards", count: 24 },
      { label: "Компрессоры", value: "compressors", count: 18 },
      { label: "Дверцы и крышки", value: "doors", count: 31 },
      { label: "Уплотнители", value: "seals", count: 12 },
      { label: "Корзины и полки", value: "shelves", count: 9 },
    ],
  },
  {
    title: "Бренд холодильника",
    type: "checkbox",
    options: [
      { label: "Bosch", value: "bosch" },
      { label: "Samsung", value: "samsung" },
      { label: "Leran", value: "leran" },
      { label: "Beko", value: "beko" },
      { label: "Indesit", value: "indesit" },
      { label: "LG", value: "lg" },
    ],
  },
];

export const MOCK_AVAILABILITY_OPTIONS: FilterGroup = {
  title: "Наличие",
  type: "radio",
  options: [
    { label: "Все", value: "all" },
    { label: "В наличии", value: "in-stock" },
    { label: "Под заказ", value: "pre-order" },
  ],
};

export const MOCK_PRICE_RANGE: PriceRange = {
  min: 100,
  max: 15000,
};
