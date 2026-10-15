import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import type { Product } from '@/entities/product'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/formatPrice'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { CameraOutlineIcon, HeartIcon, HeartOutlineIcon } from '@/shared/ui/icons'
import { Text } from '@/shared/ui/Text'

type ProductCardProps = {
  product: Product
}

const availabilityConfig = {
  'in-stock': {
    label: 'В наличии',
    className: 'text-success-700',
    dot: 'bg-success-500',
  },
  'low-stock': {
    label: 'Мало',
    className: 'text-danger-700',
    dot: 'bg-danger-500',
  },
  'pre-order': {
    label: 'Под заказ',
    className: 'text-tertiary',
    dot: 'bg-disabled',
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
    <Box className="flex flex-col overflow-hidden rounded-2xl bg-white p-1">
      {/* Image area */}
      <Box className="relative! aspect-square rounded-t-xl bg-[#F3F7FF]">
        <IconButton
          variant="ghost"
          icon={isFavorite ? HeartIcon : HeartOutlineIcon}
          size="lg"
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(product.id)}
          className={cn(
            'absolute! top-0 right-0 z-10',
            isFavorite ? 'text-secondary-500' : 'text-primary-900 [&_path]:fill-white',
          )}
        />
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 size-full rounded-t-xl object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <Box className="flex h-full items-center justify-center">
            <CameraOutlineIcon className="size-12 text-[#BDCAE5]" />
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box className="mt-1 flex flex-1 flex-col gap-1 p-1">
        <Text size="xs" variant="secondary" className="truncate">
          {product.brand}
        </Text>

        {/* Price */}
        <Box className="flex items-baseline gap-2">
          <Box className="text-base font-semibold">{formatPrice(product.price)} ₽</Box>
          {product.oldPrice && (
            <Box className="text-disabled text-sm line-through">{formatPrice(product.oldPrice)} ₽</Box>
          )}
        </Box>

        {/* Availability */}
        <Box className={cn('flex items-center gap-1.5 text-xs', availability.className)}>
          <Box className={cn('size-1.5 rounded-full', availability.dot)} />
          {availability.label}
        </Box>

        {/* Name */}
        <Text size="sm" className="mt-1 line-clamp-2 min-h-10 text-[13px] font-semibold">
          {product.name}
        </Text>

        {/* Action button */}
        <div className="mt-auto pt-2">
          {isInCart ? (
            <Button variant="secondary" size="full" className="rounded-md text-sm" href={ROUTES.CART}>
              В корзине
            </Button>
          ) : (
            <Button variant="primary" size="full" className="rounded-md text-sm" onClick={() => toggleCart(product.id)}>
              {product.preOrderDate ?? 'В корзину'}
            </Button>
          )}
        </div>
      </Box>
    </Box>
  )
}
