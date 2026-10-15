/// <reference types="vite/client" />
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  HeadContent,
  Link,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RootLayout } from '@/app/layouts'
import { loadCurrentUser } from '@/entities/session'
import type { RouterContext } from '@/router'
import appCss from '@/styles.css?url'

const DESCRIPTION =
  'На сегодняшний день, практически все люди без исключения пользуются различными видами бытовой техники, компьютерами и смартфонами. Трудно представить дом без стиральной или посудомоечной машины, холодильника или морозильной камеры, водонагревательных приборов или варочной поверхности. Однако любая техника иногда подводит, выходя из строя или отказываясь работать. Причины неисправности могут быть абсолютно разные, от неправильной эксплуатации техники до естественного износа деталей и их поломки. '

export const Route = createRootRouteWithContext<RouterContext>()({
  // Пользователь из cookie-сессии кладём в контекст: guard-роуты (_guest, _authed) читают context.user
  beforeLoad: async ({ context }) => ({ user: await loadCurrentUser(context.queryClient) }),
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
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ru-RU">
      <head>
        <HeadContent />
      </head>
      <body className="bg-primary-500 lg:bg-primary-900 flex h-dvh min-h-dvh w-full flex-col overflow-hidden p-0 antialiased lg:p-4 lg:py-4">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="mt-6 flex-1 rounded-t-[24px] bg-[#F7FAFF] p-4 py-16 text-center text-primary lg:rounded-[40px]">
      <h1 className="text-3xl font-bold">Страница не найдена</h1>
      <p className="mt-2 text-secondary">Проверьте адрес или вернитесь на главную.</p>
      <Link to="/" className="mt-6 inline-block text-link underline">
        На главную
      </Link>
    </div>
  )
}

function ErrorView({ error }: ErrorComponentProps) {
  return (
    <div className="mx-auto max-w-xl p-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Что-то пошло не так</h1>
      <p className="mt-2 text-tertiary">
        {import.meta.env.DEV && error instanceof Error ? error.message : 'Попробуйте обновить страницу.'}
      </p>
    </div>
  )
}
