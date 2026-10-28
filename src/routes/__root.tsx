/// <reference types="vite/client" />
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RootLayout } from '@/app/layouts'
import { ErrorPage } from '@/pages/error'
import { NotFoundPage } from '@/pages/not-found'
import type { RouterContext } from '@/router'
import appCss from '@/app/styles/global.css?url'

const DESCRIPTION =
  'На сегодняшний день, практически все люди без исключения пользуются различными видами бытовой техники, компьютерами и смартфонами. Трудно представить дом без стиральной или посудомоечной машины, холодильника или морозильной камеры, водонагревательных приборов или варочной поверхности. Однако любая техника иногда подводит, выходя из строя или отказываясь работать. Причины неисправности могут быть абсолютно разные, от неправильной эксплуатации техники до естественного износа деталей и их поломки. '

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Сервисный центр ООО ТТЦ Рембыттехника' },
      { name: 'description', content: DESCRIPTION },
      { name: 'format-detection', content: 'telephone=no, email=no, address=no' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ru-RU">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
