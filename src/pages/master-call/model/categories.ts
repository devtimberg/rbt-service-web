import type { MasterCallFormValues } from './schema'

type ApplianceCategory = { key: string; label: string }

/** Метка варианта «Другое»: по ней показываем поле своего варианта техники. */
export const OTHER_CATEGORY_LABEL = 'Другое'

export const APPLIANCE_CATEGORIES: ApplianceCategory[] = [
  { key: 'REFRIGERATOR', label: 'Холодильник' },
  { key: 'WASHING_MACHINE', label: 'Стиральная машина' },
  { key: 'DISHWASHER', label: 'Посудомоечная машина' },
  { key: 'OVEN', label: 'Духовой шкаф' },
  { key: 'COOKTOP', label: 'Варочная поверхность' },
  { key: 'AIR_CONDITIONER', label: 'Кондиционер' },
  { key: 'OTHER', label: OTHER_CATEGORY_LABEL },
]

/** Категория для заявки и чека: свой вариант техники, если выбрано «Другое» и он заполнен. */
export function resolveApplianceCategory(values: Partial<Pick<MasterCallFormValues, 'category' | 'customCategory'>>) {
  if (values.category !== OTHER_CATEGORY_LABEL) return values.category
  return values.customCategory?.trim() || OTHER_CATEGORY_LABEL
}
