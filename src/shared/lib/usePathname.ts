import { useRouter } from '@tanstack/react-router'
import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

/**
 * Текущий pathname без обязательного RouterProvider: в роутере подписывается на завершение навигации,
 * вне роутера (тесты, Storybook) отдаёт пустую строку.
 */
export function usePathname(): string {
  const router = useRouter({ warn: false })
  return useSyncExternalStore(
    router ? (onChange) => router.subscribe('onResolved', onChange) : noopSubscribe,
    () => router?.state.location.pathname ?? '',
    () => router?.state.location.pathname ?? '',
  )
}
