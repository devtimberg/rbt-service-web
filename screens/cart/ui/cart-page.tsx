"use client";

import { useCallback, useMemo, useState } from "react";
import { BagIcon } from "@/shared/icons";
import { useCartStore } from "@/shared/lib/stores";
import {
  Box,
  Breadcrumb,
  Chip,
  Container,
  Heading,
  Text,
} from "@/shared/ui/kit";
import { Footer } from "@/widgets/footer";
import { MOCK_PRODUCTS } from "@/screens/catalog/model";
import type { Product } from "@/screens/catalog/model";
import { CartItem } from "./cart-item";
import { CartSelectionBar } from "./cart-selection-bar";
import { CartSummary } from "./cart-summary";

const BREADCRUMB_ITEMS = [{ label: "Корзина" }];

function pluralizeItems(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} товаров`;
  if (lastOne === 1) return `${count} товар`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} товара`;
  return `${count} товаров`;
}

export function CartPage() {
  const cartItems = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.remove);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set<string>(),
  );
  const [initialized, setInitialized] = useState(false);

  // Get products that are in the cart
  const cartProducts: (Product & { quantity: number })[] = useMemo(() => {
    const result: (Product & { quantity: number })[] = [];
    for (const [id, qty] of cartItems) {
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (product) {
        result.push({ ...product, quantity: qty });
      }
    }
    return result;
  }, [cartItems]);

  // Initialize selection with all items on first render with products
  if (!initialized && cartProducts.length > 0) {
    setSelectedIds(new Set(cartProducts.map((p) => p.id)));
    setInitialized(true);
  }

  // Keep selection in sync: remove IDs that are no longer in the cart
  const effectiveSelectedIds = useMemo(
    () => new Set([...selectedIds].filter((id) => cartItems.has(id))),
    [selectedIds, cartItems],
  );

  const inStockProducts = cartProducts.filter(
    (p) => p.availability === "in-stock" || p.availability === "low-stock",
  );
  const preOrderProducts = cartProducts.filter(
    (p) => p.availability === "pre-order",
  );

  // Compute totals from selected products only
  const selectedProducts = cartProducts.filter((p) =>
    effectiveSelectedIds.has(p.id),
  );
  const totalItems = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  const discount = selectedProducts.reduce((sum, p) => {
    if (p.oldPrice) {
      return sum + (p.oldPrice - p.price) * p.quantity;
    }
    return sum;
  }, 0);

  // Selection callbacks
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(cartProducts.map((p) => p.id)));
  }, [cartProducts]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const deleteSelected = useCallback(() => {
    for (const id of effectiveSelectedIds) {
      removeFromCart(id);
    }
    setSelectedIds(new Set());
  }, [effectiveSelectedIds, removeFromCart]);

  const shareSelected = useCallback(async () => {
    const products = cartProducts.filter((p) => effectiveSelectedIds.has(p.id));
    const text = products
      .map((p) => `${p.name} — ${p.price.toLocaleString("ru-RU")} ₽`)
      .join("\n");

    if (navigator.share) {
      await navigator.share({ title: "Корзина", text });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  }, [cartProducts, effectiveSelectedIds]);

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-full flex-col">
        <Container className="overflow-x-hidden">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </Container>

        <Container
          className="flex flex-1 flex-col items-center justify-center
            text-center"
        >
          <BagIcon className="mb-4 size-16 text-disabled" />
          <Text size="lg" className="font-semibold">
            Корзина пуста
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Добавьте товары из каталога, чтобы оформить заказ
          </Text>
        </Container>

        <div className="mt-auto">
          <Footer variant="default" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Container className="overflow-x-hidden">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="sm:mt-6">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Header — desktop only, mobile has it in the app header */}
            <div className="hidden items-center gap-3 sm:flex">
              <Heading size="lg">Корзина</Heading>
              <Chip variant="outline-default" size="sm" rounded="full">
                {pluralizeItems(
                  cartProducts.reduce((s, p) => s + p.quantity, 0),
                )}
              </Chip>
            </div>

            {/* Selection bar */}
            <div className="mt-4">
              <CartSelectionBar
                selectedCount={effectiveSelectedIds.size}
                totalCount={cartProducts.length}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onDeleteSelected={deleteSelected}
                onShareSelected={shareSelected}
              />
            </div>

            {/* In-stock group */}
            {inStockProducts.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Box className="size-2 rounded-full bg-success-500" />
                  <Text size="sm" className="font-medium">
                    В наличии
                  </Text>
                  <Text size="sm" variant="secondary">
                    {pluralizeItems(
                      inStockProducts.reduce((s, p) => s + p.quantity, 0),
                    )}
                  </Text>
                </div>

                <div className="mt-3 space-y-3">
                  {inStockProducts.map((product) => (
                    <CartItem
                      key={product.id}
                      product={product}
                      isSelected={effectiveSelectedIds.has(product.id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pre-order group */}
            {preOrderProducts.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <Box className="size-2 rounded-full bg-warning-500" />
                  <Text size="sm" className="font-medium">
                    Под заказ
                  </Text>
                  <Text size="sm" variant="secondary">
                    {pluralizeItems(
                      preOrderProducts.reduce((s, p) => s + p.quantity, 0),
                    )}
                  </Text>
                  <span
                    className="ml-1 rounded-md bg-[#FDEAF0] px-3 py-1.5
                      text-xs font-semibold text-secondary-500"
                  >
                    Ожидание 15 – 20 дней
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {preOrderProducts.map((product) => (
                    <CartItem
                      key={product.id}
                      product={product}
                      isSelected={effectiveSelectedIds.has(product.id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar — desktop only */}
          <div className="hidden w-85 shrink-0 lg:block">
            <div className="sticky top-6">
              <CartSummary
                totalItems={totalItems}
                subtotal={subtotal + discount}
                discount={discount}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile order summary */}
      <Container className="mt-8 lg:hidden">
        <CartSummary
          totalItems={totalItems}
          subtotal={subtotal + discount}
          discount={discount}
        />
      </Container>

      <div className="mt-20">
        <Footer variant="default" />
      </div>
    </>
  );
}
