# 0001. TanStack Start вместо Next.js

Дата: 2026-10-15
Статус: superseded by [0009](0009-nextjs-css-modules-rtk-query.md)

## Контекст

Сервис был на Next.js 16 (App Router, parallel routes, next-auth). Нужен SSR для SEO каталога, но без привязки к Next, с единым стеком с rbt-web (TanStack Router и Query, Vite).

## Решение

Перейти на TanStack Start: файловый роутинг в `src/routes`, загрузка данных через `loader` и TanStack Query, серверная логика через `createServerFn`, сборка Nitro в `.output` (Node 22).

## Последствия

- Один стек с rbt-web, общие практики и компоненты.
- Next.js и его API (`next/link`, `next/navigation`, `next-auth`) запрещены.
- `routeTree.gen.ts` генерируется и руками не правится.
- Параллельные маршруты Next заменены на `staticData` ([0006](0006-sheets-via-static-data.md)).
