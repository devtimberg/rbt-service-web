import { useState } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import type { Product } from '@/entities/product'
import { cn } from '@/shared/lib/cn'
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
import styles from './cart-item.module.css'

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
      <Box className={styles.image}>
        <ClipPathDefs id={clipId} d={clipPath} />

        <Box className={styles.imageClip} style={{ clipPath: `url(#${clipId})` }}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={styles.photo}
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

        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelectAction(product.id)}
          className={styles.checkbox}
        />
      </Box>
    )
  }

  const actions = (
    <Box className={styles.actions}>
      <IconButton
        variant="filled"
        size="sm"
        icon={HeartIcon}
        iconSize={20}
        onClick={() => toggleFavorite(product.id)}
        className={cn(styles.actionButton, isFavorite && styles.favoriteActive)}
      />
      <IconButton
        variant="filled"
        size="sm"
        icon={DeleteIcon}
        iconSize={20}
        onClick={() => setShowDeleteConfirm(true)}
        className={styles.actionButton}
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
    <Box className={styles.counter}>
      <Button
        variant="unstyled"
        type="button"
        disabled={quantity <= 1}
        onClick={() => decrement(product.id)}
        className={cn(styles.counterButton, styles.minus)}
      >
        <MinusIcon className={styles.counterIcon} />
      </Button>
      <Box className={styles.quantity}>{quantity}</Box>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => increment(product.id)}
        className={cn(styles.counterButton, styles.plus)}
      >
        <PlusIcon className={styles.counterIcon} />
      </Button>
    </Box>
  )

  const priceBlock = (
    <Box>
      <Box className={styles.price}>{formatPrice(totalPrice)} ₽</Box>
      {quantity > 1 && <Text className={styles.unitPrice}>{formatPrice(product.price)} ₽ / шт.</Text>}
    </Box>
  )

  return (
    <>
      {/* Desktop layout */}
      <Box className={styles.desktop}>
        {renderImageBlock('desktop')}
        <Box className={styles.info}>
          <Text className={styles.name}>{product.name}</Text>
          {product.article && <Text className={cn(styles.meta, styles.article)}>Арт. {product.article}</Text>}
          <Text className={styles.meta}>{product.brand}</Text>
          <Box className={styles.desktopActions}>{actions}</Box>
        </Box>
        <Box className={styles.desktopSide}>
          {priceBlock}
          {counter}
        </Box>
      </Box>

      {/* Mobile layout */}
      <Box className={styles.mobile}>
        <Box className={styles.mobileTop}>
          {renderImageBlock('mobile')}
          <Box className={styles.info}>
            <Text className={cn(styles.name, styles.nameMobile)}>{product.name}</Text>
            {product.article && <Text className={cn(styles.meta, styles.article)}>Арт. {product.article}</Text>}
            <Text className={styles.meta}>{product.brand}</Text>
            <Box className={styles.mobilePrice}>{priceBlock}</Box>
          </Box>
        </Box>
        <Box className={styles.mobileBottom}>
          {actions}
          {counter}
        </Box>
      </Box>
    </>
  )
}
