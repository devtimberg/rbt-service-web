# rbt-service-web

Мобильный веб-сервис ООО ТТЦ «Рембыттехника». Стек: TanStack Start (SSR), React 19, TypeScript, Tailwind 4, TanStack Query, Vite+ (`vp`, Oxlint, Oxfmt), Vitest. Правила для разработки: [AGENTS.md](AGENTS.md), решения: [docs/adr](docs/adr/README.md).

## Требования

- Bun 1.3 (`packageManager`: `bun@1.3.10`)
- Node 22 ([.nvmrc](.nvmrc), в Docker-образе тоже 22)

## Установка и запуск

```bash
make install
cp .env.example .env   # заполнить значения
make dev               # http://localhost:3000
```

## Переменные окружения

Серверные, в браузер не попадают.

| Переменная         | Назначение                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_INTERNAL_URL` | адрес API rbt-service-api для SSR-запросов                                                                                                                        |
| `SESSION_SECRET`   | секрет шифрования cookie-сессии, не короче 32 символов (`openssl rand -base64 32`)                                                                                |
| `TRUST_PROXY`      | `true` — доверять `X-Forwarded-For`/`X-Real-IP` при определении IP клиента; по умолчанию `false`. Включать только за прокси, который перезаписывает эти заголовки |

## Команды

`make help` показывает все цели. Основные:

| Команда                                  | Что делает                            |
| ---------------------------------------- | ------------------------------------- |
| `make dev` / `make build` / `make start` | разработка, сборка, запуск сборки     |
| `make typecheck`                         | `tsc --noEmit`                        |
| `make check` / `make fmt`                | Oxlint и Oxfmt: проверка / автоформат |
| `make lint-fsd`                          | проверка слоёв FSD (steiger)          |
| `make test`                              | юнит-тесты                            |
| `make ci`                                | всё вместе, как в CI                  |
| `make icons`                             | пересборка SVGR-иконок                |

## Docker

```bash
make docker-build      # образ rbt-service-web:local
make docker-run        # контейнер на порту 3000 с env из .env
make docker-stop
```
