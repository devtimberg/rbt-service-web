import { describe, expect, it } from 'vite-plus/test'
import { OTHER_CATEGORY_LABEL, resolveApplianceCategory } from './categories'

describe('resolveApplianceCategory', () => {
  it('обычную категорию возвращает как есть', () => {
    expect(resolveApplianceCategory({ category: 'Холодильник' })).toBe('Холодильник')
  })

  it('для «Другое» берёт свой вариант техники без краевых пробелов', () => {
    expect(resolveApplianceCategory({ category: OTHER_CATEGORY_LABEL, customCategory: ' Печь ' })).toBe('Печь')
  })

  it('пустой свой вариант откатывается к «Другое»', () => {
    expect(resolveApplianceCategory({ category: OTHER_CATEGORY_LABEL, customCategory: '   ' })).toBe(
      OTHER_CATEGORY_LABEL,
    )
    expect(resolveApplianceCategory({ category: OTHER_CATEGORY_LABEL })).toBe(OTHER_CATEGORY_LABEL)
  })

  it('без категории возвращает undefined', () => {
    expect(resolveApplianceCategory({})).toBeUndefined()
  })
})
