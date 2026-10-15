import { createFileRoute } from '@tanstack/react-router'
import { CatalogPage } from '@/pages/catalog'

// Каталог открывается шторкой
export const Route = createFileRoute('/catalog/')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Каталог — РБТ Сервис' }] }),
  component: CatalogPage,
})
