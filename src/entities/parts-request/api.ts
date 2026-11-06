import { api, toQueryError, type ApiClients } from '@/shared/api'
import { API_ROUTES } from '@/shared/config'
import { partsRequestResponseSchema } from './contract'

export type CreatePartsRequestArg = {
  email: string
  partNumber?: string | undefined
  /** Национальные цифры номера из PhoneField, без +7. */
  phone: string
  comment?: string | undefined
}

/** Дату API пока не возвращает: createdAt — время получения успешного ответа для чека. */
export type PartsRequest = { number: string; createdAt: string }

export const partsRequestApi = api.injectEndpoints({
  endpoints: (build) => ({
    createPartsRequest: build.mutation<PartsRequest, CreatePartsRequestArg>({
      queryFn: async (arg, { extra, signal }) => {
        try {
          const { request } = extra as ApiClients
          const response = await request<unknown>(API_ROUTES.PARTS_REQUEST, {
            body: {
              phone: `+7${arg.phone}`,
              email: arg.email.trim(),
              ...(arg.partNumber?.trim() ? { partNumber: arg.partNumber.trim() } : {}),
              ...(arg.comment?.trim() ? { comment: arg.comment.trim() } : {}),
            },
            signal,
          })
          const data = partsRequestResponseSchema.parse(response)
          return { data: { number: data.requestCode, createdAt: new Date().toISOString() } }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
    }),
  }),
})
