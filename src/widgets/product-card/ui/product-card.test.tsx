import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import type { Product } from '@/entities/product'
import { ProductCard } from './product-card'

const product: Product = {
  id: 'p1',
  name: 'Плата управления',
  brand: 'Samsung',
  price: 2450,
  availability: 'in-stock',
}

describe('ProductCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: new Map() })
    useFavoritesStore.setState({ items: new Set() })
  })

  it('кнопка с сердечком переключает избранное', async () => {
    render(<ProductCard product={product} />)
    // Единственная кнопка с иконкой до добавления в корзину — сердечко (первая в DOM)
    const [heart] = screen.getAllByRole('button')
    await userEvent.click(heart!)
    expect(useFavoritesStore.getState().has('p1')).toBe(true)
    await userEvent.click(heart!)
    expect(useFavoritesStore.getState().has('p1')).toBe(false)
  })

  it('кнопка «В корзину» добавляет товар, затем показывает ссылку «В корзине»', async () => {
    render(<ProductCard product={product} />)
    await userEvent.click(screen.getByRole('button', { name: 'В корзину' }))
    expect(useCartStore.getState().has('p1')).toBe(true)
    expect(screen.getByRole('link', { name: 'В корзине' })).toHaveAttribute('href', '/cart')
  })
})
