// Глобальные стили первыми, раньше любых CSS Modules: в начале global.css объявлен порядок слоёв base, components,
// slices. Загрузись модуль раньше, его слой встал бы в порядок первым (ADR 0009)
import '@/app/styles/global.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RootLayout as AppShell } from '@/app/layouts'
import { AppProviders } from '@/app/root/app-providers'
import { fontVariables } from '@/app/styles/fonts'
import { getServerEnv, OPEN_GRAPH_BASE } from '@/shared/config'

// Все маршруты динамические: HTML не кэшируется Next (ADR 0009)
export const dynamic = 'force-dynamic'

const DESCRIPTION =
  'На сегодняшний день, практически все люди без исключения пользуются различными видами бытовой техники, компьютерами и смартфонами. Трудно представить дом без стиральной или посудомоечной машины, холодильника или морозильной камеры, водонагревательных приборов или варочной поверхности. Однако любая техника иногда подводит, выходя из строя или отказываясь работать. Причины неисправности могут быть абсолютно разные, от неправильной эксплуатации техники до естественного износа деталей и их поломки. '

// База для абсолютных SEO-адресов (canonical, og:url): домен берём из SITE_URL (по умолчанию боевой rbt74.ru)
const SITE_URL = getServerEnv().SITE_URL

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Сервисный центр ООО ТТЦ Рембыттехника',
    template: '%s — РБТ Сервис',
  },
  description: DESCRIPTION,
  // Открытый граф: общая часть в src/shared/config/open-graph.ts (страницы раскладывают её с url)
  openGraph: { ...OPEN_GRAPH_BASE },
  twitter: { card: 'summary' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false, email: false, address: false },
}

/** Корень документа: шторки и основной контент раскладывает `AppShell` (ADR 0013). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // iOS-браузер может добавить служебный __gCrRemoteFrameToken до гидратации.
    <html lang="ru-RU" className={fontVariables} suppressHydrationWarning>
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
