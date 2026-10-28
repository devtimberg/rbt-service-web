# syntax=docker/dockerfile:1

# --- Сборка (Node 24 + pnpm через corepack) ---
FROM node:24-slim AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts: в образе нет git, git-хуки (vp config) не нужны
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
# VITE_* вшиваются в бандл при сборке (сейчас таких переменных нет)
RUN pnpm run build

# --- Рантайм (Node 24) ---
# Nitro кладёт в .output/server свои node_modules с нужными прод-зависимостями,
# поэтому в рантайме копируется только .output.
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.output ./.output
USER node
EXPOSE 3000
# API_INTERNAL_URL передаётся при запуске контейнера.
CMD ["node", ".output/server/index.mjs"]
