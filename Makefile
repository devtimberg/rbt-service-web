# Makefile для rbt-service-web (TanStack Start, Vite+, pnpm, Node 24 в проде).
# Файл только оборачивает скрипты pnpm (package.json) и команды docker, своей логики не содержит.
# `make help` (цель по умолчанию) показывает все цели с описаниями.

SHELL := /bin/bash
.DEFAULT_GOAL := help

PORT  ?= 3000
IMAGE ?= rbt-service-web:local
CONTAINER ?= rbt-service-web

.PHONY: help install dev build start \
	css-types typecheck lint lint-fsd format check test test-watch style-check icons \
	docker-build docker-run docker-stop clean hooks

help: ## Показать этот список целей
	@awk 'BEGIN {FS = ":.*?## "; printf "Использование: make \033[36m<цель>\033[0m\n"} \
		/^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)}' $(MAKEFILE_LIST)

##@ Разработка

install: ## Установить зависимости (pnpm install --frozen-lockfile)
	pnpm install --frozen-lockfile

dev: ## Dev-сервер, доступен в локальной сети (vp dev --host)
	pnpm run dev --host 0.0.0.0

build: ## Собрать прод-сборку (vp build)
	pnpm run build

start: ## Запустить прод-сборку локально (нужен предварительный make build)
	PORT=$(PORT) pnpm run start

icons: ## Пересобрать SVGR-иконки из src/shared/ui/icons/raw
	pnpm run icons:sync

##@ Качество

css-types: ## Типы CSS Modules в .css-types (happy-css-modules); dev, typecheck, lint делают это сами
	pnpm run css:types

typecheck: ## Типы CSS Modules + проверка типов (tsc --noEmit)
	pnpm run typecheck

lint: ## Типы CSS Modules + формат, линт и типы (vp check)
	pnpm run lint

lint-fsd: ## Проверка архитектуры FSD (steiger)
	pnpm run lint:fsd

format: ## Автоформатирование и автофиксы (vp check --fix)
	pnpm run format

check: typecheck lint lint-fsd test ## Typecheck + lint + FSD + test (то, что гоняет CI на PR)

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

docker-run: ## Запустить контейнер на порту PORT (по умолчанию 3000) с env из .env
	docker run --rm -d --name $(CONTAINER) --env-file .env -e PORT=3000 -p $(PORT):3000 $(IMAGE)
	@echo "Запущено: http://localhost:$(PORT)"

docker-stop: ## Остановить контейнер
	-docker stop $(CONTAINER)

##@ Прочее

clean: ## Удалить node_modules, .output, .tanstack, dist
	rm -rf node_modules .output .tanstack dist

hooks: ## Установить git-хуки (vp hooks enable)
	pnpm exec vp hooks enable
