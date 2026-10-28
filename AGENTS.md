# AGENTS.md

Инструкции для ИИ-агентов, работающих с репозиторием. Обоснования решений: [docs/adr](docs/adr/README.md), запуск: [README.md](README.md). Здесь только правила, которые нужны в каждой сессии.

## Проект

Мобильный веб-сервис ООО ТТЦ «Рембыттехника» (ремонт бытовой техники, каталог запчастей). TanStack Start (SSR) на React 19, TypeScript, Tailwind 4, TanStack Query, тулчейн Vite+ (`vp`). Весь текст интерфейса и комментарии по-русски. Пакеты через Bun 1.3, прод на Node 22 (сборка Nitro в `.output`).
Проект был мигрирован с Next.js 16 ([ADR 0001](docs/adr/0001-tanstack-start.md)) и служит пилотом Vite+ для rbt-web ([ADR 0002](docs/adr/0002-vite-plus.md)).

## Переход на Next.js ([ADR 0009](docs/adr/0009-nextjs-css-modules-rtk-query.md), [план](docs/nextjs-migration.md))

Идём вслед за rbt-web: Next.js App Router, CSS Modules вместо Tailwind, react-hook-form, RTK Query. Фазы по очереди, после каждой `make check` зелёный: 0 — подготовка, 1 — CSS Modules и формы в `main` на текущем стеке, 2 — Next своей веткой, 3 — RTK Query своей веткой. Пока фаза не закрыта, правила остальных разделов этого файла действуют как написано. Изменения вёрстки, которые не должны менять вид, сверяй `make style-check` с эталоном из плана. Отметки о готовности фаз ставь в плане.

## Команды

Всё через Makefile (`make help`), он только оборачивает скрипты `package.json`.

```bash
make install     # bun install --frozen-lockfile
cp .env.example .env   # один раз; нужны API_INTERNAL_URL и SESSION_SECRET (>= 32 символов), опционально TRUST_PROXY (по умолчанию false)
make dev         # vp dev, порт 3000
make build       # vp build (Nitro, .output)
make start       # запуск прод-сборки
make typecheck   # tsc --noEmit
make lint        # vp check: Oxfmt + Oxlint (type-aware, правила слоёв и forbid-elements)
make format      # vp check --fix (Oxfmt + автофиксы Oxlint)
make lint-fsd    # steiger ./src
make test        # vp test run (Vitest, vitest.config.ts)
make test-watch  # Vitest в watch-режиме
make check       # typecheck + lint + lint-fsd + test (то, что гоняет CI)
make hooks       # поставить git-хуки (vp hooks enable); обычно они ставятся сами при bun install (prepare: vp config)
make icons       # пересобрать SVGR-иконки из src/shared/ui/icons/raw
make style-check REF=<url> TARGET=<url> [PATHS="/ /cart"]  # сравнить вёрстку двух запущенных сборок (Playwright, отчёт в .style-check/)
make docker-build / docker-run / docker-stop
```

**Перед завершением задачи запусти `make check`** и исправь всё, что он нашёл.

## Архитектура

Упрощённый Feature-Sliced Design ([ADR 0003](docs/adr/0003-fsd-and-imports.md)). Импорт только вниз:

```
routes → app → pages → widgets → features → entities → shared
```

- Слайсы одного слоя друг друга не импортируют.
- У слайса есть `index.ts`; снаружи импортируем только через него (`@/entities/product`). Пути через сегменты `ui|model|api|lib|config` запрещены. Внутри слайса импорты относительные, между слайсами через `@/` (алиас на `src/`).
- В `shared` слайсов нет, только сегменты `api`, `config`, `lib`, `ui`; `shared/ui` импортируется по модулю: `@/shared/ui/Button`.
- Слайсы можно группировать (`features/auth/login`): в группе нет `index.ts` и общего кода.
- Контроль: правила слоёв inline в блоке `lint` [vite.config.ts](vite.config.ts) (Oxlint `no-restricted-imports`, шаблоны собираются из списка слоёв; новый сегмент слайса добавляй в `sliceSegments` там же) и steiger ([steiger.config.ts](steiger.config.ts)). Оба гоняет `make check`, steiger ещё и pre-commit.

Что куда:

| Что                                                                      | Куда                                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Маршруты (файловый роутинг TanStack), `head`, `staticData`, `beforeLoad` | `src/routes/` (без вёрстки)                                                      |
| Лайауты (корень, шторка)                                                 | `src/app/layouts/`                                                               |
| Страница и её уникальные блоки                                           | `src/pages/<page>/` (`ui/`, `model.ts`)                                          |
| Блок на нескольких страницах                                             | `src/widgets/` (header, footer, mobile-bottom-nav, product-card, catalog-search) |
| Действие пользователя                                                    | `src/features/` (auth/login, signup, logout, password-reset, search-products)    |
| Сущность                                                                 | `src/entities/` (cart, category, favorite, product, session)                     |
| UI-кит, API-клиент, конфиг, утилиты, маршруты-константы                  | `src/shared/`                                                                    |

Адреса берём из `ROUTES` в `src/shared/config/routes.ts`, строки путей руками не пишем.

## Состояние

| Что                                | Где                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Данные сервера                     | TanStack Query                                                         |
| Сессия пользователя                | cookie, чтение через `sessionQuery` (`entities/session`)               |
| Фильтры, поиск, страница           | search-параметры URL, валидация zod                                    |
| Локальный UI                       | `useState`                                                             |
| Корзина, избранное, история поиска | zustand, **временно** ([ADR 0007](docs/adr/0007-zustand-temporary.md)) |

Новые глобальные сторы не заводим. Zustand живёт только в `entities/cart`, `entities/favorite`, `features/search-products` до появления API.

## Авторизация

Cookie-сессия, AES-256-GCM, ключ из `SESSION_SECRET` ([ADR 0004](docs/adr/0004-cookie-session.md)).

- Серверный код лежит в `src/entities/session/api/*.server.ts` и вызывается только из тел `createServerFn` (`auth.functions.ts`). Файлы `*.server.ts` не реэкспортируем из `index.ts`, иначе они попадут в клиентский бандл.
- Защита маршрутов: `_authed` (только вошедшие) и `_guest` (только гости) в `beforeLoad`; гостя отправляем на вход через `redirect` с `?redirect=` (не `callbackUrl`).
- Токены никогда не отдаём в браузер: клиент получает только публичные данные пользователя.

## Вёрстка

- Tailwind 4 и CSS Modules (идёт перевод на модули, [план](docs/nextjs-migration.md)). Новые Tailwind-утилиты не добавляй; существующий компонент переводи на модуль целиком. Образец: [Container.module.css](src/shared/ui/Container.module.css). Соглашения:
  - файл `<Component>.module.css` рядом с `<Component>.tsx`, импорт `import styles from './<Component>.module.css'`, классы в camelCase (`styles.root`), склейка с внешним `className` через `cn()`;
  - типы классов генерирует happy-css-modules в `.css-types/` (в git нет; `make dev`, `make typecheck`, `make lint` и pre-commit запускают генерацию сами, вручную `make css-types`). Обходы вроде `?? ''` не нужны; в тестах `expect(el).toHaveClass(styles.root)`, имена классов не сравниваем;
  - модули `shared/ui` кладут правила в `@layer components { ... }`, модули слоёв выше (`app`, `pages`, `widgets`, `features`, `entities`) в `@layer slices { ... }`: так класс слайса, переданный примитиву, перебивает его стиль. Порядок слоёв объявлен в начале `src/styles.css`. Модули локализуют и id: `:has(#id)` пиши как `:global(#id)`;
  - все правила модуля внутри слоя: так Tailwind-класс, переданный снаружи, перебивает модуль. Внешний класс без брейкпоинта перебьёт и медиазапрос модуля (раньше `tailwind-merge` их не склеивал), поэтому внешние `px-*`/`max-w-*` у вызова пиши с границей (`max-md:px-4`);
  - значения из токенов через `var(--color-primary-500)` ([tokens.css](src/shared/ui/tokens.css), `@theme static`: всё лежит в `:root`);
  - брейкпоинты `@media (--md) { ... }` (`--xs`, `--sm`, `--md`, `--lg`, `--xl`, `--2xl` из [media.css](src/shared/ui/media.css), значения как в `--breakpoint-*`), вложенно в правило; в `src/styles.css` `@custom-media` не работает (его компилирует Tailwind).
  - `src/styles.css` подключается в `routes/__root.tsx` первым и задаёт порядок слоёв, модули идут после него. Токены цветов и размеров: [src/shared/ui/tokens.css](src/shared/ui/tokens.css), используем их, а не произвольные значения.
- Свои примитивы в `src/shared/ui` (Button, IconButton, TextInput, Dialog, Sheet, Popover, Tooltip, Checkbox, RadioGroup, Box/Stack, Text, Heading и др.) без Radix, shadcn, cva и headless-библиотек ([ADR 0005](docs/adr/0005-own-ui-primitives.md)). Модалки на нативном `<dialog>`. Нового модала, кнопки или таба не создавай: расширяй существующий (вариант, prop). Условные классы через `cn()`.
- Голые HTML-элементы вне `src/shared/ui` и `*.test.tsx` запрещает линт ([ADR 0008](docs/adr/0008-no-bare-html-elements.md), `react/forbid-elements`, список и подсказки в `forbiddenElements` в [vite.config.ts](vite.config.ts); `html/head/body` в `routes/__root.tsx` разрешены). Примитивы без своих стилей, семантика задаётся через `as`/`level`. Соответствия для этого проекта:

| Элемент | Примитив из `@/shared/ui` |
| --- | --- |
| `div`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav` | `Container`, `Box`, `Stack` (`as` для семантики) |
| `h1`–`h6` | `Heading` (`level`, `size?`) |
| `p`, `span`, `b`, `strong`, `s`, `em`, `small`, `time` | `Text` (`as`) |
| `br` | `LineBreak` |
| `ul`, `ol`, `li` | `List` (`as`), `ListItem` |
| `dl`, `dt`, `dd` | `DescriptionList` |
| `img`, `picture`, `source` | `Image` (`sources`) |
| `svg` | иконки из `@/shared/ui/icons` |
| `hr` | `Divider` |
| `a` | `SmartLink` |
| `button` | `Button` (`variant="unstyled"` для голой), `IconButton`, `Chip` |
| `input` | `TextField`/`OtpField` (с подписью), `TextInput`, `Input` (голое поле), `Checkbox`, `RadioGroup` |
| `form` | `Form` |
| `label`, `fieldset`, `legend`, `output` | `Label`, `Fieldset`, `Legend`, `Output` из `Field` |
| `dialog` | `Dialog`, `Sheet` |

  Нужного примитива нет: добавь его в `shared/ui` (и в витрину), не верстай на месте. Витрина всех примитивов: `/_dev/ui` (`src/routes/[_]dev/ui.tsx`).
- Внутренние ссылки через `SmartLink` ([src/shared/ui/SmartLink.tsx](src/shared/ui/SmartLink.tsx)); голый `<a href="/...">` для внутренних адресов не используем.
- Шторки: маршрут с `staticData: { sheet: true }` рендерится в `app/layouts/SheetLayout` ([ADR 0006](docs/adr/0006-sheets-via-static-data.md)).
- Иконки: SVG в `src/shared/ui/icons/raw`, затем `make icons`; сгенерированные файлы руками не правим.

## Тесты

Vitest через `vp test run` (jsdom) + Testing Library, конфиг в отдельном [vitest.config.ts](vitest.config.ts) (тестам не нужны плагины Start/Nitro/Tailwind), `vitest.setup.ts`. API тестов импортируем из `vite-plus/test` (не из `vitest`), иначе `vite-plus/prefer-vite-plus-imports` ругнётся. Матчер `toHaveTextContent` с RegExp не используем (конфликт типов): `expect(el.textContent).toMatch(/.../)`. Тесты лежат рядом с кодом: `*.test.ts(x)`; серверные модули с `// @vitest-environment node`. Логику без React (модели, ошибки, шифрование сессии) покрывай unit-тестом, поведение UI компонентным. DOM-снапшоты не делаем. Тестовые env (`API_INTERNAL_URL`, `SESSION_SECRET`) заданы в `vitest.config.ts`.

## Коммиты

Conventional Commits, описание по-русски: `<тип>(<область>)?!?: <описание>`. Типы: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`; область `[a-z0-9-]`; описание до 100 символов. Хуки лежат в [.vite-hooks](.vite-hooks) (ставит `prepare`: `vp config`, вручную `make hooks`): `commit-msg` запускает [scripts/check-commit-msg.ts](scripts/check-commit-msg.ts), `pre-commit` запускает `vp staged` (блок `staged` в [vite.config.ts](vite.config.ts): `vp check --fix` и steiger). Хуки не обходи (`--no-verify`): упало, значит чини.
Не делай `git commit` и `git push`, пока об этом не попросили.

## Запрещено

- next-auth ([0004](docs/adr/0004-cookie-session.md)). Next.js разрешён как цель перехода ([0009](docs/adr/0009-nextjs-css-modules-rtk-query.md)), но код на нём появляется только в фазе 2.
- shadcn/ui, Radix, любые headless-библиотеки, `class-variance-authority` ([0005](docs/adr/0005-own-ui-primitives.md)).
- Глобальный стор, кроме временных zustand-сторов из [0007](docs/adr/0007-zustand-temporary.md).
- Ручная правка `src/routeTree.gen.ts` и сгенерированных файлов.
- Импорт в обход `index.ts` слайса и между слайсами одного слоя.
- Реэкспорт `*.server.ts` и токенов сессии в клиентский код.
- Возврат к ESLint, Prettier, Biome и lefthook мимо ADR ([0002](docs/adr/0002-vite-plus.md)).
- Голые HTML-элементы вне `src/shared/ui` и `*.test.tsx`, `--no-verify`, отключение `react/forbid-elements` точечными комментариями ([0008](docs/adr/0008-no-bare-html-elements.md)).

Новое архитектурное решение оформляй ADR: скопируй [docs/adr/template.md](docs/adr/template.md) в `docs/adr/NNNN-название.md` и добавь строку в [docs/adr/README.md](docs/adr/README.md). Принятое решение не удаляй, а помечай `superseded`.
