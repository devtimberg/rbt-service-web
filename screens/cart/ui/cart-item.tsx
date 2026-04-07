"use client";

import type { Product } from "@/screens/catalog/model";
import { CameraOutlineIcon, DeleteIcon } from "@/shared/icons";
import { useCartStore } from "@/shared/lib/stores";
import { formatPrice } from "@/shared/lib/utils";
import { Box, Checkbox, IconButton, Text } from "@/shared/ui/kit";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
  product: Product;
  isSelected: boolean;
  onToggleSelectAction: (id: string) => void;
};

export function CartItem({
  product,
  isSelected,
  onToggleSelectAction,
}: CartItemProps) {
  const quantity = useCartStore((s) => s.items.get(product.id) ?? 1);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  const totalPrice = product.price * quantity;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-white p-2 sm:gap-4
        sm:p-1 sm:pr-4"
    >
      {/* Product image + checkbox */}
      <div className="relative shrink-0 sm:h-21.25 sm:w-28.75">
        {/* SVG clip-path: rectangle with rounded corners + top-left notch for checkbox */}
        <svg
          className="absolute"
          width="0"
          height="0"
        >
          <defs>
            <clipPath
              id="cart-img-clip"
              clipPathUnits="objectBoundingBox"
            >
              <path d="M1 .859 C1 .937 .953 1 .895 1 H.107 C.05 1 .003 .937 .003 .86 L0 .368 C0 .316 .031 .274 .07 .274 H.169 C.188 .274 .203 .253 .204 .227 L.206 .092 C.207 .041 .238 0 .275 0 H.895 C.953 0 1 .063 1 .141 V.859 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Image with cutout for checkbox */}
        <div
          className="absolute inset-0 overflow-hidden bg-[#F3F7FF]"
          style={{ clipPath: "url(#cart-img-clip)" }}
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

        {/* Checkbox */}
        <div className="absolute top-0.25 left-0.5 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelectAction(product.id)}
          />
        </div>
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
          <IconButton
            variant="default"
            size="md"
            icon={DeleteIcon}
            iconSize={20}
            onClick={() => remove(product.id)}
            className="shrink-0 rounded-lg sm:hidden"
          />
        </div>

        {/* Price + Counter row on mobile */}
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div
            className="flex h-9 flex-col justify-center sm:w-28 sm:shrink-0
              sm:text-right"
          >
            <Box className="text-sm font-bold sm:text-base">
              {formatPrice(totalPrice)} ₽
            </Box>
            {quantity > 1 && (
              <Text
                size="xs"
                variant="secondary"
                className="mt-0.5"
              >
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
        <IconButton
          variant="default"
          size="md"
          icon={DeleteIcon}
          iconSize={20}
          onClick={() => remove(product.id)}
          className="hidden shrink-0 rounded-lg sm:inline-flex"
        />
      </div>
    </div>
  );
}
