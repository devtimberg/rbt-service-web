import { formatPrice } from '@/shared/lib/formatPrice'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Heading } from '@/shared/ui/Heading'
import { InformationIcon } from '@/shared/ui/icons'
import { Text } from '@/shared/ui/Text'

type CartSummaryProps = {
  totalItems: number
  subtotal: number
  discount: number
}

export function CartSummary({ totalItems, subtotal, discount }: CartSummaryProps) {
  const total = subtotal - discount
  const hasSelection = totalItems > 0

  return (
    <Box className="space-y-4">
      {/* Button + hint */}
      <Box className="rounded-2xl bg-white p-4">
        <Button
          variant={hasSelection ? 'primary' : 'disabled'}
          size="full"
          className="h-12 rounded-xl text-base"
          disabled={!hasSelection}
        >
          Перейти к оформлению
        </Button>
        {hasSelection ? (
          <Text className="cursor-default font-normal text-secondary text-xs mt-3 text-center">
            Доступные способы и время доставки можно выбрать при оформлении заказа
          </Text>
        ) : (
          <Box
            className="mt-3 flex items-center gap-2 rounded-lg bg-[#F0F4FF] px-3
              py-2.5"
          >
            <InformationIcon className="text-tertiary size-5 shrink-0" />
            <Text className="cursor-default font-normal text-secondary text-xs">
              Выберите товары, чтобы перейти к оформлению заказа
            </Text>
          </Box>
        )}
      </Box>

      {/* Order details — only when items selected */}
      {hasSelection && (
        <Box className="rounded-2xl bg-white p-4">
          <Box className="flex items-baseline justify-between">
            <Heading level={3} className="text-base font-semibold">
              Ваша корзина
            </Heading>
            <Text className="cursor-default font-normal text-secondary text-xs">{totalItems} шт.</Text>
          </Box>

          <Box className="mt-4 space-y-3">
            <Box className="flex items-center justify-between">
              <Text className="cursor-default font-normal text-secondary text-sm">Товары ({totalItems})</Text>
              <Text className="cursor-default text-primary text-sm font-medium">{formatPrice(subtotal)} ₽</Text>
            </Box>

            {discount > 0 && (
              <Box className="flex items-center justify-between">
                <Text className="cursor-default font-normal text-secondary text-sm">Скидка</Text>
                <Text className="cursor-default text-primary text-sm font-medium">− {formatPrice(discount)} ₽</Text>
              </Box>
            )}

            <Box className="flex items-center justify-between">
              <Text className="cursor-default font-normal text-secondary text-sm">Самовывоз</Text>
              <Text className="cursor-default text-primary text-sm font-semibold">Бесплатно</Text>
            </Box>
          </Box>

          <Box
            className="border-border-default mt-4 flex items-center
              justify-between border-t pt-4"
          >
            <Text className="cursor-default text-primary text-base font-semibold">Итого</Text>
            <Text className="cursor-default text-primary text-lg font-bold">{formatPrice(total)} ₽</Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}
