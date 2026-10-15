import { createFileRoute, lazyRouteComponent, notFound } from '@tanstack/react-router'

// Только для dev: в прод-сборке import.meta.env.DEV = false, динамический импорт
// вырезается как мёртвый код, страница не попадает в бандл, а роут отдаёт 404.
const component = import.meta.env.DEV ? lazyRouteComponent(() => import('@/pages/dev'), 'UiKitPage') : () => null

export const Route = createFileRoute('/_dev/ui')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  component,
})
