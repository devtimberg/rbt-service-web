import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/shared/lib/route-paths";

/** Часть конфигурации без провайдеров — её импортирует middleware (edge runtime).
 * Провайдеры и callbacks с обращениями к API живут в `auth.ts`. */
export const authConfig = {
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },
  session: {
    strategy: "jwt",
    // Совпадает с AUTH_REFRESH_TOKEN_TTL на бэкенде (30 дней): дольше жить
    // сессии смысла нет — ротировать access будет уже нечем.
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [],
} satisfies NextAuthConfig;
