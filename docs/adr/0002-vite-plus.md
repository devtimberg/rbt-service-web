# 0002. Vite+ (vp, Oxlint, Oxfmt) вместо ESLint и Prettier

Дата: 2026-10-15
Статус: accepted

## Контекст

Нужен единый тулчейн для сборки, тестов, линта и форматирования. rbt-web предлагает перейти с Biome на Vite+ (ADR 0014 репозитория rbt-web (`docs/adr/0014-vite-plus.md`), статус proposed). Этот проект стал пилотом: в нём проверяется, что перенос возможен. Прежний набор здесь был ESLint и Prettier.

## Решение

Использовать `vite-plus` 1.2.0 (`vp dev|build|check|lint|fmt|test`). Конфигурация линта и форматирования лежит в `vite.config.ts` (блоки `lint`, `fmt`, `staged`), правила слоёв FSD в `lint/fsd-rules.ts`. Oxlint работает type-aware (`typeAware`, `typeCheck`), pre-commit запускает `vp staged`.

Отличия от Biome в rbt-web:

- `organizeImports` заменён сортировкой импортов Oxfmt (`sortImports`), порядок отличается;
- форматирование CSS и директив Tailwind не переносилось один в один, стиль выровнен через опции `fmt` (2 пробела, 120 колонок, одинарные кавычки, без `;`);
- `baseUrl` убран из `tsconfig.json` ради tsgolint (type-aware линт), алиас `@/*` задан через `paths`;
- `overrides` в `package.json`: `vite` заменяется на `npm:@voidzero-dev/vite-plus-core`, `vitest` фиксируется;
- правила `noRestrictedImports` переписаны в Oxlint `no-restricted-imports` с `overrides` по слоям; options в override заменяют базовые, поэтому шаблоны повторяются.

## Последствия

- Скрипты `check`, `lint`, `fmt`, `test` вызывают `vp`; ESLint, Prettier и их плагины запрещены.
- steiger остаётся вторым контуром защиты слоёв.
- Опыт пилота (что не перенеслось, список выше) используется при принятии ADR 0014 в rbt-web.
- Vite+ и Oxc молодые, версии фиксируем и обновляем отдельными изменениями.
