import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Базовый RTK Query (ADR 0009). Эндпоинты добавляют сущности через `api.injectEndpoints` в своём `api.ts`,
 * `queryFn` поверх `apiFetch`. Тип ошибки появится вместе с первым эндпоинтом.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: () => ({}),
})
