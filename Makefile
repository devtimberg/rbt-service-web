# Makefile для rbt-service-web (Next.js App Router, Vite+ для линта и тестов, pnpm, Node 24 в проде).
# Файл только оборачивает скрипты pnpm (package.json) и команды docker, своей логики не содержит.
# `make help` (цель по умолчанию) показывает все цели с описаниями.

SHELL := /bin/bash
.DEFAULT_GOAL := help

PORT  ?= 3001
IMAGE ?= rbt-service-web:local
CONTAINER ?= rbt-service-web

.PHONY: help install dev build start \
	css-types typecheck lint lint-fsd format check ci test test-watch style-check icons \
	docker-build docker-run docker-stop clean hooks

help: ## Показать этот список целей
	@awk 'BEGIN {FS = ":.*?## "; printf "Использование: make \033[36m<цель>\033[0m\n"} \
		/^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)}' $(MAKEFILE_LIST)

##@ Разработка

install: ## Установить зависимости (pnpm install --frozen-lockfile)
	pnpm install --frozen-lockfile

dev: ## Dev-сервер Next (next dev), доступен в локальной сети, порт PORT (по умолчанию 3001)
	pnpm run dev -H 0.0.0.0 -p $(PORT)

build: ## Собрать прод-сборку (next build, standalone в .next/standalone)
	pnpm run build

start: ## Запустить прод-сборку локально (node .next/standalone/server.js, нужен make build)
	PORT=$(PORT) pnpm run start

icons: ## Пересобрать SVGR-иконки из src/shared/ui/icons/raw
	pnpm run icons:sync

##@ Качество

css-types: ## Типы CSS Modules в .css-types (happy-css-modules); dev, typecheck, lint делают это сами
	pnpm run css:types

typecheck: ## Типы CSS Modules и маршрутов Next (next typegen) + проверка типов (tsc --noEmit)
	pnpm run typecheck

lint: ## Типы CSS Modules и Next + формат, линт и типы (vp check)
	pnpm run lint

lint-fsd: ## Проверка архитектуры FSD (steiger)
	pnpm run lint:fsd

format: ## Автоформатирование и автофиксы (vp check --fix)
	pnpm run format

check: typecheck lint lint-fsd ## Typecheck + lint + FSD, без тестов (после правок)

ci: check test ## check + тесты (перед коммитом и в CI)

test: ## Юнит-тесты (vp test run)
	pnpm run test

test-watch: ## Юнит-тесты в watch-режиме
	pnpm exec vp test

REF ?=
TARGET ?=
PATHS ?=
style-check: ## Сравнить вёрстку двух сборок: make style-check REF=http://localhost:3210 TARGET=http://localhost:3200 [PATHS="/ /cart /x@404"] [ARGS=...]
	@test -n "$(REF)" -a -n "$(TARGET)" || { echo "Нужны REF и TARGET (адреса запущенных сборок)"; exit 2; }
	node scripts/style-check/cli.ts compare --ref $(REF) --target $(TARGET) $(ARGS) $(PATHS)

##@ Docker

docker-build: ## Собрать Docker-образ (по умолчанию rbt-service-web:local)
	docker build -t $(IMAGE) .

docker-run: ## Запустить контейнер на порту PORT (по умолчанию 3001) с env из .env
	docker run --rm -d --name $(CONTAINER) --env-file .env -e PORT=3000 -p $(PORT):3000 $(IMAGE)
	@echo "Запущено: http://localhost:$(PORT)"

docker-stop: ## Остановить контейнер
	-docker stop $(CONTAINER)

##@ Прочее

clean: ## Удалить node_modules, .next, next-env.d.ts, dist
	rm -rf node_modules .next next-env.d.ts dist

hooks: ## Установить git-хуки (vp hooks enable)
	pnpm exec vp hooks enable
