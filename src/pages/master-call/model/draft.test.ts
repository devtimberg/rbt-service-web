import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import {
  clearMasterCallDraft,
  EMPTY_MASTER_CALL,
  hasMasterCallDraft,
  MASTER_CALL_DRAFT_KEY,
  readMasterCallDraft,
  saveMasterCallDraft,
} from './draft'

describe('черновик вызова мастера', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('восстанавливает незавершённый телефон и скрытый свой вариант техники', () => {
    const draft = { category: 'Холодильник', customCategory: 'Кофемашина', phone: '90012', comment: 'Не включается' }
    saveMasterCallDraft(draft)
    expect(readMasterCallDraft()).toEqual(draft)
  })

  it('удаляет повреждённый и несовместимый черновик', () => {
    sessionStorage.setItem(MASTER_CALL_DRAFT_KEY, '{broken')
    expect(readMasterCallDraft()).toEqual(EMPTY_MASTER_CALL)
    sessionStorage.setItem(MASTER_CALL_DRAFT_KEY, JSON.stringify({ ...EMPTY_MASTER_CALL, phone: '+79001234567' }))
    expect(readMasterCallDraft()).toEqual(EMPTY_MASTER_CALL)
    expect(sessionStorage.getItem(MASTER_CALL_DRAFT_KEY)).toBeNull()
  })

  it('считает сохранённый свой вариант данными, даже когда категория не выбрана', () => {
    expect(hasMasterCallDraft({ customCategory: 'Кофемашина' })).toBe(true)
    expect(hasMasterCallDraft({ comment: '  ', customCategory: ' ' })).toBe(false)
  })

  it('очищает черновик явно и после очистки полей', () => {
    saveMasterCallDraft({ ...EMPTY_MASTER_CALL, phone: '9' })
    clearMasterCallDraft()
    expect(sessionStorage.getItem(MASTER_CALL_DRAFT_KEY)).toBeNull()
    saveMasterCallDraft({ ...EMPTY_MASTER_CALL, comment: 'Текст' })
    saveMasterCallDraft(EMPTY_MASTER_CALL)
    expect(sessionStorage.getItem(MASTER_CALL_DRAFT_KEY)).toBeNull()
  })

  it('продолжает работу при запрещённом хранилище', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Недоступно')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Недоступно')
    })
    expect(readMasterCallDraft()).toEqual(EMPTY_MASTER_CALL)
    expect(() => saveMasterCallDraft({ phone: '9' })).not.toThrow()
  })
})
