import { z } from 'zod'
import { isValidPhone } from '@/shared/lib/phone-mask'

export const COMMENT_MAX_LENGTH = 255

export const masterCallSchema = z.object({
  category: z.string().optional(),
  phone: z.string().superRefine((digits, ctx) => {
    if (!digits) {
      ctx.addIssue({ code: 'custom', message: 'Обязательное поле' })
    } else if (!isValidPhone(digits)) {
      ctx.addIssue({ code: 'custom', message: 'Некорректный номер телефона' })
    }
  }),
  comment: z.string().max(COMMENT_MAX_LENGTH, `Не больше ${COMMENT_MAX_LENGTH} символов`).optional(),
})

export type MasterCallFormValues = z.infer<typeof masterCallSchema>
