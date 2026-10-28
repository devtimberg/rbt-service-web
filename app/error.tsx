'use client'

import { ErrorPage } from '@/pages/error'

export default function RouteError({ error }: { error: Error }) {
  return <ErrorPage error={error} />
}
