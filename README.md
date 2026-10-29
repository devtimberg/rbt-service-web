# rbt-service-web

Мобильный веб-сервис ООО ТТЦ «Рембыттехника». Стек: Next.js (App Router, SSR), React 19, TypeScript, CSS Modules, RTK Query, Vite+ (`vp`: Oxlint, Oxfmt, тесты), Vitest. Правила для разработки: [AGENTS.md](AGENTS.md), решения: [docs/adr](docs/adr/README.md).

## Требования

- Node 24 ([.nvmrc](.nvmrc), в Docker-образе тоже 24)
- pnpm 10 (`packageManager`, ставится через `corepack enable pnpm`), [ADR 0011](docs/adr/0011-pnpm-node-24.md)

## Установка и запуск

```bash
make install
cp .env.example .env   # заполнить значения
make dev               # http://localhost:3001 (next dev)
```

## Переменные окружения

Серверные, в браузер не попадают.

| Переменная         | Назначение                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_INTERNAL_URL` | адрес API rbt-service-api для SSR-запросов                                                                                                                        |

## Команды

`make help` показывает все цели. Основные:

| Команда                                  | Что делает                                         |
| ---------------------------------------- | -------------------------------------------------- |
| `make dev` / `make build` / `make start` | `next dev`, `next build` (standalone), `node .next/standalone/server.js` |
| `make typecheck`                         | типы CSS Modules и маршрутов Next, `tsc --noEmit`  |
| `make lint` / `make format`              | `vp check` (Oxlint, Oxfmt) / `vp check --fix`      |
| `make lint-fsd`                          | проверка слоёв FSD (steiger)                       |
| `make test` / `make test-watch`          | юнит-тесты (`vp test run`) / watch-режим           |
| `make check`                             | typecheck, lint и lint-fsd, без тестов             |
| `make ci`                                | `make check` и `make test`, как в CI               |
| `make hooks`                             | поставить git-хуки (обычно ставятся при `install`) |
| `make icons`                             | пересборка SVGR-иконок                             |

## Git-хуки

Хуки Vite+ лежат в [.vite-hooks](.vite-hooks) и ставятся при `pnpm install` (скрипт `prepare`: `vp config`), вручную: `make hooks`. `pre-commit` запускает `vp staged` (`vp check --fix` по изменённым файлам и steiger, блок `staged` в [vite.config.ts](vite.config.ts)), `commit-msg` проверяет формат Conventional Commits ([scripts/check-commit-msg.ts](scripts/check-commit-msg.ts)). Хуки не обходим (`--no-verify`). Markdown и YAML не форматируются.

## Docker

```bash
make docker-build      # образ rbt-service-web:local
make docker-run        # контейнер на порту 3001 с env из .env
make docker-stop
```
