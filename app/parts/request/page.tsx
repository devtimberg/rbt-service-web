import type { Metadata } from 'next'
import { PartsRequestPage } from '@/pages/parts-request'
import { OPEN_GRAPH_BASE, ROUTES } from '@/shared/config'

export const metadata: Metadata = {
  title: 'Заказать запчасть',
  description:
    'Не нашли запчасть в каталоге? Оставьте заявку в свободной форме — подберём деталь и предложим аналоги. Доставка по всей России.',
  alternates: { canonical: ROUTES.PARTS_REQUEST },
  openGraph: { ...OPEN_GRAPH_BASE, url: ROUTES.PARTS_REQUEST },
}

export default function Page() {
  return <PartsRequestPage />
}
