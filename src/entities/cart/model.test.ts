import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { rehydrateCartStore, useCartStore } from './model'

const store = () => useCartStore.getState()

describe('стор корзины', () => {
  beforeEach(() => {
    useCartStore.setState({ items: new Map() })
  })

  it('toggle добавляет товар с количеством 1 и убирает при повторном вызове', () => {
    store().toggle('a')
    expect(store().has('a')).toBe(true)
    expect(store().getQuantity('a')).toBe(1)
    store().toggle('a')
    expect(store().has('a')).toBe(false)
    expect(store().getQuantity('a')).toBe(0)
  })

  it('increment увеличивает количество, в том числе для нового товара', () => {
    store().increment('a')
    store().increment('a')
    expect(store().getQuantity('a')).toBe(2)
  })

  it('decrement уменьшает количество, но не опускает ниже 1', () => {
    store().increment('a')
    store().increment('a')
    store().decrement('a')
    expect(store().getQuantity('a')).toBe(1)
    store().decrement('a')
    expect(store().getQuantity('a')).toBe(1)
    expect(store().has('a')).toBe(true)
  })

  it('remove удаляет товар целиком', () => {
    store().increment('a')
    store().increment('a')
    store().remove('a')
    expect(store().has('a')).toBe(false)
  })

  it('getQuantity для неизвестного товара даёт 0', () => {
    expect(store().getQuantity('нет')).toBe(0)
  })

  it('сохраняет корзину в localStorage парами и восстанавливает Map после rehydrate', () => {
    store().increment('a')
    store().increment('a')
    const saved = localStorage.getItem('rbt-cart')!
    expect(JSON.parse(saved).state.items).toEqual([['a', 2]])

    // setState тоже пишет в localStorage, поэтому сохранённое значение возвращаем после сброса
    useCartStore.setState({ items: new Map() })
    localStorage.setItem('rbt-cart', saved)
    rehydrateCartStore()
    expect(store().getQuantity('a')).toBe(2)
  })

  it('при rehydrate отбрасывает мусор: нестроковый id, дробное и нулевое количество', () => {
    const bad = JSON.stringify({
      state: { items: [['a', 2], ['b', 0], ['c', 1.5], [5, 1], ['d', '3'], 'x'] },
      version: 0,
    })
    localStorage.setItem('rbt-cart', bad)
    rehydrateCartStore()
    expect([...store().items]).toEqual([['a', 2]])
  })
})
