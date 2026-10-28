import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

// Проверка структуры по Feature-Sliced Design (ADR 0012). Запуск: `pnpm lint:fsd`.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    // src/routes — файловые роуты TanStack Router, а не FSD-слой; корневые файлы src/*
    // (router.tsx, client.tsx, server.ts, request-info.ts, routeTree.gen.ts) —
    // точки входа TanStack Start. Steiger их не разбирает.
    ignores: [
      './src/routes/**',
      './src/routeTree.gen.ts',
      './src/router.tsx',
      './src/client.tsx',
      './src/server.ts',
      './src/request-info.ts',
    ],
  },
  {
    rules: {
      // Внутри слайса импорты относительные, между слайсами — абсолютные через `@/`.
      // В recommended выключено, у нас это часть договорённостей ADR 0012.
      'fsd/import-locality': 'error',
      // Steiger не видит src/routes (это не FSD-слой), поэтому сущности и страницы,
      // которые используются из роутов (region, product и т.п.), считает «неиспользуемыми»,
      // а сущности с одним потребителем (banner, brand, home, cart…) предлагает слить.
      // Сущности у нас выделены сознательно — по доменным моделям API, — а фичи — по
      // пользовательским действиям, даже если сейчас у них один потребитель.
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    // Shared — не слайс, а набор сегментов. Сегменты ссылаются друг на друга абсолютно
    // (`@/shared/lib/cn` из shared/ui), чтобы файл можно было переносить без правки путей.
    // Steiger считает весь shared одним слайсом и требует относительных путей — отключаем.
    files: ['./src/shared/**'],
    rules: {
      'fsd/import-locality': 'off',
    },
  },
])
