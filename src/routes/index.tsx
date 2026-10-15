import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/home'

// Главная рисуется в основном контенте, не шторкой
export const Route = createFileRoute('/')({
  component: HomePage,
})
