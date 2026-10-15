/** Пользователь, который уходит на клиент. Токены наружу не отдаются никогда. */
export type SessionUser = {
  id: string
  email: string
  isEmailVerified: boolean
  firstName: string
  lastName: string
}

/** Содержимое серверной cookie-сессии (в браузере доступно только в зашифрованном виде). */
export type SessionData = {
  user: SessionUser
  accessToken: string
  refreshToken: string
  /** Unix-время (мс), когда истекает access-токен. */
  accessTokenExpiresAt: number
}
