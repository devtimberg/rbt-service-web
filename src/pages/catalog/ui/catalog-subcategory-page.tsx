import { useState } from 'react'
import { MOCK_AVAILABILITY_OPTIONS, MOCK_FILTER_GROUPS, MOCK_PRICE_RANGE, MOCK_PRODUCTS } from '@/entities/product'
import { cn } from '@/shared/lib/cn'
import { useStickyScroll } from '@/shared/lib/use-sticky-scroll'
import {
  Box,
  Breadcrumb,
  Button,
  Chip,
  Container,
  Heading,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Text,
} from '@/shared/ui'
import { Footer } from '@/widgets/footer'
import { ProductCard } from '@/widgets/product-card'
import { CatalogFilters } from './catalog-filters'
import styles from './catalog-subcategory-page.module.css'

const SORT_OPTIONS = [
  { label: 'По популярности', value: 'popular' },
  { label: 'По цене ↑', value: 'price-asc' },
  { label: 'По цене ↓', value: 'price-desc' },
] as const

const BREADCRUMB_ITEMS = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Запасные части для бытовой техники', href: '/catalog' },
  { label: 'Запчасти для холодильников' },
]

export function CatalogSubcategoryPage() {
  const [sort, setSort] = useState('popular')
  const { ref: filtersRef } = useStickyScroll<HTMLDivElement>()

  return (
    <>
      <Container className={styles.breadcrumb}>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className={styles.main}>
        <Box className={styles.layout}>
          {/* Filters sidebar — desktop only */}
          <Box ref={filtersRef} className={styles.sidebar} style={{ position: 'sticky' }}>
            <CatalogFilters
              filterGroups={MOCK_FILTER_GROUPS}
              availabilityGroup={MOCK_AVAILABILITY_OPTIONS}
              priceRange={MOCK_PRICE_RANGE}
            />
          </Box>

          {/* Main content */}
          <Box className={styles.content}>
            <Heading level={2} size="lg">
              Запчасти для холодильников
            </Heading>

            {/* Sort chips */}
            <Box className={cn('scrollbar-none', styles.sortRow)}>
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
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>

            {/* Show more */}
            <Box className={styles.more}>
              <Button variant="secondary" rounded="full" className={styles.moreButton}>
                Показать ещё
              </Button>
            </Box>

            {/* Pagination */}
            <Pagination className={styles.pagination}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Box>
        </Box>
      </Container>

      <Box className={styles.footer}>
        <Footer variant="default" />
      </Box>
    </>
  )
}
