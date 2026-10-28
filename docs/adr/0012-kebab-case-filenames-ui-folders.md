# 0012. Имена файлов в kebab-case и папка на компонент в shared/ui

Дата: 2026-10-29
Статус: accepted
Частично заменяет: [0003](0003-fsd-and-imports.md) (строка про импорт `shared/ui` по модулю: `@/shared/ui/Button`)

## Контекст

Файлы компонентов были в PascalCase (`ProductCard.tsx`), остальные в camelCase и kebab-case вперемешку. На macOS файловая система нечувствительна к регистру: импорт `./Button` вместо `./button` работает локально, а на Linux в CI и Docker падает. `shared/ui` был плоской папкой из десятков файлов, тесты лежали сводными `*-primitives.test.tsx`. Открытый вопрос из [0009](0009-nextjs-css-modules-rtk-query.md): владелец решил «как в rbt-web» ([ADR 0020 rbt-web](../../../rbt-web/docs/adr/0020-kebab-case-filenames-ui-folders.md)).

## Решение

Принимаем ADR 0020 rbt-web:

1. **kebab-case везде.** Файлы и папки в `src/` строчные через дефис: `product-card.tsx`, `use-cart-store.ts`, `button.module.css`. Точки-суффиксы остаются (`model.test.ts`), тест называется `<файл>.test.ts(x)`. Имена экспортов (`ProductCard`) не меняются. Исключения: `src/routes/**` (имя файла там это URL в TanStack Router, и маршруты уйдут в фазе 2) и `src/routeTree.gen.ts`. Проверяет `unicorn/filename-case` (kebabCase) в [vite.config.ts](../../vite.config.ts).
2. **Папка на компонент в `shared/ui`.** `shared/ui/button/{button.tsx, button.module.css, button.test.tsx, index.ts}`. Родственные примитивы остаются в одном файле, если так было и раньше (`box.tsx` с `Box` и `Stack`, `field.tsx` с `Label`, `Fieldset`, `Legend`, `Output`, `text-field.tsx` с `OtpField`). В `shared/ui` один общий `index.ts` (`export * from './button'` и т.д.), снаружи импорт везде `import { Button } from '@/shared/ui'`; пути `@/shared/ui/<x>` запрещает `no-restricted-imports`. Внутри кита импорты относительные (`../button`), а `@/shared/ui` внутри `shared/ui` запрещён (циклы). Иконки остаются в `shared/ui/icons` (генерирует `make icons`) и экспортируются через ту же барель. `tokens.css` и `media.css` лежат в корне `shared/ui`. Сводные тесты разнесены по папкам компонентов.

## Последствия

- Переименования только по регистру на macOS делаются через `git mv` с промежуточным именем; линтер ловит оставшийся не-kebab на любой ОС.
- Барель означает, что страница в dev-режиме тянет весь кит; в проде tree-shaking справляется (замеры ADR 0020 rbt-web: JS без изменений, dev-модулей на главной больше на четверть).
- Новый примитив требует папки, `index.ts` и строки в `shared/ui/index.ts`.
- Тесты, мокающие кит (`vi.mock('@/shared/ui', ...)`), подменяют только нужные экспорты поверх `importOriginal`.
