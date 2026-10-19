# syntax=docker/dockerfile:1

# --- Сборка (bun) ---
FROM oven/bun:1.3 AS build
WORKDIR /app
COPY package.json bun.lock ./
# --ignore-scripts: в образе нет git, git-хуки (vp config) не нужны
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
# VITE_* вшиваются в бандл при сборке (сейчас таких переменных нет)
RUN bun run build

# --- Рантайм (Node 22) ---
# Nitro кладёт в .output/server свои node_modules с нужными прод-зависимостями,
# поэтому в рантайме копируется только .output.
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.output ./.output
USER node
EXPOSE 3000
# API_INTERNAL_URL и SESSION_SECRET передаются при запуске контейнера.
# За реверс-прокси обязательно TRUST_PROXY=true (по умолчанию false): иначе API видит IP прокси у всех и свой лимит
# 20 OTP-писем/час на IP считает на весь сайт. Прокси должен перезаписывать X-Forwarded-For/X-Real-IP,
# приложение и API не должны быть доступны напрямую.
CMD ["node", ".output/server/index.mjs"]
