// Глобальные стили первыми, раньше любых CSS Modules: в начале global.css объявлен порядок слоёв base, components,
// slices. Загрузись модуль раньше, его слой встал бы в порядок первым (ADR 0009)
import '@/app/styles/global.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RootLayout as AppShell } from '@/app/layouts'
import { AppProviders } from '@/app/root/app-providers'
import { fontVariables } from '@/app/styles/fonts'

// Все маршруты динамические: HTML не кэшируется Next (ADR 0009)
export const dynamic = 'force-dynamic'

const DESCRIPTION =
  'На сегодняшний день, практически все люди без исключения пользуются различными видами бытовой техники, компьютерами и смартфонами. Трудно представить дом без стиральной или посудомоечной машины, холодильника или морозильной камеры, водонагревательных приборов или варочной поверхности. Однако любая техника иногда подводит, выходя из строя или отказываясь работать. Причины неисправности могут быть абсолютно разные, от неправильной эксплуатации техники до естественного износа деталей и их поломки. '

export const metadata: Metadata = {
  title: 'Сервисный центр ООО ТТЦ Рембыттехника',
  description: DESCRIPTION,
  formatDetection: { telephone: false, email: false, address: false },
}

/** Корень документа: шторки и основной контент раскладывает `AppShell` (ADR 0013). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru-RU" className={fontVariables}>
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
