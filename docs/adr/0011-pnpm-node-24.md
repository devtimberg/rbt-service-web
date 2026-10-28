# 0011. pnpm вместо Bun, Node 24 LTS

Дата: 2026-10-29
Статус: accepted
Частично заменяет: [0002](0002-vite-plus.md) (строка про `overrides` в `package.json`; пакеты и рантайм)

## Контекст

Проект ставил пакеты и запускал скрипты через Bun, прод работал на Node 22. Это два рантайма в одном проекте, а rbt-web уже ушёл с Bun ([ADR 0021 rbt-web](../../../rbt-web/docs/adr/0021-pnpm-node-24.md)): сборка под Bun считала `undici` встроенным модулем и ломала прод, Nitro без явного пресета выбирал `bun`. Разница в скорости установки (секунды) несущественна. Node 22 выходит из поддержки 2027-04-30, Node 24 LTS поддерживается до апреля 2028. Открытый вопрос из [0009](0009-nextjs-css-modules-rtk-query.md): владелец решил «как в rbt-web».

## Решение

Принимаем ADR 0021 rbt-web:

- Менеджер пакетов и раннер скриптов **pnpm** (версия в `packageManager`, ставится через corepack), lock-файл `pnpm-lock.yaml`. Настройки (`overrides` для алиаса `vite` на Vite+, `peerDependencyRules`, `onlyBuiltDependencies` вместо `trustedDependencies`) лежат в `pnpm-workspace.yaml`.
- Рантайм везде **Node 24 LTS** (`.nvmrc`, `engines`, образы `node:24-slim` и `node:24-alpine`). TypeScript-скрипты (`scripts/`, хук `commit-msg`) запускаются напрямую через `node` (type stripping).
- Bun из проекта убирается.

## Последствия

- Один рантайм для разработки, сборки и прода.
- Строгая структура `node_modules` pnpm не поднимает транзитивные пакеты наверх: использовать можно только объявленные зависимости.
- Dockerfile без образа bun, но с `corepack enable pnpm`; CI ставит pnpm через `pnpm/action-setup` (версия из `packageManager`).
- Эталон `style-baseline` (тег до этого ADR) всё ещё с `bun.lock`: его worktree ставится через `bun install`.
- Версии Node и pnpm обновляются отдельным изменением вместе с образом.
