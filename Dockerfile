FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN bun run next build

FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json /app/bun.lockb* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN bun install --production --frozen-lockfile

EXPOSE 3000
CMD ["bun", "run", "next", "start", "-p", "3000"]
