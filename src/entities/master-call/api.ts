import { api } from '@/shared/api'

export type CreateMasterCallArg = { category?: string | undefined; phone: string; comment?: string | undefined }

export type MasterCall = { number: string; createdAt: string }

const digits = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')

export const masterCallApi = api.injectEndpoints({
  endpoints: (build) => ({
    createMasterCall: build.mutation<MasterCall, CreateMasterCallArg>({
      // shortcut: заглушка без сети, заменить на apiFetch (ошибки ApiError в сериализуемый объект), когда появится API
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        return { data: { number: `${digits()}-${digits()}`, createdAt: new Date().toISOString() } }
      },
    }),
  }),
})

export const { useCreateMasterCallMutation } = masterCallApi
