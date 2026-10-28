import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

/** Контекст роутера (то, что известно до beforeLoad). */
export type RouterContext = {
  queryClient: QueryClient
}

// Start создаёт роутер на каждый SSR-запрос, поэтому QueryClient тоже на запрос:
// кэш одного посетителя не должен попасть в HTML другого.
export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  })

  const router = createRouter({
    routeTree,
    context: { queryClient } satisfies RouterContext,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  })

  // Провайдер Query + дегидрация на сервере и гидрация в браузере
  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
  /** Статические данные роута. `sheet: true` — страница открывается шторкой поверх лайаута (см. app/layouts). */
  interface StaticDataRouteOption {
    sheet?: boolean
  }
}
