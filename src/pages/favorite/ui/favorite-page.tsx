import { useState } from 'react'
import { useFavoritesStore } from '@/entities/favorite'
import { MOCK_AVAILABILITY_OPTIONS, MOCK_PRODUCTS } from '@/entities/product'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { usePersistHydrated } from '@/shared/lib/use-persist-hydrated'
import { useStickyScroll } from '@/shared/lib/use-sticky-scroll'
import { Box, Breadcrumb, Button, Chip, Container, Heading, HeartOutlineIcon, LineBreak, Text } from '@/shared/ui'
import { Footer } from '@/widgets/footer'
import { ProductCard } from '@/widgets/product-card'
import { FavoriteFilters } from './favorite-filters'
import styles from './favorite-page.module.css'

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
  const hydrated = usePersistHydrated(useFavoritesStore.persist)
  const favoriteIds = useFavoritesStore((s) => s.items)
  const { ref: filtersRef } = useStickyScroll<HTMLDivElement>()

  // TODO: заменить на реальную загрузку товаров по ID
  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favoriteIds.has(p.id))

  const sortedProducts = [...favoriteProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0
  })

  // До подтягивания из localStorage избранное пусто: не мигаем пустым состоянием
  if (!hydrated) return null

  if (favoriteProducts.length === 0) {
    return (
      <Box className={styles.empty}>
        <Container className={styles.crumbs}>
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </Container>

        <Container className={styles.emptyBody}>
          <HeartOutlineIcon className={styles.emptyIcon} />
          <Text className={styles.emptyTitle}>В избранном пока пусто</Text>
          <Text className={styles.emptyText}>
            Нажмите на сердечко у товара, <LineBreak className={styles.emptyBreak} />
            чтобы добавить его в избранное
          </Text>
          <Button variant="primary" size="md" rounded="default" className={styles.emptyButton} href={ROUTES.CATALOG}>
            Перейти в каталог
          </Button>
        </Container>

        <Box className={styles.emptyFooter}>
          <Footer variant="default" />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Container className={styles.crumbs}>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className={styles.content}>
        <Box className={styles.layout}>
          {/* Filters sidebar — desktop only */}
          <Box ref={filtersRef} className={styles.sidebar} style={{ position: 'sticky' }}>
            <FavoriteFilters categories={FAVORITE_CATEGORIES} availabilityGroup={MOCK_AVAILABILITY_OPTIONS} />
          </Box>

          {/* Main content */}
          <Box className={styles.main}>
            <Heading level={2} size="lg">
              Избранное
            </Heading>

            {/* Sort chips */}
            <Box className={cn(styles.sort, 'scrollbar-none')}>
              <Text as="span" className={styles.sortLabel}>
                Сортировка:
              </Text>
              {SORT_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  variant="outline-default"
                  size="sm"
                  rounded="md"
                  selected={sort === option.value}
                  onClick={() => setSort(option.value)}
                  className={styles.sortChip}
                >
                  {option.label}
                </Chip>
              ))}
            </Box>

            {/* Product grid */}
            <Box className={styles.grid}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>

      <Box className={styles.footer}>
        <Footer variant="default" />
      </Box>
    </>
  )
}
