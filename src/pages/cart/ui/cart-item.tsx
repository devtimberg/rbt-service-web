import { useState } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import type { Product } from '@/entities/product'
import { formatPrice } from '@/shared/lib/formatPrice'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { ClipPathDefs } from '@/shared/ui/ClipPathDefs'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { IconButton } from '@/shared/ui/IconButton'
import { CameraOutlineIcon, DeleteIcon, HeartIcon, MinusIcon, PlusIcon } from '@/shared/ui/icons'
import { Image } from '@/shared/ui/Image'
import { Text } from '@/shared/ui/Text'

type CartItemProps = {
  product: Product
  isSelected: boolean
  onToggleSelectAction: (id: string) => void
}

export function CartItem({ product, isSelected, onToggleSelectAction }: CartItemProps) {
  const quantity = useCartStore((s) => s.items.get(product.id) ?? 1)
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const remove = useCartStore((s) => s.remove)
  const isFavorite = useFavoritesStore((s) => s.items.has(product.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const totalPrice = product.price * quantity

  const clipPath =
    'M1 .891C1 .951 .953 1 .895 1H.108C.05 1 .004 .951 .003 .892L0 .284C0 .244 .031 .211 .07 .211H.169C.188 .211 .204 .195 .204 .176L.206 .071C.207 .032 .238 0 .276 0H.895C.953 0 1 .049 1 .109V.891Z'

  const renderImageBlock = (variant: 'desktop' | 'mobile') => {
    const clipId = `cart-img-clip-${product.id}-${variant}`
    return (
      <Box className="relative h-27.5 w-28.75 shrink-0 self-start">
        <ClipPathDefs id={clipId} d={clipPath} />

        <Box className="absolute inset-0 overflow-hidden bg-[#F3F7FF]" style={{ clipPath: `url(#${clipId})` }}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <Box className="flex h-full items-center justify-center">
              <CameraOutlineIcon className="size-8 text-[#BDCAE5]" />
            </Box>
          )}
        </Box>

        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelectAction(product.id)}
          className="absolute top-px left-0.5 z-10"
        />
      </Box>
    )
  }

  const actions = (
    <Box className="flex items-center gap-2">
      <IconButton
        variant="filled"
        size="sm"
        icon={HeartIcon}
        iconSize={20}
        onClick={() => toggleFavorite(product.id)}
        className={`shrink-0 rounded-lg
          ${isFavorite ? 'text-secondary-500' : ''}`}
      />
      <IconButton
        variant="filled"
        size="sm"
        icon={DeleteIcon}
        iconSize={20}
        onClick={() => setShowDeleteConfirm(true)}
        className="shrink-0 rounded-lg"
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Удалить товар?"
        description={product.name}
        confirmLabel="Удалить"
        onConfirm={() => remove(product.id)}
      />
    </Box>
  )

  const counter = (
    <Box className="flex shrink-0 items-center gap-0 rounded-lg bg-[#F3F7FF]">
      <Button
        variant="unstyled"
        type="button"
        disabled={quantity <= 1}
        onClick={() => decrement(product.id)}
        className="text-primary-900 disabled:text-disabled/40 flex size-9
          cursor-pointer items-center justify-center rounded-l-lg
          disabled:cursor-default sm:size-10"
      >
        <MinusIcon className="size-4" />
      </Button>
      <Box
        className="flex h-9 w-9 items-center justify-center text-sm font-medium
          sm:h-10 sm:w-10"
      >
        {quantity}
      </Box>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => increment(product.id)}
        className="text-primary-900 flex size-9 cursor-pointer items-center
          justify-center rounded-r-lg sm:size-10"
      >
        <PlusIcon className="size-4" />
      </Button>
    </Box>
  )

  const priceBlock = (
    <Box>
      <Box className="text-lg font-bold sm:text-base">{formatPrice(totalPrice)} ₽</Box>
      {quantity > 1 && (
        <Text className="cursor-default font-normal text-secondary text-xs">{formatPrice(product.price)} ₽ / шт.</Text>
      )}
    </Box>
  )

  return (
    <>
      {/* Desktop layout */}
      <Box className="hidden sm:flex sm:items-start sm:gap-4">
        {renderImageBlock('desktop')}
        <Box className="min-w-0 flex-1">
          <Text className="cursor-default text-primary text-base font-semibold">{product.name}</Text>
          {product.article && (
            <Text className="cursor-default font-normal text-secondary text-xs mt-0.5">Арт. {product.article}</Text>
          )}
          <Text className="cursor-default font-normal text-secondary text-xs">{product.brand}</Text>
          <Box className="mt-3">{actions}</Box>
        </Box>
        <Box className="flex items-center gap-8 text-right">
          {priceBlock}
          {counter}
        </Box>
      </Box>

      {/* Mobile layout */}
      <Box className="flex flex-col gap-3 sm:hidden">
        <Box className="flex gap-4">
          {renderImageBlock('mobile')}
          <Box className="min-w-0 flex-1">
            <Text className="cursor-default text-primary text-sm font-semibold">{product.name}</Text>
            {product.article && (
              <Text className="cursor-default font-normal text-secondary text-xs mt-0.5">Арт. {product.article}</Text>
            )}
            <Text className="cursor-default font-normal text-secondary text-xs">{product.brand}</Text>
            <Box className="mt-2">{priceBlock}</Box>
          </Box>
        </Box>
        <Box className="flex items-center justify-between">
          {actions}
          {counter}
        </Box>
      </Box>
    </>
  )
}
