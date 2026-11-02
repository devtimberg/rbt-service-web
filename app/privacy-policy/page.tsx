import type { Metadata } from 'next'
import { PrivacyPolicyPage } from '@/pages/privacy-policy'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <PrivacyPolicyPage />
}
