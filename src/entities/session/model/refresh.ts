/** Access-токен обновляем заранее: между проверкой и реальным запросом к API проходит время,
 * впритык обновлять нельзя. */
export const REFRESH_SKEW_MS = 60_000

/** Годен ли access-токен без обновления: до истечения осталось больше `REFRESH_SKEW_MS`. */
export function isAccessTokenFresh(accessTokenExpiresAt: number, now: number): boolean {
  return now < accessTokenExpiresAt - REFRESH_SKEW_MS
}

/** Момент истечения access-токена по `expiresIn` (секунды) из ответа API. */
export function accessTokenExpiresAt(expiresIn: number, now: number): number {
  return now + expiresIn * 1000
}
