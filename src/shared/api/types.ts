/** Тело ошибки бэкенда rbt-service-api. На проводе — camelCase. */

export type ApiErrorBody = {
  code: string
  message: string
  details?: string[] | null
  /** Присутствует только у 429 (`RateLimitedResponse`). */
  nextResendAt?: number
  nextResendIn?: number
}
