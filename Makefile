# Makefile для rbt-service-web (TanStack Start, Vite+, Bun, Node 22 в проде).
# Файл только оборачивает скрипты bun (package.json) и команды docker, своей логики не содержит.
# `make help` (цель по умолчанию) показывает все цели с описаниями.

SHELL := /bin/bash
.DEFAULT_GOAL := help

PORT  ?= 3000
IMAGE ?= rbt-service-web:local
CONTAINER ?= rbt-service-web

.PHONY: help install dev build start \
	typecheck check lint lint-fsd fmt fmt-check test test-watch ci icons \
	docker-build docker-run docker-stop clean hooks

help: ## Показать этот список целей
	@awk 'BEGIN {FS = ":.*?## "; printf "Использование: make \033[36m<цель>\033[0m\n"} \
		/^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)}' $(MAKEFILE_LIST)

##@ Разработка

install: ## Установить зависимости (bun install --frozen-lockfile)
	bun install --frozen-lockfile

dev: ## Dev-сервер, доступен в локальной сети (vp dev --host)
	bunx vp dev --host 0.0.0.0

build: ## Собрать прод-сборку (vp build)
	bun run build

start: ## Запустить прод-сборку локально (нужен предварительный make build)
	PORT=$(PORT) bun run start

icons: ## Пересобрать SVGR-иконки из src/shared/ui/icons/raw
	bun run icons:sync

##@ Качество

typecheck: ## Проверка типов (tsc --noEmit)
	bun run typecheck

check: ## Формат + линт Oxlint/Oxfmt (vp check)
	bun run check

lint: ## Линтер (vp lint)
	bun run lint

lint-fsd: ## Проверка архитектуры FSD (steiger)
	bun run lint:fsd

fmt: ## Автоформатирование (vp fmt)
	bun run fmt

fmt-check: ## Проверка форматирования без правок (vp fmt --check)
	bun run fmt:check

test: ## Юнит-тесты (vp test)
	bun run test

test-watch: ## Юнит-тесты в watch-режиме
	bun run test:watch

ci: typecheck check lint-fsd test ## То, что гоняет CI на PR

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

hooks: ## Установить git-хуки (lefthook install)
	bunx lefthook install
