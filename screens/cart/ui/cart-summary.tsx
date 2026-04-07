import { formatPrice } from "@/shared/lib/utils";
import { Button, Text } from "@/shared/ui/kit";

type CartSummaryProps = {
  totalItems: number;
  subtotal: number;
  discount: number;
};

export function CartSummary({ totalItems, subtotal, discount }: CartSummaryProps) {
  const total = subtotal - discount;

  return (
    <div className="rounded-2xl border border-border-default bg-white p-6">
      <h3 className="text-lg font-semibold">Итого заказа</h3>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <Text size="sm" variant="secondary">
            Товары ({totalItems} шт.)
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
            <Text size="sm" className="font-medium text-danger-500">
              − {formatPrice(discount)} ₽
            </Text>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Text size="sm" variant="secondary">
            Самовывоз
          </Text>
          <Text size="sm" className="font-semibold text-success-700">
            Бесплатно
          </Text>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4">
        <Text className="font-semibold">Итого</Text>
        <Text className="text-lg font-bold">
          {formatPrice(total)} ₽
        </Text>
      </div>

      <Button
        variant="default"
        size="full"
        className="mt-5 h-12 rounded-xl text-base"
      >
        Оформить заказ
      </Button>
    </div>
  );
}
