"use client";

import type { Product } from "@/screens/catalog/model";
import {
  CameraOutlineIcon,
  DeleteIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "@/shared/icons";
import { useCartStore, useFavoritesStore } from "@/shared/lib/stores";
import { formatPrice } from "@/shared/lib/utils";
import { Box, Checkbox, ConfirmDialog, IconButton, Text } from "@/shared/ui/kit";
import Image from "next/image";
import { useState } from "react";

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
  const isFavorite = useFavoritesStore((s) => s.items.has(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalPrice = product.price * quantity;

  const clipPath =
    "M1 .891C1 .951 .953 1 .895 1H.108C.05 1 .004 .951 .003 .892L0 .284C0 .244 .031 .211 .07 .211H.169C.188 .211 .204 .195 .204 .176L.206 .071C.207 .032 .238 0 .276 0H.895C.953 0 1 .049 1 .109V.891Z";

  const renderImageBlock = (variant: "desktop" | "mobile") => {
    const clipId = `cart-img-clip-${product.id}-${variant}`;
    return (
      <div className="relative h-27.5 w-28.75 shrink-0 self-start">
        <svg
          className="absolute"
          width="0"
          height="0"
        >
          <defs>
            <clipPath
              id={clipId}
              clipPathUnits="objectBoundingBox"
            >
              <path d={clipPath} />
            </clipPath>
          </defs>
        </svg>

        <div
          className="absolute inset-0 overflow-hidden bg-[#F3F7FF]"
          style={{ clipPath: `url(#${clipId})` }}
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

        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelectAction(product.id)}
          className="absolute top-px left-0.5 z-10"
        />
      </div>
    );
  };

  const actions = (
    <div className="flex items-center gap-2">
      <IconButton
        variant="filled"
        size="sm"
        icon={HeartIcon}
        iconSize={20}
        onClick={() => toggleFavorite(product.id)}
        className={`shrink-0 rounded-lg ${isFavorite ? "text-secondary-500" : ""}`}
      />
      <IconButton
        variant="filled"
        size="sm"
        icon={DeleteIcon}
        iconSize={20}
        onClick={() => setShowDeleteConfirm(true)}
        className="shrink-0 rounded-lg"
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Удалить товар?"
        description={product.name}
        confirmLabel="Удалить"
        onConfirm={() => remove(product.id)}
      />
    </div>
  );

  const counter = (
    <div className="flex shrink-0 items-center gap-0 rounded-lg bg-[#F3F7FF]">
      <button
        type="button"
        disabled={quantity <= 1}
        onClick={() => decrement(product.id)}
        className="text-primary-900 disabled:text-disabled/40 flex size-9
          cursor-pointer items-center justify-center rounded-l-lg
          disabled:cursor-default sm:size-10"
      >
        <MinusIcon className="size-4" />
      </button>
      <div
        className="flex h-9 w-9 items-center justify-center text-sm font-medium
          sm:h-10 sm:w-10"
      >
        {quantity}
      </div>
      <button
        type="button"
        onClick={() => increment(product.id)}
        className="text-primary-900 flex size-9 cursor-pointer items-center
          justify-center rounded-r-lg sm:size-10"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );

  const priceBlock = (
    <div>
      <Box className="text-lg font-bold sm:text-base">
        {formatPrice(totalPrice)} ₽
      </Box>
      {quantity > 1 && (
        <Text
          size="xs"
          variant="secondary"
        >
          {formatPrice(product.price)} ₽ / шт.
        </Text>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden sm:flex sm:items-start sm:gap-4">
        {renderImageBlock("desktop")}
        <div className="min-w-0 flex-1">
          <Text className="text-base font-semibold">{product.name}</Text>
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
          <div className="mt-3">{actions}</div>
        </div>
        <div className="shrink-0 text-right">{priceBlock}</div>
        {counter}
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex gap-4">
          {renderImageBlock("mobile")}
          <div className="min-w-0 flex-1">
            <Text className="text-sm font-semibold">{product.name}</Text>
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
            <div className="mt-2">{priceBlock}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {actions}
          {counter}
        </div>
      </div>
    </>
  );
}
