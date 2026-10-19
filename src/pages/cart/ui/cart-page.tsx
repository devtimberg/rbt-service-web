import { useCallback, useMemo, useState } from 'react'
import { useCartStore } from '@/entities/cart'
import { MOCK_PRODUCTS, type Product } from '@/entities/product'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { usePersistHydrated } from '@/shared/lib/usePersistHydrated'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { BagIcon } from '@/shared/ui/icons'
import { LineBreak, Text } from '@/shared/ui/Text'
import { Footer } from '@/widgets/footer'
import { calcCartTotals } from '../model/totals'
import { CartItem } from './cart-item'
import { CartSelectionBar } from './cart-selection-bar'
import { CartSummary } from './cart-summary'

const BREADCRUMB_ITEMS = [{ label: 'Корзина' }]

function CartGroup({
  label,
  dotColor,
  products,
  selectedIds,
  onToggleSelect,
  className,
  badge,
}: {
  label: string
  dotColor: string
  products: (Product & { quantity: number })[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  className?: string
  badge?: string
}) {
  return (
    <Box className={cn('rounded-2xl bg-white p-4', className)}>
      <Box className="flex flex-nowrap items-center gap-2">
        <Box className={cn('size-2 shrink-0 rounded-full', dotColor)} />
        <Text className="cursor-default text-primary text-base shrink-0 py-2 font-semibold">{label}</Text>
        <Text className="cursor-default font-normal text-secondary text-sm shrink-0">
          {pluralizeItems(products.reduce((s, p) => s + p.quantity, 0))}
        </Text>
        {badge && (
          <Text
            as="span"
            className="text-secondary-500 ml-1 shrink-0 rounded-md bg-[#FDEAF0]
              px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
          >
            {badge}
          </Text>
        )}
      </Box>

      <Box className="mt-3 flex flex-col gap-8">
        {products.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            isSelected={selectedIds.has(product.id)}
            onToggleSelectAction={onToggleSelect}
          />
        ))}
      </Box>
    </Box>
  )
}

function pluralizeItems(count: number): string {
  const lastTwo = count % 100
  const lastOne = count % 10

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} товаров`
  if (lastOne === 1) return `${count} товар`
  if (lastOne >= 2 && lastOne <= 4) return `${count} товара`
  return `${count} товаров`
}

export function CartPage() {
  const hydrated = usePersistHydrated(useCartStore.persist)
  const cartItems = useCartStore((s) => s.items)
  const removeFromCart = useCartStore((s) => s.remove)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set<string>())
  const [initialized, setInitialized] = useState(false)

  // Get products that are in the cart
  const cartProducts: (Product & { quantity: number })[] = useMemo(() => {
    const result: (Product & { quantity: number })[] = []
    for (const [id, qty] of cartItems) {
      const product = MOCK_PRODUCTS.find((p) => p.id === id)
      if (product) {
        result.push({ ...product, quantity: qty })
      }
    }
    return result
  }, [cartItems])

  // Initialize selection with all items on first render with products
  if (!initialized && cartProducts.length > 0) {
    setSelectedIds(new Set(cartProducts.map((p) => p.id)))
    setInitialized(true)
  }

  // Keep selection in sync: remove IDs that are no longer in the cart
  const effectiveSelectedIds = useMemo(
    () => new Set([...selectedIds].filter((id) => cartItems.has(id))),
    [selectedIds, cartItems],
  )

  const inStockProducts = cartProducts.filter((p) => p.availability === 'in-stock' || p.availability === 'low-stock')
  const preOrderProducts = cartProducts.filter((p) => p.availability === 'pre-order')

  // Compute totals from selected products only
  const selectedProducts = cartProducts.filter((p) => effectiveSelectedIds.has(p.id))
  const { totalItems, subtotal, discount } = calcCartTotals(selectedProducts)

  // Selection callbacks
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(cartProducts.map((p) => p.id)))
  }, [cartProducts])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const deleteSelected = useCallback(() => {
    for (const id of effectiveSelectedIds) {
      removeFromCart(id)
    }
    setSelectedIds(new Set())
  }, [effectiveSelectedIds, removeFromCart])

  const shareSelected = useCallback(() => {
    // TODO: реализовать функционал "Поделиться"
  }, [])

  // До подтягивания из localStorage корзина пуста: не мигаем пустым состоянием
  if (!hydrated) return null

  if (cartProducts.length === 0) {
    return (
      <Box className="flex grow flex-col">
        <Container className="overflow-x-hidden">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </Container>

        <Container
          className="flex flex-1 flex-col items-center justify-center
            text-center"
        >
          <BagIcon className="text-secondary-500 mb-4 size-16" />
          <Text className="cursor-default text-primary text-lg font-semibold">Корзина пуста</Text>
          <Text className="cursor-default font-normal text-secondary text-sm mt-2">
            Добавьте товары из каталога, <LineBreak className="sm:hidden" />
            чтобы оформить заказ
          </Text>
          <Button variant="primary" size="md" rounded="default" className="mt-6" href={ROUTES.CATALOG}>
            Перейти в каталог
          </Button>
        </Container>

        <Box className="mt-auto hidden sm:block">
          <Footer variant="default" />
        </Box>
      </Box>
    )
  }

  return (
    <Box className="flex grow flex-col">
      <Container className="overflow-x-hidden">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="sm:mt-6">
        {/* Header — desktop only, mobile has it in the app header */}
        <Box className="hidden items-center gap-3 sm:flex">
          <Heading level={2} size="lg">
            Корзина
          </Heading>
          <Chip variant="outline-default" size="sm" rounded="full">
            {pluralizeItems(cartProducts.reduce((s, p) => s + p.quantity, 0))}
          </Chip>
        </Box>

        {/* Main content + sidebar aligned to selection bar */}
        <Box className="mt-4 flex items-start gap-8">
          <Box className="min-w-0 flex-1">
            {/* Selection bar */}
            <CartSelectionBar
              selectedCount={effectiveSelectedIds.size}
              totalCount={cartProducts.length}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onDeleteSelected={deleteSelected}
              onShareSelected={shareSelected}
            />

            {/* Product groups */}
            {inStockProducts.length > 0 && (
              <CartGroup
                label="В наличии"
                dotColor="bg-success-500"
                products={inStockProducts}
                selectedIds={effectiveSelectedIds}
                onToggleSelect={toggleSelect}
                className="mt-4"
              />
            )}

            {preOrderProducts.length > 0 && (
              <CartGroup
                label="Под заказ"
                dotColor="bg-warning-500"
                products={preOrderProducts}
                selectedIds={effectiveSelectedIds}
                onToggleSelect={toggleSelect}
                className="mt-8"
                badge="15 – 20 дней"
              />
            )}
          </Box>

          {/* Order summary sidebar — desktop only */}
          <Box className="hidden w-85 shrink-0 lg:block">
            <Box className="sticky top-6">
              <CartSummary totalItems={totalItems} subtotal={subtotal + discount} discount={discount} />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Mobile order summary */}
      <Container className="mt-4 lg:hidden">
        <CartSummary totalItems={totalItems} subtotal={subtotal + discount} discount={discount} />
      </Container>

      <Box className="mt-auto">
        <Footer variant="default" />
      </Box>
    </Box>
  )
}
