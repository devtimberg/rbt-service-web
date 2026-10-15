/** Чистые константы маршрутов — без импортов React-компонентов.
 * Отдельно от `routes.ts`, чтобы middleware (edge runtime) не тянул экраны
 * в свой бандл через `ROUTE_CONFIG`. */

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
  SEARCH: "/search",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PASSWORD_RESET: "/password-reset",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Пути, при которых в нижней панели активна вкладка «Главная» */
export const HOME_NAV_PATHS: string[] = [
  ROUTES.HOME,
  ROUTES.MASTER_CALL,
  ROUTES.SERVICES_REPAIR,
  ROUTES.FEEDBACK,
];

/** Маршруты, требующие авторизации. Проверка идёт по префиксу,
 * поэтому вложенные страницы (`/profile/sessions`) защищены автоматически.
 *
 * Корзина, избранное и сравнение сюда намеренно не входят: они хранятся
 * локально (zustand + persist) и никаких серверных данных не требуют —
 * анонимный пользователь набирает корзину и логинится только при оформлении. */
export const PROTECTED_ROUTES: string[] = [ROUTES.PROFILE];

/** Страницы входа/регистрации: авторизованного пользователя с них уводим. */
export const AUTH_ROUTES: string[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.PASSWORD_RESET,
];

/** Параметр, в котором middleware сохраняет исходный путь для редиректа после входа. */
export const CALLBACK_URL_PARAM = "callbackUrl";

function matchesPrefix(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isProtectedRoute(pathname: string) {
  return matchesPrefix(pathname, PROTECTED_ROUTES);
}

export function isAuthRoute(pathname: string) {
  return matchesPrefix(pathname, AUTH_ROUTES);
}
