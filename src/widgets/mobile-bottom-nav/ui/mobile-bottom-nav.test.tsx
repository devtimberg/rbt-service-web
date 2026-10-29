import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { MobileBottomNav } from './mobile-bottom-nav'

const state = vi.hoisted(() => ({ pathname: '/', cart: 0, favorites: 0 }))

vi.mock('@/shared/lib/use-pathname', () => ({ usePathname: () => state.pathname }))
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

  it('показывает пять вкладок: главная ссылкой, закрытые в MVP разделы и профиль кнопками', () => {
    render(<MobileBottomNav />)
    expect(screen.getByRole('navigation', { name: 'Мобильная навигация' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument()
    for (const name of ['Каталог', 'Избранное', 'Корзина', 'Профиль']) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-haspopup', 'dialog')
    }
  })

  it('закрытый раздел открывает окно «Этот раздел ещё в работе»', async () => {
    render(<MobileBottomNav />)
    await userEvent.click(screen.getByRole('button', { name: 'Каталог' }))
    expect(screen.getByRole('dialog', { name: 'Этот раздел ещё в работе' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Вызвать мастера' })).toHaveAttribute('href', '/master-call')
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
    expect(screen.getByRole('button', { name: 'Корзина' })).toHaveTextContent('3')
    expect(screen.getByRole('button', { name: 'Избранное' })).toHaveTextContent('12')
    expect(screen.getByRole('button', { name: 'Каталог' }).textContent).not.toMatch(/\d/)
  })

  it('отмечает активную вкладку по aria-current, включая подстраницы главной', () => {
    state.pathname = '/services-repair'
    render(<MobileBottomNav />)
    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute('aria-current', 'page')
  })
})
