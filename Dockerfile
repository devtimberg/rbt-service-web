# ---------- STAGE 1: build ----------
FROM oven/bun:1 AS builder

# Рабочая директория
WORKDIR /app

# Кэшируем зависимости
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Копируем исходники
COPY . .

# Переменные окружения для сборки (при необходимости измените)
ENV NODE_ENV=production

# Сборка Next.js
RUN bun run next build

# ---------- STAGE 2: runtime ----------
FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копируем только нужное для рантайма
COPY --from=builder /app/package.json /app/bun.lockb* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
# Если у вас next.config.js/ts — поправьте имя файла

# Ставим только прод‑зависимости
RUN bun install --production --frozen-lockfile

EXPOSE 3000

# Запуск приложения
CMD ["bun", "run", "next", "start", "-p", "3000"]
