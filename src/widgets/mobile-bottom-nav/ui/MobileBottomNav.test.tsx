import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { MobileBottomNav } from './MobileBottomNav'

const state = vi.hoisted(() => ({ pathname: '/', cart: 0, favorites: 0 }))

vi.mock('@/shared/lib/usePathname', () => ({ usePathname: () => state.pathname }))
vi.mock('@/entities/cart', () => ({
  useCartStore: (select: (s: { items: Map<string, unknown> }) => unknown) =>
    select({ items: new Map(Array.from({ length: state.cart }, (_, i) => [String(i), {}])) }),
}))
vi.mock('@/entities/favorite', () => ({
  useFavoritesStore: (select: (s: { items: Map<string, unknown> }) => unknown) =>
    select({ items: new Map(Array.from({ length: state.favorites }, (_, i) => [String(i), {}])) }),
}))

describe('MobileBottomNav', () => {
  beforeEach(() => {
    state.pathname = '/'
    state.cart = 0
    state.favorites = 0
  })

  it('показывает четыре вкладки навигации', () => {
    render(<MobileBottomNav />)
    expect(screen.getByRole('navigation', { name: 'Мобильная навигация' })).toBeInTheDocument()
    for (const name of ['Главная', 'Каталог', 'Избранное', 'Корзина']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
  })

  it.each(['/master-call', '/search'])('скрыта на %s', (pathname) => {
    state.pathname = pathname
    render(<MobileBottomNav />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('показывает бейджи счётчиков корзины и избранного', () => {
    state.cart = 3
    state.favorites = 12
    render(<MobileBottomNav />)
    expect(screen.getByRole('link', { name: 'Корзина' })).toHaveTextContent('3')
    expect(screen.getByRole('link', { name: 'Избранное' })).toHaveTextContent('12')
    expect(screen.getByRole('link', { name: 'Каталог' }).textContent).not.toMatch(/\d/)
  })

  it('отмечает активную вкладку по aria-current', () => {
    state.pathname = '/catalog/fridges'
    render(<MobileBottomNav />)
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Главная' })).not.toHaveAttribute('aria-current')
  })
})
