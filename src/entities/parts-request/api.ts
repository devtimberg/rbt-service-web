import { api } from '@/shared/api'

export type CreatePartsRequestArg = {
  email: string
  partNumber?: string | undefined
  phone: string
  comment?: string | undefined
}

export type PartsRequest = { number: string; createdAt: string }

const digits = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')

export const partsRequestApi = api.injectEndpoints({
  endpoints: (build) => ({
    createPartsRequest: build.mutation<PartsRequest, CreatePartsRequestArg>({
      // shortcut: заглушка без сети, заменить на apiFetch (ошибки ApiError в сериализуемый объект), когда появится API
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
          try {
            // Только для ручной проверки ошибки без переключателей в пользовательском интерфейсе.
            if (sessionStorage.getItem('rbt:parts-request:mock-error') === '1') {
              return { error: { status: 503, message: 'Тестовая ошибка отправки' } }
            }
          } catch {
            // Недоступное хранилище не мешает работе заглушки.
          }
        }
        return { data: { number: `${digits()}-${digits()}`, createdAt: new Date().toISOString() } }
      },
    }),
  }),
})
