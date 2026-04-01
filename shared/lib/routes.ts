import type { ComponentType } from "react";
import { CatalogPage, CatalogSubcategoryPage } from "@/screens/catalog";
import { MasterCallPage } from "@/screens/master-call";
import { ProfilePage } from "@/screens/profile";

export const ROUTES = {
  HOME: "/",
  CATALOG: "/catalog",
  FAVORITE: "/favorite",
  COMPARE: "/compare",
  CART: "/cart",
  PROFILE: "/profile",
  ORDERS_STATUS: "/orders-status",
  PARTS_REQUEST: "/parts/request",
  SERVICES_REPAIR: "/services-repair",
  MASTER_CALL: "/master-call",
  FEEDBACK: "/feedback",
} as const;

/** Пути, при которых в нижней панели активна вкладка «Главная» */
export const HOME_NAV_PATHS: string[] = [
  ROUTES.HOME,
  ROUTES.MASTER_CALL,
  ROUTES.SERVICES_REPAIR,
  ROUTES.FEEDBACK,
];

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export type RouteConfig = {
  path: string;
  title: string;
  sheetComponent?: ComponentType;
};

export const ROUTE_CONFIG: Record<AppRoute, RouteConfig> = {
  [ROUTES.HOME]: { path: ROUTES.HOME, title: "Рембыттехника" },
  [ROUTES.CATALOG]: {
    path: ROUTES.CATALOG,
    title: "Каталог",
    sheetComponent: CatalogPage,
  },
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
    title: "Заказ запчастей",
  },
  [ROUTES.SERVICES_REPAIR]: {
    path: ROUTES.SERVICES_REPAIR,
    title: "Услуги ремонта",
  },
  [ROUTES.MASTER_CALL]: {
    path: ROUTES.MASTER_CALL,
    title: "Вызов мастера",
    sheetComponent: MasterCallPage,
  },
  [ROUTES.FEEDBACK]: {
    path: ROUTES.FEEDBACK,
    title: "Обратная связь",
  },
};

/** Маршруты, у которых все подстраницы рендерятся через один sheetComponent */
const WILDCARD_SHEET_ROUTES: { prefix: string; sheetComponent: ComponentType }[] = [
  { prefix: "/catalog/", sheetComponent: CatalogSubcategoryPage },
];

export function getRouteConfig(pathname: string): RouteConfig {
  const exact = ROUTE_CONFIG[pathname as AppRoute];
  if (exact) {
    return exact;
  }

  const wildcard = WILDCARD_SHEET_ROUTES.find((r) =>
    pathname.startsWith(r.prefix),
  );

  const lastSegment = pathname.split("/").filter(Boolean).at(-1);
  const fallbackTitle = lastSegment
    ? decodeURIComponent(lastSegment)
    : "Страница";

  return {
    path: pathname,
    title: fallbackTitle,
    sheetComponent: wildcard?.sheetComponent,
  };
}
