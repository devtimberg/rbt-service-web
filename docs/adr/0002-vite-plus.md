# 0002. Vite+ (vp, Oxlint, Oxfmt) вместо ESLint и Prettier

Дата: 2026-10-15
Статус: accepted, частично заменён [0009](0009-nextjs-css-modules-rtk-query.md) (сборка и dev через Next с фазы 2) и [0011](0011-pnpm-node-24.md) (`overrides` теперь в `pnpm-workspace.yaml`)

## Контекст

Нужен единый тулчейн для сборки, тестов, линта и форматирования. rbt-web перешёл с Biome на Vite+ (ADR 0014 репозитория rbt-web, `docs/adr/0014-vite-plus.md`, accepted 2026-10-14). Этот проект стал пилотом, а теперь выровнен по эталону. Прежний набор здесь был ESLint и Prettier.

## Решение

Использовать `vite-plus` 1.2.0 (`vp dev|build|check|lint|fmt|test`). Конфигурация линта и форматирования лежит в `vite.config.ts` (блоки `lint`, `fmt`, `staged`), правила слоёв FSD записаны там же inline (отдельный `lint/fsd-rules.ts` удалён). Плагины Oxlint: `typescript`, `react`, `jsx-a11y`, `vitest`, плюс `vite-plus/oxlint-plugin` через `jsPlugins` (`prefer-vite-plus-imports`). Oxlint работает type-aware (`typeAware`, `typeCheck`). Плагины сборки подключены через `lazyPlugins`, тесты вынесены в `vitest.config.ts` (импорты из `vite-plus/test`).

Git-хуки: вместо lefthook используется `vp hooks`. Каталог `.vite-hooks`: `pre-commit` запускает `vp staged` (`vp check --fix` и steiger), `commit-msg` запускает `scripts/check-commit-msg.ts`. Хуки ставит `prepare` (`vp config`), вручную `make hooks`. Хуки не обходим (`--no-verify`).

Отличия от Biome в rbt-web:

- `organizeImports` заменён сортировкой импортов Oxfmt (`sortImports`), порядок отличается;
- форматирование CSS и директив Tailwind не переносилось один в один, стиль выровнен через опции `fmt` (2 пробела, 120 колонок, одинарные кавычки, без `;`);
- `baseUrl` убран из `tsconfig.json` ради tsgolint (type-aware линт), алиас `@/*` задан через `paths`;
- `overrides` в `package.json`: `vite` заменяется на `npm:@voidzero-dev/vite-plus-core`, `vitest` фиксируется;
- правила `noRestrictedImports` переписаны в Oxlint `no-restricted-imports` с `overrides` по слоям; options в override заменяют базовые, поэтому шаблоны повторяются;
- `toHaveTextContent` с RegExp не используем (конфликт типов матчеров), вместо него `textContent` и `toMatch`.

Отличия от эталона rbt-web:

- `vite-plus` 1.2.0 (в rbt-web 1.1.0 на момент принятия 0014);
- у `jsx-a11y/label-has-associated-control` заданы `controlComponents` (`Checkbox`, `RadioGroupItem`, `Input`, `TextInput`) под набор примитивов этого проекта;
- иконки SVGR (`src/shared/ui/icons/**`) игнорируются только в `lint`, форматирование (`fmt`) их обрабатывает.

## Последствия

- Скрипты `lint` (`vp check`), `format` (`vp check --fix`), `test` (`vp test run`) вызывают `vp`; ESLint, Prettier, Biome, lefthook и их плагины запрещены.
- steiger остаётся вторым контуром защиты слоёв.
- Опыт пилота (что не перенеслось, список выше) учтён в ADR 0014 rbt-web, который принят.
- Vite+ и Oxc молодые, версии фиксируем и обновляем отдельными изменениями.
