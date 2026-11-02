import type { Metadata } from 'next'
import { CatalogSubcategoryPage } from '@/pages/catalog'
import { OPEN_GRAPH_BASE, ROUTES } from '@/shared/config'

type Props = { params: Promise<{ slug: string[] }> }

// Данных категорий из API пока нет, поэтому заголовок общий, а canonical строим по адресу подраздела
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const subpath = `${ROUTES.CATALOG}/${slug.join('/')}`
  return {
    title: 'Каталог',
    description:
      'Каталог запчастей для бытовой техники: стиральные машины, холодильники, пылесосы, плиты и другое. Заказ детали онлайн с доставкой.',
    alternates: { canonical: subpath },
    openGraph: { ...OPEN_GRAPH_BASE, url: subpath },
  }
}

export default function Page() {
  return <CatalogSubcategoryPage />
}
