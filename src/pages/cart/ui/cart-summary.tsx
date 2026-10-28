import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/format-price'
import { Box, Button, Heading, InformationIcon, Text } from '@/shared/ui'
import styles from './cart-summary.module.css'

type CartSummaryProps = {
  totalItems: number
  subtotal: number
  discount: number
}

export function CartSummary({ totalItems, subtotal, discount }: CartSummaryProps) {
  const total = subtotal - discount
  const hasSelection = totalItems > 0

  return (
    <Box className={styles.root}>
      {/* Button + hint */}
      <Box className={styles.card}>
        <Button
          variant={hasSelection ? 'primary' : 'disabled'}
          size="full"
          className={styles.checkout}
          disabled={!hasSelection}
        >
          Перейти к оформлению
        </Button>
        {hasSelection ? (
          <Text className={styles.hint}>Доступные способы и время доставки можно выбрать при оформлении заказа</Text>
        ) : (
          <Box className={styles.emptyHint}>
            <InformationIcon className={styles.emptyHintIcon} />
            <Text className={styles.emptyHintText}>Выберите товары, чтобы перейти к оформлению заказа</Text>
          </Box>
        )}
      </Box>

      {/* Order details — only when items selected */}
      {hasSelection && (
        <Box className={styles.card}>
          <Box className={styles.head}>
            <Heading level={3} className={styles.title}>
              Ваша корзина
            </Heading>
            <Text className={styles.count}>{totalItems} шт.</Text>
          </Box>

          <Box className={styles.rows}>
            <Box className={styles.row}>
              <Text className={styles.label}>Товары ({totalItems})</Text>
              <Text className={styles.value}>{formatPrice(subtotal)} ₽</Text>
            </Box>

            {discount > 0 && (
              <Box className={styles.row}>
                <Text className={styles.label}>Скидка</Text>
                <Text className={styles.value}>− {formatPrice(discount)} ₽</Text>
              </Box>
            )}

            <Box className={styles.row}>
              <Text className={styles.label}>Самовывоз</Text>
              <Text className={cn(styles.value, styles.valueStrong)}>Бесплатно</Text>
            </Box>
          </Box>

          <Box className={styles.total}>
            <Text className={styles.totalLabel}>Итого</Text>
            <Text className={styles.totalValue}>{formatPrice(total)} ₽</Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}
