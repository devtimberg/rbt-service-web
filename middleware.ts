import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import {
  CALLBACK_URL_PARAM,
  ROUTES,
  isAuthRoute,
  isProtectedRoute,
} from "@/shared/lib/route-paths";

// Конфиг без провайдеров: middleware только читает JWT-куку, обращений к API
// здесь нет — иначе бандл не влезет в ограничения edge runtime.
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname, search } = request.nextUrl;
  // `error` выставляется, когда ротация refresh-токена провалилась — сессия
  // формально есть, но токены мертвы, пускать в защищённые разделы нельзя.
  const isSignedIn = Boolean(request.auth) && !request.auth?.error;

  if (isProtectedRoute(pathname) && !isSignedIn) {
    const loginUrl = new URL(ROUTES.LOGIN, request.nextUrl.origin);
    loginUrl.searchParams.set(CALLBACK_URL_PARAM, `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && isSignedIn) {
    return NextResponse.redirect(new URL(ROUTES.PROFILE, request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Всё, кроме внутренних роутов Next.js, статики и файлов с расширением.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
