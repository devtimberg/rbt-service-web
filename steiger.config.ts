import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

// Проверка структуры по Feature-Sliced Design (ADR 0012). Запуск: `pnpm lint:fsd`.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // Внутри слайса импорты относительные, между слайсами — абсолютные через `@/`.
      // В recommended выключено, у нас это часть договорённостей ADR 0012.
      'fsd/import-locality': 'error',
      // Steiger не видит корневую app/ (маршруты Next, вне src), поэтому страницы,
      // которые используются из маршрутов, считает «неиспользуемыми»,
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
  {
    // Тестовые хелперы стора (`@/shared/api/testing`) намеренно не в публичном API shared/api: иначе Testing Library уехала бы в прод
    files: ['./src/**/*.test.ts', './src/**/*.test.tsx'],
    rules: {
      'fsd/no-public-api-sidestep': 'off',
    },
  },
])
