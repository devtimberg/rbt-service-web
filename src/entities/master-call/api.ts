import { api, toQueryError, type ApiClients } from '@/shared/api'
import { API_ROUTES } from '@/shared/config'
import { masterCallResponseSchema, toCreateMasterCallBody, type CreateMasterCallArg } from './contract'

export type { CreateMasterCallArg } from './contract'

/** Дату API не возвращает: createdAt — время получения успешного ответа для чека. */
export type MasterCall = { number: string; createdAt: string }

export const masterCallApi = api.injectEndpoints({
  endpoints: (build) => ({
    createMasterCall: build.mutation<MasterCall, CreateMasterCallArg>({
      queryFn: async (arg, { extra, signal }) => {
        try {
          const { request } = extra as ApiClients
          const response = await request<unknown>(API_ROUTES.MASTER_CALL, {
            body: toCreateMasterCallBody(arg),
            signal,
          })
          const data = masterCallResponseSchema.parse(response)
          return { data: { number: data.requestNumber, createdAt: new Date().toISOString() } }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
    }),
  }),
})
