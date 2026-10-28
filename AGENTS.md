# AGENTS.md

Инструкции для ИИ-агентов, работающих с репозиторием. Обоснования решений: [docs/adr](docs/adr/README.md), запуск: [README.md](README.md). Здесь только правила, которые нужны в каждой сессии.

## Проект

Мобильный веб-сервис ООО ТТЦ «Рембыттехника» (ремонт бытовой техники, каталог запчастей). TanStack Start (SSR) на React 19, TypeScript, CSS Modules, TanStack Query, тулчейн Vite+ (`vp`). Весь текст интерфейса и комментарии по-русски. Пакеты через pnpm, прод на Node 24 ([ADR 0011](docs/adr/0011-pnpm-node-24.md), сборка Nitro в `.output`).
Проект был мигрирован с Next.js 16 ([ADR 0001](docs/adr/0001-tanstack-start.md)) и служит пилотом Vite+ для rbt-web ([ADR 0002](docs/adr/0002-vite-plus.md)).

## Переход на Next.js ([ADR 0009](docs/adr/0009-nextjs-css-modules-rtk-query.md), [план](docs/nextjs-migration.md))

Идём вслед за rbt-web: Next.js App Router, CSS Modules вместо Tailwind, react-hook-form, RTK Query. Фазы по очереди, после каждой `make check` зелёный: 0 — подготовка, 1 — CSS Modules и формы в `main` на текущем стеке (закрыта: Tailwind удалён, авторизация убрана), 2 — Next своей веткой, 3 — RTK Query своей веткой. Пока фаза не закрыта, правила остальных разделов этого файла действуют как написано. Изменения вёрстки, которые не должны менять вид, сверяй `make style-check` с эталоном из плана. Отметки о готовности фаз ставь в плане.

## Команды

Всё через Makefile (`make help`), он только оборачивает скрипты `package.json`.

```bash
make install     # pnpm install --frozen-lockfile
cp .env.example .env   # один раз; нужен API_INTERNAL_URL
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
make hooks       # поставить git-хуки (vp hooks enable); обычно они ставятся сами при pnpm install (prepare: vp config)
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
- В `shared` слайсов нет, только сегменты `api`, `config`, `lib`, `ui`; `shared/ui` это папка на компонент (`shared/ui/button/{button.tsx, button.module.css, button.test.tsx, index.ts}`) и один общий `index.ts`; снаружи импорт только `import { Button } from '@/shared/ui'` (пути `@/shared/ui/<x>` запрещает линт), внутри кита относительные `../button`, а `@/shared/ui` внутри `shared/ui` запрещён (циклы). Новый примитив: папка, `index.ts` в ней и строка в `shared/ui/index.ts` ([ADR 0012](docs/adr/0012-kebab-case-filenames-ui-folders.md)).
- Имена файлов и папок в `src/` строчные через дефис (`product-card.tsx`, `use-cart-store.ts`, `button.module.css`), имена экспортов не меняются (`ProductCard`). Исключения: `src/routes/**` (имя файла там URL) и `src/routeTree.gen.ts`. Проверяет `unicorn/filename-case` в [vite.config.ts](vite.config.ts). На macOS переименование только по регистру делай через `git mv` с промежуточным именем.
- Слайсы можно группировать (`features/<группа>/<слайс>`): в группе нет `index.ts` и общего кода.
- Контроль: правила слоёв inline в блоке `lint` [vite.config.ts](vite.config.ts) (Oxlint `no-restricted-imports`, шаблоны собираются из списка слоёв; новый сегмент слайса добавляй в `sliceSegments` там же) и steiger ([steiger.config.ts](steiger.config.ts)). Оба гоняет `make check`, steiger ещё и pre-commit.

Что куда:

| Что                                                                      | Куда                                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Маршруты (файловый роутинг TanStack), `head`, `staticData`, `beforeLoad` | `src/routes/` (без вёрстки)                                                      |
| Лайауты (корень, шторка)                                                 | `src/app/layouts/`                                                               |
| Страница и её уникальные блоки                                           | `src/pages/<page>/` (`ui/`, `model.ts`)                                          |
| Блок на нескольких страницах                                             | `src/widgets/` (header, footer, mobile-bottom-nav, product-card, catalog-search) |
| Действие пользователя                                                    | `src/features/` (search-products)                                                 |
| Сущность                                                                 | `src/entities/` (cart, category, favorite, product)                              |
| UI-кит, API-клиент, конфиг, утилиты, маршруты-константы                  | `src/shared/`                                                                    |

Адреса берём из `ROUTES` в `src/shared/config/routes.ts`, строки путей руками не пишем.

## Состояние

| Что                                | Где                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Данные сервера                     | TanStack Query                                                         |
| Фильтры, поиск, страница           | search-параметры URL, валидация zod                                    |
| Локальный UI                       | `useState`                                                             |
| Корзина, избранное, история поиска | zustand, **временно** ([ADR 0007](docs/adr/0007-zustand-temporary.md)) |

Новые глобальные сторы не заводим. Zustand живёт только в `entities/cart`, `entities/favorite`, `features/search-products` до появления API.

## Авторизация

В MVP авторизации нет ([ADR 0010](docs/adr/0010-no-auth-in-mvp.md)): ни входа, ни сессии, ни защищённых маршрутов. Не добавляй её без нового ADR.

## Вёрстка

- Только CSS Modules, Tailwind удалён (фаза 1.5, [план](docs/nextjs-migration.md)); `cn()` — это `clsx`. Образец: [container.module.css](src/shared/ui/container/container.module.css). Соглашения:
  - файл `<Component>.module.css` рядом с `<Component>.tsx`, импорт `import styles from './<Component>.module.css'`, классы в camelCase (`styles.root`), склейка с внешним `className` через `cn()`;
  - типы классов генерирует happy-css-modules в `.css-types/` (в git нет; `make dev`, `make typecheck`, `make lint` и pre-commit запускают генерацию сами, вручную `make css-types`). Обходы вроде `?? ''` не нужны; в тестах `expect(el).toHaveClass(styles.root)`, имена классов не сравниваем;
  - модули `shared/ui` кладут правила в `@layer components { ... }`, модули слоёв выше (`app`, `pages`, `widgets`, `features`, `entities`) в `@layer slices { ... }`: так класс слайса, переданный примитиву, перебивает его стиль. Порядок слоёв `base, components, slices` объявлен в начале [global.css](src/app/styles/global.css). Модули локализуют и id: `:has(#id)` пиши как `:global(#id)`;
  - все правила модуля внутри слоя. Класс слайса, переданный примитиву, перебивает и медиазапрос примитива: если нужно сохранить его поведение на части ширин, ограничь своё правило брейкпоинтом;
  - `line-height` пиши в rem (`1.25rem`), не делением `calc(1.25 / 0.875)`: Chrome считает деление с погрешностью и сдвигает раскладку на доли пикселя;
  - значения из токенов через `var(--color-primary-500)` ([tokens.css](src/shared/ui/tokens.css), обычный `:root`); значения без токена — литералом, ссылка на неопределённую переменную — ошибка;
  - брейкпоинты `@media (--md) { ... }` (`--xs`, `--sm`, `--md`, `--lg`, `--xl`, `--2xl` из [media.css](src/shared/ui/media.css), вложенно в правило; работают и в глобальных стилях (их подставляет `@csstools/postcss-global-data`).
  - глобальные стили: [reset.css](src/app/styles/reset.css) (свой сброс по образцу preflight) и [global.css](src/app/styles/global.css); `global.css` подключается в `routes/__root.tsx` первым и задаёт порядок слоёв, модули идут после него. В фазе 2 корневой лайаут Next обязан импортировать его раньше модулей. Токены цветов и размеров: [src/shared/ui/tokens.css](src/shared/ui/tokens.css), используем их, а не произвольные значения.
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
| `svg` | иконки из `@/shared/ui` (`XxxIcon`) |
| `hr` | `Divider` |
| `a` | `SmartLink` |
| `button` | `Button` (`variant="unstyled"` для голой), `IconButton`, `Chip` |
| `input` | `TextField`/`OtpField` (с подписью), `TextInput`, `Input` (голое поле), `Checkbox`, `RadioGroup` |
| `form` | `Form` |
| `label`, `fieldset`, `legend`, `output` | `Label`, `Fieldset`, `Legend`, `Output` из `Field` |
| `dialog` | `Dialog`, `Sheet` |

  Нужного примитива нет: добавь его в `shared/ui` (и в витрину), не верстай на месте. Витрина всех примитивов: `/_dev/ui` (`src/routes/[_]dev/ui.tsx`).
- Внутренние ссылки через `SmartLink` ([src/shared/ui/smart-link/smart-link.tsx](src/shared/ui/smart-link/smart-link.tsx)); голый `<a href="/...">` для внутренних адресов не используем.
- Шторки: маршрут с `staticData: { sheet: true }` рендерится в `app/layouts/SheetLayout` ([ADR 0006](docs/adr/0006-sheets-via-static-data.md)).
- Иконки: SVG в `src/shared/ui/icons/raw`, затем `make icons`; сгенерированные файлы руками не правим.

## Формы

Формы на react-hook-form + `zodResolver` из `@hookform/resolvers` ([ADR 0009](docs/adr/0009-nextjs-css-modules-rtk-query.md), фаза 1.4). Схема и тексты ошибок в `model` фичи или `entities/session` (как `loginSchema`), с unit-тестом. Примитивы `shared/ui` не импортируют react-hook-form. Соглашения (как в rbt-web):
- поля с `ref` и `name` (`TextField`, `TextInput`, `Input`, `Checkbox`) через `{...register('x')}`, контролируемые (`OtpField`, `RadioGroup`) через `Controller`;
- `<Form noValidate onSubmit={handleSubmit(onValid)}>`: проверяет схема, не браузер;
- ошибка сервера по полю кладётся через `setError('x', { type: 'server', message })` в `onSuccess`/`onError` мутации; общая ошибка формы (`FormAlert`) по-прежнему из результата мутации (`resultMessage`);
- правка поля убирает его ошибку (клиентскую и серверную): режим по умолчанию (`mode: 'onSubmit'`, `reValidateMode: 'onChange'`) это даёт, своих `useState` для значений и ошибок не заводим;
- многошаговые формы (регистрация, сброс пароля): форма на шаг, значения прошлых шагов передаются пропсами, как сейчас.

## Тесты

Vitest через `vp test run` (jsdom) + Testing Library, конфиг в отдельном [vitest.config.ts](vitest.config.ts) (тестам не нужны плагины Start/Nitro), `vitest.setup.ts`. API тестов импортируем из `vite-plus/test` (не из `vitest`), иначе `vite-plus/prefer-vite-plus-imports` ругнётся. Матчер `toHaveTextContent` с RegExp не используем (конфликт типов): `expect(el.textContent).toMatch(/.../)`. Тесты лежат рядом с кодом: `*.test.ts(x)`; серверные модули с `// @vitest-environment node`. Логику без React (модели, ошибки) покрывай unit-тестом, поведение UI компонентным. DOM-снапшоты не делаем. Тестовый env (`API_INTERNAL_URL`) задан в `vitest.config.ts`.

## Коммиты

Conventional Commits, описание по-русски: `<тип>(<область>)?!?: <описание>`. Типы: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`; область `[a-z0-9-]`; описание до 100 символов. Хуки лежат в [.vite-hooks](.vite-hooks) (ставит `prepare`: `vp config`, вручную `make hooks`): `commit-msg` запускает [scripts/check-commit-msg.ts](scripts/check-commit-msg.ts), `pre-commit` запускает `vp staged` (блок `staged` в [vite.config.ts](vite.config.ts): `vp check --fix` и steiger). Хуки не обходи (`--no-verify`): упало, значит чини.
Не делай `git commit` и `git push`, пока об этом не попросили.

## Запрещено

- Next.js разрешён как цель перехода ([0009](docs/adr/0009-nextjs-css-modules-rtk-query.md)), но код на нём появляется только в фазе 2.
- shadcn/ui, Radix, любые headless-библиотеки, `class-variance-authority` ([0005](docs/adr/0005-own-ui-primitives.md)).
- Глобальный стор, кроме временных zustand-сторов из [0007](docs/adr/0007-zustand-temporary.md).
- Ручная правка `src/routeTree.gen.ts` и сгенерированных файлов.
- Импорт в обход `index.ts` слайса и между слайсами одного слоя.
- Возврат к ESLint, Prettier, Biome и lefthook мимо ADR ([0002](docs/adr/0002-vite-plus.md)).
- Голые HTML-элементы вне `src/shared/ui` и `*.test.tsx`, `--no-verify`, отключение `react/forbid-elements` точечными комментариями ([0008](docs/adr/0008-no-bare-html-elements.md)).

Новое архитектурное решение оформляй ADR: скопируй [docs/adr/template.md](docs/adr/template.md) в `docs/adr/NNNN-название.md` и добавь строку в [docs/adr/README.md](docs/adr/README.md). Принятое решение не удаляй, а помечай `superseded`.
