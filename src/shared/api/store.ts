import { configureStore } from '@reduxjs/toolkit'
import { api, type ApiClients } from './api'
import { apiFetch } from './client'

/** Стор приложения: пока только RTK Query. На вкладку один (`StoreProvider`). */
export function makeStore(clients: ApiClients = { request: apiFetch }) {
  return configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: clients } }).concat(api.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
