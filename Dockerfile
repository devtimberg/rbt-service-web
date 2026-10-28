# syntax=docker/dockerfile:1

# --- Сборка (Node 24 + pnpm через corepack) ---
FROM node:24-slim AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts: в образе нет git, git-хуки (vp config) не нужны
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
# NEXT_PUBLIC_* вшиваются в бандл при сборке (сейчас таких переменных нет)
ENV NEXT_TELEMETRY_DISABLED=1
# next build (output: 'standalone') + public и .next/static рядом с server.js (скрипт build в package.json)
RUN pnpm run build

# --- Рантайм (Node 24) ---
# Next кладёт в .next/standalone сервер (server.js) и только нужные ему node_modules, поэтому в рантайм
# копируется только он (вместе с public и .next/static, их скопировал скрипт build).
FROM node:24-alpine AS runtime
WORKDIR /app
# HOSTNAME: standalone-сервер слушает этот адрес, а в контейнере переменная по умолчанию равна имени машины
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app/.next/standalone ./
USER node
EXPOSE 3000
# API_INTERNAL_URL передаётся при запуске контейнера.
CMD ["node", "server.js"]
