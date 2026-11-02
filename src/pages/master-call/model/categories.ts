import type { MasterCallFormValues } from './schema'

type ApplianceCategory = { key: string; label: string }

/** Метка варианта «Другое»: по ней показываем поле своего варианта техники. */
export const OTHER_CATEGORY_LABEL = 'Другое'

export const APPLIANCE_CATEGORIES: ApplianceCategory[] = [
  { key: 'water-heater', label: 'Водонагреватель' },
  { key: 'cooktop', label: 'Варочная поверхность' },
  { key: 'gas-stove', label: 'Газовая плита' },
  { key: 'dishwasher', label: 'Посудомоечная машина' },
  { key: 'oven', label: 'Духовой шкаф' },
  { key: 'freezer', label: 'Морозильная камера' },
  { key: 'dryer', label: 'Сушильная барабан' },
  { key: 'fridge', label: 'Холодильник' },
  { key: 'electric-stove', label: 'Электрическая плита' },
  { key: 'other', label: OTHER_CATEGORY_LABEL },
]

/** Категория для заявки и чека: свой вариант техники, если выбрано «Другое» и он заполнен. */
export function resolveApplianceCategory(values: Partial<Pick<MasterCallFormValues, 'category' | 'customCategory'>>) {
  if (values.category !== OTHER_CATEGORY_LABEL) return values.category
  return values.customCategory?.trim() || OTHER_CATEGORY_LABEL
}
