import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import type { Product } from '@/entities/product'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/format-price'
import { Box, Button, IconButton, CameraOutlineIcon, HeartIcon, HeartOutlineIcon, Image, Text } from '@/shared/ui'
import styles from './product-card.module.css'

type ProductCardProps = {
  product: Product
}

const availabilityConfig = {
  'in-stock': {
    label: 'В наличии',
    className: styles.inStock,
    dot: styles.dotInStock,
  },
  'low-stock': {
    label: 'Мало',
    className: styles.lowStock,
    dot: styles.dotLowStock,
  },
  'pre-order': {
    label: 'Под заказ',
    className: styles.preOrder,
    dot: styles.dotPreOrder,
  },
} as const

/** Карточка товара: избранное и корзина через стор-сущности. Используется каталогом и избранным. */
export function ProductCard({ product }: ProductCardProps) {
  const availability = availabilityConfig[product.availability]
  const isFavorite = useFavoritesStore((s) => s.items.has(product.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const isInCart = useCartStore((s) => s.items.has(product.id))
  const toggleCart = useCartStore((s) => s.toggle)

  return (
    <Box className={styles.root}>
      {/* Image area */}
      <Box className={styles.imageArea}>
        <IconButton
          variant="ghost"
          icon={isFavorite ? HeartIcon : HeartOutlineIcon}
          size="lg"
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(product.id)}
          className={cn(styles.heart, isFavorite ? styles.heartActive : styles.heartIdle)}
        />
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={styles.image}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <Box className={styles.placeholder}>
            <CameraOutlineIcon className={styles.placeholderIcon} />
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box className={styles.content}>
        <Text className={styles.brand}>{product.brand}</Text>

        {/* Price */}
        <Box className={styles.priceRow}>
          <Box className={styles.price}>{formatPrice(product.price)} ₽</Box>
          {product.oldPrice && <Box className={styles.oldPrice}>{formatPrice(product.oldPrice)} ₽</Box>}
        </Box>

        {/* Availability */}
        <Box className={cn(styles.availability, availability.className)}>
          <Box className={cn(styles.dot, availability.dot)} />
          {availability.label}
        </Box>

        {/* Name */}
        <Text className={styles.name}>{product.name}</Text>

        {/* Action button */}
        <Box className={styles.action}>
          {isInCart ? (
            <Button variant="secondary" size="full" className={styles.actionButton} href={ROUTES.CART}>
              В корзине
            </Button>
          ) : (
            <Button
              variant="primary"
              size="full"
              className={styles.actionButton}
              onClick={() => toggleCart(product.id)}
            >
              {product.preOrderDate ?? 'В корзину'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
