import { notFound } from 'next/navigation'
import { UiKitPage } from '@/pages/dev'

// Витрина UI-кита только в dev: в прод-сборке 404
export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <UiKitPage />
}
