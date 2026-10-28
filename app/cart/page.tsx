import type { Metadata } from 'next'
import { CartPage } from '@/pages/cart'

export const metadata: Metadata = { title: 'Корзина — РБТ Сервис' }

export default function Page() {
  return <CartPage />
}
