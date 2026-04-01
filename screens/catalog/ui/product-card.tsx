"use client";

import Image from "next/image";
import Link from "next/link";
import { CameraOutlineIcon, HeartIcon, HeartOutlineIcon } from "@/shared/icons";
import { ROUTES } from "@/shared/lib/routes";
import { useCartStore, useFavoritesStore } from "@/shared/lib/stores";
import { cn } from "@/shared/lib/utils";
import { Box, Button, IconButton, Text } from "@/shared/ui/kit";
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
  const isFavorite = useFavoritesStore((s) => s.items.has(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isInCart = useCartStore((s) => s.items.has(product.id));
  const toggleCart = useCartStore((s) => s.toggle);

  return (
    <Box className="flex flex-col overflow-hidden rounded-2xl bg-white p-1">
      {/* Image area */}
      <Box className="relative! aspect-square rounded-t-xl bg-[#F3F7FF]">
        <IconButton
          variant="ghost"
          icon={isFavorite ? HeartIcon : HeartOutlineIcon}
          size="lg"
          onClick={() => toggleFavorite(product.id)}
          className={cn(
            "absolute! top-0 right-0 z-10",
            isFavorite
              ? "text-secondary-500"
              : "text-primary-900 [&_path]:fill-white",
          )}
        />
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="rounded-t-xl object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <Box className="flex h-full items-center justify-center">
            <CameraOutlineIcon className="size-12 text-[#BDCAE5]" />
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box className="mt-1 flex flex-1 flex-col gap-1 p-1">
        <Text
          size="xs"
          variant="secondary"
          className="truncate"
        >
          {product.brand}
        </Text>

        {/* Price */}
        <Box className="flex items-baseline gap-2">
          <Box className="text-base font-semibold">
            {formatPrice(product.price)} ₽
          </Box>
          {product.oldPrice && (
            <Box className="text-disabled text-sm line-through">
              {formatPrice(product.oldPrice)} ₽
            </Box>
          )}
        </Box>

        {/* Availability */}
        <Box
          className={cn(
            "flex items-center gap-1.5 text-xs",
            availability.className,
          )}
        >
          <Box className={cn("size-1.5 rounded-full", availability.dot)} />
          {availability.label}
        </Box>

        {/* Name */}
        <Text
          size="sm"
          className="mt-1 line-clamp-2 min-h-10 text-[13px] font-semibold"
        >
          {product.name}
        </Text>

        {/* Action button */}
        <div className="mt-auto pt-2">
          {isInCart ? (
            <Button
              variant="secondary"
              size="full"
              className="rounded-md text-sm"
              asChild
            >
              <Link href={ROUTES.CART}>В корзине</Link>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="full"
              className="rounded-md text-sm"
              onClick={() => toggleCart(product.id)}
            >
              {product.preOrderDate ?? "В корзину"}
            </Button>
          )}
        </div>
      </Box>
    </Box>
  );
}
