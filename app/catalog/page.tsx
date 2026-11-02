import type { Metadata } from 'next'
import { CatalogPage } from '@/pages/catalog'
import { OPEN_GRAPH_BASE, ROUTES } from '@/shared/config'

export const metadata: Metadata = {
  title: 'Каталог',
  description:
    'Каталог запчастей для бытовой техники: стиральные машины, холодильники, пылесосы, плиты и другое. Заказ детали онлайн с доставкой.',
  alternates: { canonical: ROUTES.CATALOG },
  openGraph: { ...OPEN_GRAPH_BASE, url: ROUTES.CATALOG },
}

export default function Page() {
  return <CatalogPage />
}
