import { z } from 'zod'

// Серверные переменные: читаются в рантайме из process.env, в браузер не попадают.
// Публичных (VITE_*) переменных пока нет: при появлении добавить отдельную схему по образцу rbt-web.
const serverSchema = z.object({
  // Адрес rbt-service-api для SSR-запросов
  API_INTERNAL_URL: z.url({ error: 'API_INTERNAL_URL должен быть абсолютным URL' }),
})

export type ServerEnv = z.infer<typeof serverSchema>

/** Разбор серверного окружения без кэша и побочных эффектов (для тестов и `getServerEnv`). */
export function parseServerEnv(source: Record<string, string | undefined>) {
  return serverSchema.safeParse(source)
}

let serverEnv: ServerEnv | undefined

/** Серверное окружение. Вызывать только при `import.meta.env.SSR`. */
export function getServerEnv(): ServerEnv {
  if (!import.meta.env.SSR) {
    throw new Error('getServerEnv() нельзя вызывать в браузере')
  }
  if (!serverEnv) {
    const parsed = parseServerEnv(process.env)
    if (!parsed.success) {
      const problems = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
      throw new Error(
        `Неверные переменные окружения (${problems}). Скопируйте .env.example в .env и заполните значения.`,
      )
    }
    serverEnv = parsed.data
  }
  return serverEnv
}
