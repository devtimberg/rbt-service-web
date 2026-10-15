import { createFileRoute } from '@tanstack/react-router'
import { CatalogSubcategoryPage } from '@/pages/catalog'

// Подкатегория каталога (splat) открывается шторкой. Страница пока на моках и сегмент из адреса не использует
export const Route = createFileRoute('/catalog/$')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Каталог — РБТ Сервис' }] }),
  component: CatalogSubcategoryPage,
})
