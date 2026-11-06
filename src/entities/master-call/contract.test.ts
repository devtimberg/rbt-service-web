import { describe, expect, it } from 'vite-plus/test'
import { createMasterCallSchema, toCreateMasterCallBody } from './contract'

const phone = '9001234567'

describe('контракт вызова мастера', () => {
  it.each([
    ['Холодильник', 'REFRIGERATOR'],
    ['Стиральная машина', 'WASHING_MACHINE'],
    ['Посудомоечная машина', 'DISHWASHER'],
    ['Духовой шкаф', 'OVEN'],
    ['Варочная поверхность', 'COOKTOP'],
    ['Кондиционер', 'AIR_CONDITIONER'],
    ['Другое', 'OTHER'],
  ])('передаёт %s кодом %s', (category, equipmentType) => {
    expect(toCreateMasterCallBody({ phone, category })).toEqual({ phone: `+7${phone}`, equipmentType })
  })

  it.each(['Водонагреватель', 'Газовая плита', 'Морозильная камера', 'Сушильная барабан', 'Электрическая плита'])(
    'сохраняет название %s, если для него нет кода API',
    (category) => {
      expect(toCreateMasterCallBody({ phone, category })).toEqual({
        phone: `+7${phone}`,
        equipmentType: 'OTHER',
        equipmentName: category,
      })
    },
  )

  it('сохраняет собственный вариант и убирает краевые пробелы', () => {
    expect(
      toCreateMasterCallBody({ phone, category: 'Другое', customCategory: ' Кофемашина ', comment: ' Не работает ' }),
    ).toEqual({ phone: `+7${phone}`, equipmentType: 'OTHER', equipmentName: 'Кофемашина', comment: 'Не работает' })
  })

  it('не отправляет скрытый свой вариант и пустые необязательные поля', () => {
    expect(toCreateMasterCallBody({ phone, category: '', customCategory: 'Кофемашина', comment: ' ' })).toEqual({
      phone: `+7${phone}`,
    })
    expect(toCreateMasterCallBody({ phone, category: 'Другое', customCategory: ' ' })).toEqual({
      phone: `+7${phone}`,
      equipmentType: 'OTHER',
    })
  })

  it('отклоняет неверный телефон, неизвестный код и превышение лимитов', () => {
    for (const value of [
      { phone },
      { phone: `+7${phone}`, equipmentType: 'FREEZER' },
      { phone: `+7${phone}`, equipmentName: 'x'.repeat(256) },
      { phone: `+7${phone}`, comment: 'x'.repeat(256) },
    ])
      expect(createMasterCallSchema.safeParse(value).success).toBe(false)
  })
})
