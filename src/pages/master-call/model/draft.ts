import { z } from 'zod'
import { PHONE_DIGITS } from '@/shared/lib/phone-mask'
import { APPLIANCE_CATEGORIES } from './categories'
import { CUSTOM_CATEGORY_MAX_LENGTH, type MasterCallFormValues } from './schema'

export const MASTER_CALL_DRAFT_KEY = 'rbt:master-call:draft:v1'
export const EMPTY_MASTER_CALL: MasterCallFormValues = { category: '', customCategory: '', phone: '', comment: '' }

const draftSchema = z.object({
  category: z.string().refine((value) => !value || APPLIANCE_CATEGORIES.some((category) => category.label === value)),
  customCategory: z.string().max(CUSTOM_CATEGORY_MAX_LENGTH),
  phone: z.string().regex(new RegExp(`^\\d{0,${PHONE_DIGITS}}$`)),
  comment: z.string().max(10000),
})

export function hasMasterCallDraft(values: Partial<MasterCallFormValues>) {
  return Boolean(values.category || values.customCategory?.trim() || values.phone || values.comment?.trim())
}

export function readMasterCallDraft(): MasterCallFormValues {
  try {
    const raw = sessionStorage.getItem(MASTER_CALL_DRAFT_KEY)
    if (!raw) return { ...EMPTY_MASTER_CALL }
    const parsed = draftSchema.safeParse(JSON.parse(raw))
    if (parsed.success) return parsed.data
    sessionStorage.removeItem(MASTER_CALL_DRAFT_KEY)
  } catch {
    // Недоступное или повреждённое хранилище не мешает заполнению формы.
    clearMasterCallDraft()
  }
  return { ...EMPTY_MASTER_CALL }
}

export function saveMasterCallDraft(values: Partial<MasterCallFormValues>) {
  try {
    if (hasMasterCallDraft(values)) sessionStorage.setItem(MASTER_CALL_DRAFT_KEY, JSON.stringify(values))
    else sessionStorage.removeItem(MASTER_CALL_DRAFT_KEY)
  } catch {
    // Форма работает и без доступа к sessionStorage.
  }
}

export function clearMasterCallDraft() {
  try {
    sessionStorage.removeItem(MASTER_CALL_DRAFT_KEY)
  } catch {
    // Хранилище может быть запрещено настройками браузера.
  }
}
