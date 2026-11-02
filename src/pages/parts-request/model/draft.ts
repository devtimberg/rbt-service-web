import { z } from 'zod'
import { PHONE_DIGITS } from '@/shared/lib/phone-mask'
import { type PartsRequestFormValues } from './schema'

export const PARTS_REQUEST_DRAFT_KEY = 'rbt:parts-request:draft:v1'
export const EMPTY_PARTS_REQUEST: PartsRequestFormValues = { phone: '', email: '', partNumber: '', comment: '' }

const draftSchema = z.object({
  email: z.string().max(10000),
  partNumber: z.string().max(10000),
  phone: z.string().regex(new RegExp(`^\\d{0,${PHONE_DIGITS}}$`)),
  comment: z.string().max(10000),
})

export function hasPartsRequestDraft(values: Partial<PartsRequestFormValues>) {
  return Boolean(values.email?.trim() || values.partNumber?.trim() || values.phone || values.comment?.trim())
}

export function readPartsRequestDraft(): PartsRequestFormValues {
  try {
    const raw = sessionStorage.getItem(PARTS_REQUEST_DRAFT_KEY)
    if (!raw) return { ...EMPTY_PARTS_REQUEST }
    const parsed = draftSchema.safeParse(JSON.parse(raw))
    if (parsed.success) return parsed.data
    sessionStorage.removeItem(PARTS_REQUEST_DRAFT_KEY)
  } catch {
    // Недоступное или повреждённое хранилище не мешает заполнению формы.
    clearPartsRequestDraft()
  }
  return { ...EMPTY_PARTS_REQUEST }
}

export function savePartsRequestDraft(values: Partial<PartsRequestFormValues>) {
  try {
    if (hasPartsRequestDraft(values)) sessionStorage.setItem(PARTS_REQUEST_DRAFT_KEY, JSON.stringify(values))
    else sessionStorage.removeItem(PARTS_REQUEST_DRAFT_KEY)
  } catch {
    // Форма работает и без доступа к sessionStorage.
  }
}

export function clearPartsRequestDraft() {
  try {
    sessionStorage.removeItem(PARTS_REQUEST_DRAFT_KEY)
  } catch {
    // Хранилище может быть запрещено настройками браузера.
  }
}
