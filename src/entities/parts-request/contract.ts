import { z } from 'zod'

/** Контракт customer API: телефон передаётся с кодом страны и плюсом. */
export const createPartsRequestSchema = z.object({
  phone: z.string().regex(/^\+[1-9][0-9]{6,14}$/),
  email: z.email().max(320),
  partNumber: z.string().max(50).optional(),
  comment: z.string().max(255).optional(),
})

export const partsRequestResponseSchema = z.object({ requestCode: z.string().trim().min(1) })
