# План перехода на Next.js, CSS Modules, RTK Query и react-hook-form

Решение: [ADR 0009](adr/0009-nextjs-css-modules-rtk-query.md). Образец и подробности каждой фазы: `docs/nextjs-migration.md` в rbt-web, он этот путь уже прошёл. Здесь порядок работ и отметки о готовности.

Принципы те же, что у rbt-web: оси меняются по отдельности; после каждого шага приложение работает и `make check` зелёный; вёрстка сверяется `make style-check` с эталоном; общие файлы (`tokens.css`, конфиги, `shared/api`) правятся последовательно до раздачи задач субагентам, каждый субагент отвечает за свой набор папок.

## Фаза 0. Подготовка

- [x] ADR 0009, статусы старых ADR, AGENTS.md без запрета Next.js.
- [x] `make style-check` перенесён из rbt-web, пути под наши адреса (без слэша на конце: `/some-unknown-page@404`).
- [x] Эталон: тег `style-baseline` (раздел «Эталон»).

## Фаза 1. CSS Modules и react-hook-form на текущем стеке (в `main`)

- [ ] 1.1. Основа стилей: токены на `:root`, `@custom-media` через PostCSS, каскадные слои `base, components, slices`, глобальные классы из `@utility`. `Container` переведён на модуль как образец, `style-check` без отличий.
- [ ] 1.2. `shared/ui` по группам (раскладка и текст; кнопки и ссылки; поля и формы; оверлеи; медиа и товар).
- [ ] 1.3. `entities`, `features`, `widgets`, `pages`, `app/layouts`.
- [ ] 1.4. Формы на react-hook-form и `zodResolver`: вход, регистрация, сброс пароля, смена пароля, вызов мастера.
- [ ] 1.5. Удалить Tailwind, `@tailwindcss/vite`, `tailwind-merge`; `cn()` становится `clsx`.

## Фаза 2. Next.js App Router (своя ветка)

- [ ] ADR о менеджере пакетов и рантайме (Bun или pnpm с Node 24) и об именах файлов (kebab-case, папка на компонент).
- [ ] Маршруты в корневой `app/`, пустая `pages/` с README, лайауты в `src/app/layouts`.
- [ ] Шторки без `staticData` (замена [0006](adr/0006-sheets-via-static-data.md)), защита `_authed`/`_guest` без `beforeLoad`.
- [ ] Сессия: тела `createServerFn` переезжают в Route Handlers.
- [ ] Удалить TanStack Start, TanStack Router, Nitro.

## Фаза 3. RTK Query (своя ветка от `main`)

- [ ] Стор на запрос, `Hydrate` по сегментам, эндпоинты в `entities/<entity>/api.ts`.
- [ ] Удалить TanStack Query.

## Эталон

Локальный тег `style-baseline` — последний коммит фазы 0, вёрстка до CSS Modules. Две копии этой сборки сравниваются без отличий (25 страниц×ширин, 2878 элементов), то есть шума в снимке нет и любое отличие означает изменение вёрстки.

Поднять эталон и сравнить с текущей сборкой:

```bash
git worktree add ../rbt-service-web-ref style-baseline
cd ../rbt-service-web-ref && bun install && make build && PORT=3210 node --env-file-if-exists=.env .output/server/index.mjs
# в основном каталоге: make build && PORT=3200 node --env-file-if-exists=.env .output/server/index.mjs
make style-check REF=http://localhost:3210 TARGET=http://localhost:3200
```

`.env` в worktree не попадает: скопируй его из основного каталога. Сравнивай прод-сборки, не dev. Анимации в снимке выключены эмуляцией `prefers-reduced-motion: reduce`, поэтому любая анимация должна её уважать (`motion-safe:` в Tailwind, `@media (prefers-reduced-motion: no-preference)` в модулях), иначе она даёт шум в отчёте.
