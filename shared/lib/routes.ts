export const ROUTES = {
  HOME: "/",
  CATALOG: "/catalog",
  FAVORITE: "/favorite",
  COMPARE: "/compare",
  CART: "/cart",
  PROFILE: "/profile",
  ORDERS_STATUS: "/orders/status",
  PARTS_REQUEST: "/parts/request",
  SERVICES_REPAIR: "/services/repair",
  MASTER_CALL: "/master-call",
  FEEDBACK: "/feedback",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const ROUTE_TITLES: Record<AppRoute, string> = {
  [ROUTES.HOME]: "Рембыттехника",
  [ROUTES.CATALOG]: "Каталог",
  [ROUTES.FAVORITE]: "Избранное",
  [ROUTES.COMPARE]: "Сравнение",
  [ROUTES.CART]: "Корзина",
  [ROUTES.PROFILE]: "Профиль",
  [ROUTES.ORDERS_STATUS]: "Статус заказа",
  [ROUTES.PARTS_REQUEST]: "Заявка на запчасти",
  [ROUTES.SERVICES_REPAIR]: "Ремонт",
  [ROUTES.MASTER_CALL]: "Вызов мастера",
  [ROUTES.FEEDBACK]: "Обратная связь",
};
