import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { rehydrateFavoritesStore, useFavoritesStore } from './model'

const store = () => useFavoritesStore.getState()

describe('стор избранного', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ items: new Set() })
  })

  it('toggle добавляет товар в избранное и убирает при повторном вызове', () => {
    expect(store().has('a')).toBe(false)
    store().toggle('a')
    expect(store().has('a')).toBe(true)
    store().toggle('a')
    expect(store().has('a')).toBe(false)
  })

  it('товары не влияют друг на друга', () => {
    store().toggle('a')
    store().toggle('b')
    store().toggle('a')
    expect(store().has('a')).toBe(false)
    expect(store().has('b')).toBe(true)
  })

  it('при rehydrate оставляет только строковые id', () => {
    localStorage.setItem('rbt-favorites', JSON.stringify({ state: { items: ['a', 1, null, 'b'] }, version: 0 }))
    rehydrateFavoritesStore()
    expect([...store().items]).toEqual(['a', 'b'])
  })
})
