"use client";

import type { Product } from "@/screens/catalog/model";
import { CameraOutlineIcon, DeleteIcon } from "@/shared/icons";
import { useCartStore } from "@/shared/lib/stores";
import { formatPrice } from "@/shared/lib/utils";
import { Box, Text } from "@/shared/ui/kit";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
  product: Product;
};

export function CartItem({ product }: CartItemProps) {
  const quantity = useCartStore((s) => s.items.get(product.id) ?? 1);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  const totalPrice = product.price * quantity;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-white p-2 sm:gap-6
        sm:p-1 sm:pr-4"
    >
      {/* Product image */}
      <div
        className="relative size-22.5 shrink-0 overflow-hidden rounded-xl
          bg-[#F3F7FF] sm:h-22.5 sm:w-30"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="120px"
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

      {/* Right side — stacks vertically on mobile, row on desktop */}
      <div
        className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1.5
          sm:flex-row sm:items-center sm:gap-6 sm:py-0"
      >
        {/* Product info */}
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div className="min-w-0 flex-1">
            <Text className="text-sm font-semibold sm:text-base">
              {product.name}
            </Text>
            {product.article && (
              <Text
                size="xs"
                variant="secondary"
                className="mt-0.5"
              >
                Арт. {product.article}
              </Text>
            )}
            <Text
              size="xs"
              variant="secondary"
            >
              {product.brand}
            </Text>
          </div>

          {/* Delete button — top-right on mobile */}
          <button
            type="button"
            onClick={() => remove(product.id)}
            className="text-disabled hover:text-danger-500 flex size-9 shrink-0
              cursor-pointer items-center justify-center rounded-lg
              transition-colors sm:hidden"
          >
            <DeleteIcon className="size-6 text-[#DAE3F5]" />
          </button>
        </div>

        {/* Price + Counter row on mobile */}
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex h-9 flex-col justify-center sm:w-28 sm:shrink-0 sm:text-right">
            <Box className="text-sm font-bold sm:text-base">
              {formatPrice(totalPrice)} ₽
            </Box>
            {quantity > 1 && (
              <Text size="xs" variant="secondary" className="mt-0.5">
                {formatPrice(product.price)} ₽ / шт.
              </Text>
            )}
          </div>

          {/* Quantity counter */}
          <div
            className="flex shrink-0 items-center gap-0 rounded-lg bg-[#F3F7FF]"
          >
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => decrement(product.id)}
              className="text-tertiary disabled:text-disabled/40 flex size-9
                cursor-pointer items-center justify-center rounded-l-lg
                disabled:cursor-default"
            >
              <Minus className="size-4" />
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center text-sm
                font-medium"
            >
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => increment(product.id)}
              className="text-tertiary flex size-9 cursor-pointer items-center
                justify-center rounded-r-lg"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Delete button — inline on desktop */}
        <button
          type="button"
          onClick={() => remove(product.id)}
          className="text-disabled hover:text-danger-500 hidden size-9 shrink-0
            cursor-pointer items-center justify-center rounded-lg
            transition-colors sm:flex"
        >
          <DeleteIcon className="size-6 text-[#DAE3F5]" />
        </button>
      </div>
    </div>
  );
}
