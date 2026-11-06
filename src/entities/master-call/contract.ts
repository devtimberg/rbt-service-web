import { z } from 'zod'

export const createMasterCallSchema = z.object({
  phone: z.string().regex(/^\+[1-9][0-9]{6,14}$/),
  equipmentType: z
    .enum(['REFRIGERATOR', 'WASHING_MACHINE', 'DISHWASHER', 'OVEN', 'COOKTOP', 'AIR_CONDITIONER', 'OTHER'])
    .optional(),
  equipmentName: z.string().max(255).optional(),
  comment: z.string().max(255).optional(),
})

export const masterCallResponseSchema = z.object({ requestNumber: z.string().trim().min(1) })

type EquipmentType = NonNullable<z.infer<typeof createMasterCallSchema>['equipmentType']>

const EQUIPMENT_TYPES: Record<string, EquipmentType> = {
  Холодильник: 'REFRIGERATOR',
  'Стиральная машина': 'WASHING_MACHINE',
  'Посудомоечная машина': 'DISHWASHER',
  'Духовой шкаф': 'OVEN',
  'Варочная поверхность': 'COOKTOP',
  Кондиционер: 'AIR_CONDITIONER',
}

export type CreateMasterCallArg = {
  category?: string | undefined
  customCategory?: string | undefined
  /** Национальные цифры номера из PhoneField, без +7. */
  phone: string
  comment?: string | undefined
}

/** Технику без отдельного кода API передаём как OTHER с исходным названием. */
export function toCreateMasterCallBody(arg: CreateMasterCallArg): z.infer<typeof createMasterCallSchema> {
  const category = arg.category?.trim()
  const equipmentType = category
    ? Object.hasOwn(EQUIPMENT_TYPES, category)
      ? EQUIPMENT_TYPES[category]
      : 'OTHER'
    : undefined
  const equipmentName = category === 'Другое' ? arg.customCategory?.trim() : category
  return {
    phone: `+7${arg.phone}`,
    ...(equipmentType ? { equipmentType } : {}),
    ...(equipmentType === 'OTHER' && equipmentName ? { equipmentName } : {}),
    ...(arg.comment?.trim() ? { comment: arg.comment.trim() } : {}),
  }
}
