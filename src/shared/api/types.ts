/** Тело ошибки бэкенда rbt-service-api. На проводе — camelCase. */

export type ApiErrorBody = {
  code: string
  message: string
  attrErrors?: { attr: string; code: string; message: string }[]
  details?: string[] | null
  /** Присутствует только у 429 (`RateLimitedResponse`). */
  nextResendAt?: number
  nextResendIn?: number
}

/** Сериализуемая ошибка RTK Query, без экземпляров Error и персональных данных. */
export type QueryError = {
  status: number
  code?: string
  message: string
  attrErrors?: { attr: string; code: string; message: string }[]
}
