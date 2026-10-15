import { useState } from 'react'
import { MOCK_AVAILABILITY_OPTIONS, MOCK_FILTER_GROUPS, MOCK_PRICE_RANGE, MOCK_PRODUCTS } from '@/entities/product'
import { useStickyScroll } from '@/shared/lib/useStickyScroll'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/Pagination'
import { Text } from '@/shared/ui/Text'
import { Footer } from '@/widgets/footer'
import { ProductCard } from '@/widgets/product-card'
import { CatalogFilters } from './catalog-filters'

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
  const { ref: filtersRef, top: filtersTop } = useStickyScroll<HTMLDivElement>()

  return (
    <>
      <Container className="overflow-x-hidden">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="mt-6">
        <Box className="flex gap-8">
          {/* Filters sidebar — desktop only */}
          <Box
            ref={filtersRef}
            className="hidden shrink-0 self-start lg:block"
            style={{ position: 'sticky', top: filtersTop }}
          >
            <CatalogFilters
              filterGroups={MOCK_FILTER_GROUPS}
              availabilityGroup={MOCK_AVAILABILITY_OPTIONS}
              priceRange={MOCK_PRICE_RANGE}
            />
          </Box>

          {/* Main content */}
          <Box className="min-w-0 flex-1 overflow-x-hidden">
            <Heading level={2} size="lg">
              Запчасти для холодильников
            </Heading>

            {/* Sort chips */}
            <Box className="-mx-4 mt-4 flex items-center gap-3 overflow-x-auto px-4 scrollbar-none">
              <Text as="span" className="hidden shrink-0 text-sm text-tertiary sm:inline">
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
                  className="shrink-0"
                >
                  {option.label}
                </Chip>
              ))}
            </Box>

            {/* Product grid */}
            <Box className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>

            {/* Show more */}
            <Box className="mt-12 flex justify-center">
              <Button variant="secondary" rounded="full" className="px-10">
                Показать ещё
              </Button>
            </Box>

            {/* Pagination */}
            <Pagination className="mt-10">
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

      <Box className="mt-20">
        <Footer variant="default" />
      </Box>
    </>
  )
}
