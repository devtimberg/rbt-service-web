import { useState } from 'react'
import { useFavoritesStore } from '@/entities/favorite'
import { MOCK_AVAILABILITY_OPTIONS, MOCK_PRODUCTS } from '@/entities/product'
import { ROUTES } from '@/shared/config'
import { useStickyScroll } from '@/shared/lib/useStickyScroll'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { HeartOutlineIcon } from '@/shared/ui/icons'
import { Text } from '@/shared/ui/Text'
import { Footer } from '@/widgets/footer'
import { ProductCard } from '@/widgets/product-card'
import { FavoriteFilters } from './favorite-filters'

const BREADCRUMB_ITEMS = [{ label: 'Избранное' }]

const SORT_OPTIONS = [
  { label: 'По популярности', value: 'popular' },
  { label: 'По цене ↑', value: 'price-asc' },
  { label: 'По цене ↓', value: 'price-desc' },
] as const

const FAVORITE_CATEGORIES = [
  'Запчасти для холодильников',
  'Запчасти для стиральных машин',
  'Запчасти для плит',
  'Запчасти для пылесосов',
  'Запчасти для СВЧ печей',
]

export function FavoritePage() {
  const [sort, setSort] = useState('popular')
  const favoriteIds = useFavoritesStore((s) => s.items)
  const { ref: filtersRef, top: filtersTop } = useStickyScroll<HTMLDivElement>()

  // TODO: заменить на реальную загрузку товаров по ID
  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favoriteIds.has(p.id))

  const sortedProducts = [...favoriteProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0
  })

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex grow flex-col">
        <Container className="overflow-x-hidden">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </Container>

        <Container className="flex flex-1 flex-col items-center justify-center text-center">
          <HeartOutlineIcon className="mb-4 size-16 text-secondary-500" />
          <Text size="lg" className="font-semibold">
            В избранном пока пусто
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Нажмите на сердечко у товара, <br className="sm:hidden" />
            чтобы добавить его в избранное
          </Text>
          <Button variant="primary" size="md" rounded="default" className="mt-6" href={ROUTES.CATALOG}>
            Перейти в каталог
          </Button>
        </Container>

        <div className="mt-auto hidden sm:block">
          <Footer variant="default" />
        </div>
      </div>
    )
  }

  return (
    <>
      <Container className="overflow-x-hidden">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="mt-6">
        <div className="flex gap-8">
          {/* Filters sidebar — desktop only */}
          <div
            ref={filtersRef}
            className="hidden shrink-0 self-start lg:block"
            style={{ position: 'sticky', top: filtersTop }}
          >
            <FavoriteFilters categories={FAVORITE_CATEGORIES} availabilityGroup={MOCK_AVAILABILITY_OPTIONS} />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1 overflow-x-hidden">
            <Heading size="lg">Избранное</Heading>

            {/* Sort chips */}
            <div className="-mx-4 mt-4 flex items-center gap-3 overflow-x-auto px-4 scrollbar-none">
              <span className="hidden shrink-0 text-sm text-tertiary sm:inline">Сортировка:</span>
              {SORT_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  variant="outline-default"
                  size="sm"
                  rounded="md"
                  selected={sort === option.value}
                  onClick={() => setSort(option.value)}
                  className="shrink-0"
                >
                  {option.label}
                </Chip>
              ))}
            </div>

            {/* Product grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="mt-20">
        <Footer variant="default" />
      </div>
    </>
  )
}
