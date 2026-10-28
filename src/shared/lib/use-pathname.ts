'use client'

import { usePathname as useNextPathname } from 'next/navigation'

/**
 * Текущий pathname без `null`. Типы Next делают хук nullable из-за корневой pages/ (пустая, ADR 0009); в App Router
 * адрес есть всегда. Вне роутера (компонентные тесты без провайдера) хук отдаёт `null`, тогда пустая строка.
 */
export function usePathname(): string {
  return useNextPathname() ?? ''
}
