import { afterEach, describe, expect, it } from 'vite-plus/test'
import {
  EMPTY_PARTS_REQUEST,
  PARTS_REQUEST_DRAFT_KEY,
  clearPartsRequestDraft,
  readPartsRequestDraft,
  savePartsRequestDraft,
} from './draft'

afterEach(() => sessionStorage.clear())

describe('черновик заказа запчасти', () => {
  it('восстанавливает частичный телефон и невалидные поля без потери текста', () => {
    const values = { phone: '90012', email: 'mail@', partNumber: 'a'.repeat(51), comment: 'a'.repeat(256) }
    savePartsRequestDraft(values)
    expect(readPartsRequestDraft()).toEqual(values)
  })

  it('удаляет повреждённый черновик', () => {
    sessionStorage.setItem(PARTS_REQUEST_DRAFT_KEY, '{')
    expect(readPartsRequestDraft()).toEqual(EMPTY_PARTS_REQUEST)
    expect(sessionStorage.getItem(PARTS_REQUEST_DRAFT_KEY)).toBeNull()
  })

  it('не меняет черновик вызова мастера при очистке заказа', () => {
    sessionStorage.setItem('rbt:master-call:draft:v1', 'сохранённые данные')
    savePartsRequestDraft({ ...EMPTY_PARTS_REQUEST, email: 'mail@example.ru' })
    clearPartsRequestDraft()
    expect(sessionStorage.getItem(PARTS_REQUEST_DRAFT_KEY)).toBeNull()
    expect(sessionStorage.getItem('rbt:master-call:draft:v1')).toBe('сохранённые данные')
  })
})
