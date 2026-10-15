import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '@/pages/cart'

// Корзина открывается шторкой
export const Route = createFileRoute('/cart')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Корзина — РБТ Сервис' }] }),
  component: CartPage,
})
