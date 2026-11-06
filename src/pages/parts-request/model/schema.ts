import { z } from 'zod'
import { isValidPhone } from '@/shared/lib/phone-mask'

export const COMMENT_MAX_LENGTH = 255
export const PART_NUMBER_MAX_LENGTH = 50

export const partsRequestSchema = z.object({
  phone: z.string().superRefine((digits, ctx) => {
    if (!digits) ctx.addIssue({ code: 'custom', message: 'Обязательное поле' })
    else if (!isValidPhone(digits)) ctx.addIssue({ code: 'custom', message: 'Некорректный номер телефона' })
  }),
  email: z
    .string()
    .trim()
    .max(320, 'Не больше 320 символов')
    .superRefine((value, ctx) => {
      if (!value) ctx.addIssue({ code: 'custom', message: 'Обязательное поле' })
      else if (!z.email().safeParse(value).success) {
        ctx.addIssue({ code: 'custom', message: 'Некорректный адрес электронной почты' })
      }
    }),
  partNumber: z.string().max(PART_NUMBER_MAX_LENGTH, 'Максимальное кол-во символов 50').optional(),
  comment: z.string().max(COMMENT_MAX_LENGTH, 'Не больше 255 символов').optional(),
})

export type PartsRequestFormValues = z.infer<typeof partsRequestSchema>
