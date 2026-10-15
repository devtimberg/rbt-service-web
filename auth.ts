import NextAuth, { CredentialsSignin, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { authConfig } from "./auth.config";
import { headers } from "next/headers";
import { authApi, ApiError, type ApiSession } from "@/shared/api";
import type { ClientMeta } from "@/shared/api/client";

/** Access-токен обновляем заранее: между проверкой и реальным запросом
 * к API проходит время, впритык обновлять нельзя. */
const REFRESH_SKEW_MS = 60_000;

/** Ошибка с машинным кодом бэкенда — NextAuth пробрасывает `code` на клиент,
 * там его переводим в русское сообщение через `toUserMessage`. */
class ApiCredentialsError extends CredentialsSignin {
  constructor(readonly code: string) {
    super(code);
  }
}

/** UA и IP браузера из входящего запроса — бэкенд пишет их в сессию,
 * иначе в списке устройств окажется сервер Next.js. */
async function clientMeta(): Promise<ClientMeta> {
  try {
    const incoming = await headers();
    return {
      userAgent: incoming.get("user-agent"),
      ip:
        incoming.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        incoming.get("x-real-ip"),
    };
  } catch {
    // Вне контекста запроса (например, фоновая ротация токена) заголовков нет.
    return {};
  }
}

function toAuthUser(session: ApiSession): User {
  if (!session.refreshToken) {
    // Не должно происходить: клиент всегда ходит с `X-Client-Type: native`.
    throw new Error("API не вернул refreshToken в bearer-режиме");
  }
  return {
    id: session.user.id,
    email: session.user.email,
    isEmailVerified: session.user.emailVerified,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenExpiresAt: Date.now() + session.expiresIn * 1000,
  };
}

/** Любую ошибку авторизации отдаём как CredentialsSignin — NextAuth не
 * пропускает произвольные исключения из `authorize` на клиент. */
function rethrowAsSigninError(error: unknown): never {
  if (error instanceof ApiError) {
    throw new ApiCredentialsError(error.code);
  }
  throw new ApiCredentialsError("network_error");
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const session = await authApi.refreshSession(
      token.refreshToken,
      await clientMeta(),
    );
    return {
      ...token,
      user: {
        id: session.user.id,
        email: session.user.email,
        isEmailVerified: session.user.emailVerified,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
      },
      accessToken: session.accessToken,
      // Гонка нескольких параллельных RSC-запросов: бэкенд в grace-окне
      // (AUTH_REFRESH_RACE_GRACE_SECONDS) отдаёт свежий access без нового
      // refresh — тогда оставляем прежний, он ещё валиден.
      refreshToken: session.refreshToken ?? token.refreshToken,
      accessTokenExpiresAt: Date.now() + session.expiresIn * 1000,
      error: undefined,
    };
  } catch {
    // Refresh отозван, истёк или переиспользован — сессию не спасти.
    return { ...token, error: "RefreshFailed" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) {
          throw new ApiCredentialsError("invalid_credentials");
        }
        try {
          return toAuthUser(
            await authApi.login(email, password, await clientMeta()),
          );
        } catch (error) {
          rethrowAsSigninError(error);
        }
      },
    }),
    /** Завершение регистрации. Отдельный провайдер, а не повторный вход по
     * паролю: `signup/complete` уже возвращает сессию, второй `login` создал бы
     * лишнюю refresh-family (лишнее «устройство» в списке сессий). */
    Credentials({
      id: "signup",
      credentials: {
        ticket: {},
        password: {},
        firstName: {},
        lastName: {},
      },
      async authorize(credentials) {
        try {
          return toAuthUser(
            await authApi.signupComplete(
              {
                ticket: String(credentials?.ticket ?? ""),
                password: String(credentials?.password ?? ""),
                firstName: String(credentials?.firstName ?? "").trim(),
                lastName: String(credentials?.lastName ?? "").trim(),
              },
              await clientMeta(),
            ),
          );
        } catch (error) {
          rethrowAsSigninError(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        return {
          ...token,
          user: {
            // `id`/`email` в типе NextAuth опциональны, но `authorize`
            // всегда заполняет их из ответа API.
            id: user.id as string,
            email: user.email as string,
            isEmailVerified: user.isEmailVerified,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
        };
      }

      // `useSession().update(...)` после смены пароля — бэкенд отзывает все
      // сессии и выдаёт новую пару, её и записываем поверх.
      if (trigger === "update" && session?.accessToken) {
        return {
          ...token,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken ?? token.refreshToken,
          accessTokenExpiresAt: session.accessTokenExpiresAt,
          error: undefined,
        };
      }

      if (Date.now() < token.accessTokenExpiresAt - REFRESH_SKEW_MS) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // refreshToken наружу не отдаём: `session` уходит на клиент через
      // useSession(). Отзыв на бэкенде делаем в events.signOut, где доступен JWT.
      session.user = { ...session.user, ...token.user };
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut(message) {
      if (!("token" in message) || !message.token) return;
      const { accessToken, refreshToken } = message.token;
      try {
        await authApi.logout(accessToken, refreshToken);
      } catch {
        // Токены на бэкенде могли уже протухнуть — куку всё равно чистим.
        // Эндпоинт идемпотентен, повторять запрос смысла нет.
      }
    },
  },
});
