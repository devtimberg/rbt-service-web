import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { SearchPage } from './search-page'

const state = vi.hoisted(() => ({ query: '' }))

vi.mock('@/features/search-products', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/search-products')>()),
  useSearchStore: (selector: (s: { query: string }) => unknown) => selector({ query: state.query }),
}))
vi.mock('@/entities/category', () => ({
  CATALOG_CATEGORIES: [{ items: ['Компрессоры', 'Термостаты', 'Уплотнители двери'] }],
}))

describe('SearchPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('без запроса показывает подсказку', () => {
    state.query = ''
    render(<SearchPage />)
    expect(screen.getByText('Введите название или артикул запчасти')).toBeInTheDocument()
  })

  it('по запросу после задержки фильтрует категории и запчасти', () => {
    state.query = 'компрессор'
    render(<SearchPage />)
    // Пока идёт имитация загрузки, результатов нет
    expect(screen.queryByText('Категории')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(screen.getByText('Категории')).toBeInTheDocument()
    expect(screen.getByText('Компрессоры')).toBeInTheDocument()
    expect(screen.queryByText('Термостаты')).not.toBeInTheDocument()
    expect(screen.getByText('Компрессор холодильника Атлант')).toBeInTheDocument()
  })

  it('без совпадений показывает «Ничего не найдено»', () => {
    state.query = 'яяяя'
    render(<SearchPage />)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
  })
})
