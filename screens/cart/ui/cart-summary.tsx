import { InformationIcon } from "@/shared/icons";
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
  const hasSelection = totalItems > 0;

  return (
    <div className="space-y-4">
      {/* Button + hint */}
      <div className="rounded-2xl bg-white p-4">
        <Button
          variant={hasSelection ? "primary" : "disabled"}
          size="full"
          className="h-12 rounded-xl text-base"
          disabled={!hasSelection}
        >
          Перейти к оформлению
        </Button>
        {hasSelection ? (
          <Text
            size="xs"
            variant="secondary"
            className="mt-3 text-center"
          >
            Доступные способы и время доставки можно выбрать при оформлении
            заказа
          </Text>
        ) : (
          <div
            className="mt-3 flex items-center gap-2 rounded-lg bg-[#F0F4FF] px-3
              py-2.5"
          >
            <InformationIcon className="text-tertiary size-5 shrink-0" />
            <Text
              size="xs"
              variant="secondary"
            >
              Выберите товары, чтобы перейти к оформлению заказа
            </Text>
          </div>
        )}
      </div>

      {/* Order details — only when items selected */}
      {hasSelection && (
        <div className="rounded-2xl bg-white p-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-semibold">Ваша корзина</h3>
            <Text
              size="xs"
              variant="secondary"
            >
              {totalItems} шт.
            </Text>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Text
                size="sm"
                variant="secondary"
              >
                Товары ({totalItems})
              </Text>
              <Text
                size="sm"
                className="font-medium"
              >
                {formatPrice(subtotal)} ₽
              </Text>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between">
                <Text
                  size="sm"
                  variant="secondary"
                >
                  Скидка
                </Text>
                <Text
                  size="sm"
                  className="font-medium"
                >
                  − {formatPrice(discount)} ₽
                </Text>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Text
                size="sm"
                variant="secondary"
              >
                Самовывоз
              </Text>
              <Text
                size="sm"
                className="font-semibold"
              >
                Бесплатно
              </Text>
            </div>
          </div>

          <div
            className="border-border-default mt-4 flex items-center
              justify-between border-t pt-4"
          >
            <Text className="font-semibold">Итого</Text>
            <Text className="text-lg font-bold">{formatPrice(total)} ₽</Text>
          </div>
        </div>
      )}
    </div>
  );
}
