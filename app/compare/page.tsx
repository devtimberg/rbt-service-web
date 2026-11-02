import type { Metadata } from 'next'

// Служебная страница: в выдачу не отдаём
export const metadata: Metadata = {
  title: 'Сравнение',
  robots: { index: false, follow: false },
}

// Страницы сравнения пока нет: шторка открывается пустой, как в прежнем коде
export default function Page() {
  return null
}
