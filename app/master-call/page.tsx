import type { Metadata } from 'next'
import { MasterCallPage } from '@/pages/master-call'
import { OPEN_GRAPH_BASE, ROUTES, SUPPORT_PHONE } from '@/shared/config'

export const metadata: Metadata = {
  title: 'Вызвать мастера',
  description: `Вызов мастера по ремонту и установке бытовой техники в Челябинске: холодильники, стиральные и посудомоечные машины, плиты, духовки. Оставьте заявку онлайн или позвоните ${SUPPORT_PHONE}.`,
  alternates: { canonical: ROUTES.MASTER_CALL },
  openGraph: { ...OPEN_GRAPH_BASE, url: ROUTES.MASTER_CALL },
}

export default function Page() {
  return <MasterCallPage />
}
