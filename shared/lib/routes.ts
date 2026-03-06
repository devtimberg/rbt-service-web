import type { ComponentType } from "react";
import { ProfilePage } from "@/screens/profile";

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

export type RouteConfig = {
  path: string;
  title: string;
  sheetComponent?: ComponentType;
};

export const ROUTE_CONFIG: Record<AppRoute, RouteConfig> = {
  [ROUTES.HOME]: { path: ROUTES.HOME, title: "Рембыттехника" },
  [ROUTES.CATALOG]: { path: ROUTES.CATALOG, title: "Каталог" },
  [ROUTES.FAVORITE]: { path: ROUTES.FAVORITE, title: "Избранное" },
  [ROUTES.COMPARE]: { path: ROUTES.COMPARE, title: "Сравнение" },
  [ROUTES.CART]: { path: ROUTES.CART, title: "Корзина" },
  [ROUTES.PROFILE]: {
    path: ROUTES.PROFILE,
    title: "Профиль",
    sheetComponent: ProfilePage,
  },
  [ROUTES.ORDERS_STATUS]: {
    path: ROUTES.ORDERS_STATUS,
    title: "Статус заказа",
  },
  [ROUTES.PARTS_REQUEST]: {
    path: ROUTES.PARTS_REQUEST,
    title: "Заявка на запчасти",
  },
  [ROUTES.SERVICES_REPAIR]: {
    path: ROUTES.SERVICES_REPAIR,
    title: "Ремонт",
  },
  [ROUTES.MASTER_CALL]: {
    path: ROUTES.MASTER_CALL,
    title: "Вызов мастера",
  },
  [ROUTES.FEEDBACK]: {
    path: ROUTES.FEEDBACK,
    title: "Обратная связь",
  },
};

export function getRouteConfig(pathname: string): RouteConfig {
  const exact = ROUTE_CONFIG[pathname as AppRoute];
  if (exact) {
    return exact;
  }

  const lastSegment = pathname.split("/").filter(Boolean).at(-1);
  const fallbackTitle = lastSegment
    ? decodeURIComponent(lastSegment)
    : "Страница";

  return {
    path: pathname,
    title: fallbackTitle,
  };
}
