"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CameraOutlineIcon } from "@/shared/icons";
import { useCartStore } from "@/shared/lib/stores";
import { Box, Text } from "@/shared/ui/kit";
import type { Product } from "@/screens/catalog/model";

type CartItemProps = {
  product: Product;
};

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU");
}

export function CartItem({ product }: CartItemProps) {
  const quantity = useCartStore((s) => s.items.get(product.id) ?? 1);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  const totalPrice = product.price * quantity;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 sm:gap-6 sm:p-5">
      {/* Product image */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#F3F7FF] sm:size-24">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CameraOutlineIcon className="size-8 text-[#BDCAE5]" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="min-w-0 flex-1">
        <Text className="text-sm font-semibold sm:text-base">
          {product.name}
        </Text>
        {product.article && (
          <Text size="xs" variant="secondary" className="mt-0.5">
            Арт. {product.article}
          </Text>
        )}
        <Text size="xs" variant="secondary">
          {product.brand}
        </Text>
      </div>

      {/* Quantity counter */}
      <div className="flex shrink-0 items-center gap-0">
        <button
          type="button"
          onClick={() => decrement(product.id)}
          className="flex size-9 cursor-pointer items-center justify-center rounded-l-lg border border-border-default text-tertiary transition-colors hover:bg-gray-50"
        >
          <Minus className="size-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center border-y border-border-default text-sm font-medium">
          {quantity}
        </div>
        <button
          type="button"
          onClick={() => increment(product.id)}
          className="flex size-9 cursor-pointer items-center justify-center rounded-r-lg border border-border-default text-tertiary transition-colors hover:bg-gray-50"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Price */}
      <div className="hidden w-28 shrink-0 text-right sm:block">
        <Box className="text-base font-bold">
          {formatPrice(totalPrice)} ₽
        </Box>
        {quantity > 1 && (
          <Text size="xs" variant="secondary" className="mt-0.5">
            {formatPrice(product.price)} ₽ / шт.
          </Text>
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => remove(product.id)}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-disabled transition-colors hover:text-danger-500"
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
