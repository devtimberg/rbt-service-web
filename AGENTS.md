# AGENTS.md

Инструкции для ИИ-агентов, работающих с репозиторием. Обоснования решений: [docs/adr](docs/adr/README.md), запуск: [README.md](README.md). Здесь только правила, которые нужны в каждой сессии.

## Проект

Мобильный веб-сервис ООО ТТЦ «Рембыттехника» (ремонт бытовой техники, каталог запчастей). TanStack Start (SSR) на React 19, TypeScript, Tailwind 4, TanStack Query, тулчейн Vite+ (`vp`). Весь текст интерфейса и комментарии по-русски. Пакеты через Bun 1.3, прод на Node 22 (сборка Nitro в `.output`).
Проект мигрирован с Next.js 16 ([ADR 0001](docs/adr/0001-tanstack-start.md)) и служит пилотом Vite+ для rbt-web ([ADR 0002](docs/adr/0002-vite-plus.md)).

## Команды

Всё через Makefile (`make help`), он только оборачивает скрипты `package.json`.

```bash
make install     # bun install --frozen-lockfile
cp .env.example .env   # один раз; нужны API_INTERNAL_URL и SESSION_SECRET (>= 32 символов)
make dev         # vp dev, порт 3000
make build       # vp build (Nitro, .output)
make start       # запуск прод-сборки
make typecheck   # tsc --noEmit
make check       # vp check: Oxfmt + Oxlint (type-aware)
make fmt         # vp fmt (автоформат)
make lint-fsd    # steiger ./src
make test        # vp test (Vitest)
make ci          # typecheck + check + lint-fsd + test
make icons       # пересобрать SVGR-иконки из src/shared/ui/icons/raw
make docker-build / docker-run / docker-stop
```

**Перед завершением задачи запусти `make ci`** и исправь всё, что он нашёл.

## Архитектура

Упрощённый Feature-Sliced Design ([ADR 0003](docs/adr/0003-fsd-and-imports.md)). Импорт только вниз:

```
routes → app → pages → widgets → features → entities → shared
```

- Слайсы одного слоя друг друга не импортируют.
- У слайса есть `index.ts`; снаружи импортируем только через него (`@/entities/product`). Пути через сегменты `ui|model|api|lib|config` запрещены. Внутри слайса импорты относительные, между слайсами через `@/` (алиас на `src/`).
- В `shared` слайсов нет, только сегменты `api`, `config`, `lib`, `ui`; `shared/ui` импортируется по модулю: `@/shared/ui/Button`.
- Слайсы можно группировать (`features/auth/login`): в группе нет `index.ts` и общего кода.
- Контроль: правила слоёв в [lint/fsd-rules.ts](lint/fsd-rules.ts) (подключены в `vite.config.ts`, Oxlint `no-restricted-imports`; новый сегмент слайса добавляй в шаблон там) и steiger ([steiger.config.ts](steiger.config.ts)). Оба в pre-commit.

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

- Tailwind 4, только классы (без CSS-модулей). Токены цветов и размеров: [src/shared/ui/tokens.css](src/shared/ui/tokens.css), используем их, а не произвольные значения.
- Свои примитивы в `src/shared/ui` (Button, IconButton, Input, Dialog, Sheet, Popover, Tooltip, Checkbox, RadioGroup, HStack/VStack, Text, Heading и др.) без Radix, shadcn, cva и headless-библиотек ([ADR 0005](docs/adr/0005-own-ui-primitives.md)). Модалки на нативном `<dialog>`. Нового модала, кнопки или таба не создавай: расширяй существующий (вариант, prop). Условные классы через `cn()`.
- Внутренние ссылки через `SmartLink` ([src/shared/ui/SmartLink.tsx](src/shared/ui/SmartLink.tsx)); голый `<a href="/...">` для внутренних адресов не используем.
- Шторки: маршрут с `staticData: { sheet: true }` рендерится в `app/layouts/SheetLayout` ([ADR 0006](docs/adr/0006-sheets-via-static-data.md)).
- Иконки: SVG в `src/shared/ui/icons/raw`, затем `make icons`; сгенерированные файлы руками не правим.

## Тесты

Vitest через `vp test` (jsdom) + Testing Library, `vitest.setup.ts`. Тесты лежат рядом с кодом: `*.test.ts(x)`; серверные модули с `// @vitest-environment node`. Логику без React (модели, ошибки, шифрование сессии) покрывай unit-тестом, поведение UI компонентным. DOM-снапшоты не делаем. Тестовые env (`API_INTERNAL_URL`, `SESSION_SECRET`) заданы в `vite.config.ts`.

## Коммиты

Conventional Commits, описание по-русски: `<тип>(<область>)?!?: <описание>`. Типы: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`; область `[a-z0-9-]`; описание до 100 символов. Формат проверяет [scripts/check-commit-msg.ts](scripts/check-commit-msg.ts) через lefthook (`make hooks`). Pre-commit: `vp staged` и `lint:fsd`, не обходи (`--no-verify`).
Не делай `git commit` и `git push`, пока об этом не попросили.

## Запрещено

- Next.js, next-auth и их API ([0001](docs/adr/0001-tanstack-start.md), [0004](docs/adr/0004-cookie-session.md)).
- shadcn/ui, Radix, любые headless-библиотеки, `class-variance-authority` ([0005](docs/adr/0005-own-ui-primitives.md)).
- Глобальный стор, кроме временных zustand-сторов из [0007](docs/adr/0007-zustand-temporary.md).
- Ручная правка `src/routeTree.gen.ts` и сгенерированных файлов.
- Импорт в обход `index.ts` слайса и между слайсами одного слоя.
- Реэкспорт `*.server.ts` и токенов сессии в клиентский код.
- Возврат к ESLint/Prettier/Biome мимо ADR.

Новое архитектурное решение оформляй ADR: скопируй [docs/adr/template.md](docs/adr/template.md) в `docs/adr/NNNN-название.md` и добавь строку в [docs/adr/README.md](docs/adr/README.md). Принятое решение не удаляй, а помечай `superseded`.
