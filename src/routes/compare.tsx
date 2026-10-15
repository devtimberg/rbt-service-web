import { createFileRoute } from '@tanstack/react-router'

// Сравнение: страницы пока нет, в прежнем коде открывалась пустая шторка — поведение сохранено
export const Route = createFileRoute('/compare')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Сравнение — РБТ Сервис' }] }),
  component: () => null,
})
