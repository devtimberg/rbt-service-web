import { formatPrice } from "@/shared/lib/utils";
import { Button, Text } from "@/shared/ui/kit";

type CartSummaryProps = {
  totalItems: number;
  subtotal: number;
  discount: number;
};

export function CartSummary({
  totalItems,
  subtotal,
  discount,
}: CartSummaryProps) {
  const total = subtotal - discount;

  return (
    <div className="space-y-4">
      {/* Button + hint */}
      <div className="rounded-2xl bg-white p-4">
        <Button
          variant="primary"
          size="full"
          className="h-12 rounded-xl text-base"
        >
          Перейти к оформлению
        </Button>
        <Text size="xs" variant="secondary" className="mt-3 text-center">
          Доступные способы и время доставки можно выбрать при оформлении заказа
        </Text>
      </div>

      {/* Order details */}
      <div className="rounded-2xl bg-white p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-semibold">Ваша корзина</h3>
          <Text size="xs" variant="secondary">
            {totalItems} шт.
          </Text>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Text size="sm" variant="secondary">
              Товары ({totalItems})
            </Text>
            <Text size="sm" className="font-medium">
              {formatPrice(subtotal)} ₽
            </Text>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between">
              <Text size="sm" variant="secondary">
                Скидка
              </Text>
              <Text size="sm" className="font-medium">
                − {formatPrice(discount)} ₽
              </Text>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Text size="sm" variant="secondary">
              Самовывоз
            </Text>
            <Text size="sm" className="font-semibold">
              Бесплатно
            </Text>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4">
          <Text className="font-semibold">Итого</Text>
          <Text className="text-lg font-bold">{formatPrice(total)} ₽</Text>
        </div>
      </div>
    </div>
  );
}
