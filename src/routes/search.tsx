import { createFileRoute } from '@tanstack/react-router'
import { SearchPage } from '@/pages/search'

// Поиск открывается шторкой; запрос пока читается из стора поиска, не из search-параметров
export const Route = createFileRoute('/search')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Поиск — РБТ Сервис' }] }),
  component: SearchPage,
})
