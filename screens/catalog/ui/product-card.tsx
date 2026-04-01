"use client";

import { HeartIcon } from "@/shared/icons";
import { Button, Text } from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";
import type { Product } from "../model";

type ProductCardProps = {
  product: Product;
};

const availabilityConfig = {
  "in-stock": {
    label: "В наличии",
    className: "text-success-700",
    dot: "bg-success-500",
  },
  "low-stock": {
    label: "Мало",
    className: "text-danger-700",
    dot: "bg-danger-500",
  },
  "pre-order": {
    label: "Под заказ",
    className: "text-tertiary",
    dot: "bg-disabled",
  },
} as const;

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU");
}

export function ProductCard({ product }: ProductCardProps) {
  const availability = availabilityConfig[product.availability];

  return (
    <div
      className="border-border-subtle flex flex-col overflow-hidden rounded-2xl
        border bg-white"
    >
      {/* Image area */}
      <div className="bg-surface-subtle relative aspect-square p-4">
        <div className="text-disabled flex h-full items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="size-12"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
            />
            <circle
              cx="8.5"
              cy="8.5"
              r="1.5"
            />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
        <button
          className="absolute top-3 right-3 flex size-8 items-center
            justify-center rounded-full bg-white/80 backdrop-blur-sm"
        >
          <HeartIcon
            className={cn(
              "size-5",
              product.isFavorite
                ? "fill-secondary-500 text-secondary-500"
                : "text-primary-300",
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Text
          size="xs"
          variant="secondary"
          className="truncate"
        >
          {product.brand}
        </Text>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">
            {formatPrice(product.price)} ₽
          </span>
          {product.oldPrice && (
            <span className="text-disabled text-sm line-through">
              {formatPrice(product.oldPrice)} ₽
            </span>
          )}
        </div>

        {/* Availability */}
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs",
            availability.className,
          )}
        >
          <span className={cn("size-1.5 rounded-full", availability.dot)} />
          {availability.label}
        </div>

        {/* Name */}
        <Text
          size="sm"
          className="mt-1 line-clamp-2 min-h-[40px]"
        >
          {product.name}
        </Text>

        {/* Action button */}
        <div className="mt-auto pt-2">
          {product.availability === "pre-order" ? (
            <Button
              variant="secondary"
              size="full"
              rounded="full"
              className="text-sm"
            >
              {product.preOrderDate}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="full"
              rounded="full"
              className="text-sm"
            >
              В корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
