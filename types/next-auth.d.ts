import type { DefaultSession } from "next-auth";

/** Причина, по которой сессия перестала быть валидной.
 * Проставляется в jwt-callback при провале ротации refresh-токена. */
export type SessionError = "RefreshFailed";

export type SessionUser = {
  id: string;
  email: string;
  /** Не `emailVerified` — это имя занято `AdapterUser` под тип `Date | null`. */
  isEmailVerified: boolean;
  firstName: string;
  lastName: string;
};

declare module "next-auth" {
  interface Session {
    user: SessionUser & DefaultSession["user"];
    /** Access-токен бэкенда — для запросов к защищённым эндпоинтам API. */
    accessToken: string;
    error?: SessionError;
  }

  interface User extends SessionUser {
    accessToken: string;
    refreshToken: string;
    /** Unix-время в мс, когда истекает access-токен. */
    accessTokenExpiresAt: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: SessionUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    error?: SessionError;
  }
}
