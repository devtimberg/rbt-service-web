import { useCallback, useMemo, useState } from 'react'
import { useCartStore } from '@/entities/cart'
import { MOCK_PRODUCTS, type Product } from '@/entities/product'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { usePersistHydrated } from '@/shared/lib/use-persist-hydrated'
import { Box, Breadcrumb, Button, Chip, Container, Heading, BagIcon, LineBreak, Text } from '@/shared/ui'
import { Footer } from '@/widgets/footer'
import { calcCartTotals } from '../model/totals'
import { CartItem } from './cart-item'
import { CartSelectionBar } from './cart-selection-bar'
import { CartSummary } from './cart-summary'
import styles from './cart-page.module.css'

const BREADCRUMB_ITEMS = [{ label: 'Корзина' }]

function CartGroup({
  label,
  dotClassName,
  products,
  selectedIds,
  onToggleSelect,
  className,
  badge,
}: {
  label: string
  dotClassName: string
  products: (Product & { quantity: number })[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  className?: string
  badge?: string
}) {
  return (
    <Box className={cn(styles.group, className)}>
      <Box className={styles.groupHeader}>
        <Box className={cn(styles.dot, dotClassName)} />
        <Text className={styles.groupLabel}>{label}</Text>
        <Text className={styles.groupCount}>{pluralizeItems(products.reduce((s, p) => s + p.quantity, 0))}</Text>
        {badge && (
          <Text as="span" className={styles.badge}>
            {badge}
          </Text>
        )}
      </Box>

      <Box className={styles.items}>
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
      <Box className={styles.root}>
        <Container className={styles.breadcrumb}>
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </Container>

        <Container className={styles.empty}>
          <BagIcon className={styles.emptyIcon} />
          <Text className={styles.emptyTitle}>Корзина пуста</Text>
          <Text className={styles.emptyText}>
            Добавьте товары из каталога, <LineBreak className={styles.emptyBreak} />
            чтобы оформить заказ
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
    <Box className={styles.root}>
      <Container className={styles.breadcrumb}>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className={styles.main}>
        {/* Header — desktop only, mobile has it in the app header */}
        <Box className={styles.header}>
          <Heading level={2} size="lg">
            Корзина
          </Heading>
          <Chip variant="outline-default" size="sm" rounded="full">
            {pluralizeItems(cartProducts.reduce((s, p) => s + p.quantity, 0))}
          </Chip>
        </Box>

        {/* Main content + sidebar aligned to selection bar */}
        <Box className={styles.layout}>
          <Box className={styles.content}>
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
                dotClassName={styles.dotInStock}
                products={inStockProducts}
                selectedIds={effectiveSelectedIds}
                onToggleSelect={toggleSelect}
                className={styles.groupInStock}
              />
            )}

            {preOrderProducts.length > 0 && (
              <CartGroup
                label="Под заказ"
                dotClassName={styles.dotPreOrder}
                products={preOrderProducts}
                selectedIds={effectiveSelectedIds}
                onToggleSelect={toggleSelect}
                className={styles.groupPreOrder}
                badge="15 – 20 дней"
              />
            )}
          </Box>

          {/* Order summary sidebar — desktop only */}
          <Box className={styles.sidebar}>
            <Box className={styles.sidebarSticky}>
              <CartSummary totalItems={totalItems} subtotal={subtotal + discount} discount={discount} />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Mobile order summary */}
      <Container className={styles.mobileSummary}>
        <CartSummary totalItems={totalItems} subtotal={subtotal + discount} discount={discount} />
      </Container>

      <Box className={styles.footer}>
        <Footer variant="default" />
      </Box>
    </Box>
  )
}
