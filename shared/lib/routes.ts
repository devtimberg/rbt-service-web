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
