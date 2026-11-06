import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { apiFetch } from './client'
import type { QueryError } from './types'

export type ApiClients = { request: typeof apiFetch }

/**
 * Базовый RTK Query (ADR 0009). Эндпоинты добавляют сущности через `api.injectEndpoints` в своём `api.ts`,
 * `queryFn` поверх `apiFetch`. Клиент запроса передаётся через extraArgument стора.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<QueryError>(),
  endpoints: () => ({}),
})
